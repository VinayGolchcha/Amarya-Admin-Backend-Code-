import dotenv from "dotenv"
import {
    createHoliday, updateHolidayQuery, createLeaveType, checkSameHolidayQuery,
    createLeaveCount, updateLeaveQuery, fetchLeavesCountQuery, checkSameLeaveTypeNameQuery, deleteLeaveTypeQuery, getLeavesTypesQuery, insertUserLeaveDataQuery, insertApprovalForLeaveQuery, getLastLeaveId, getLeaveTypeCountByAdmin,
    getAllUsersLeaveCountQuery, getUserLeaveDataQuery, fetchLeaveTakenOverviewQuery, deleteLeaveTypeAndCountQuery, fetchHolidayListQuery, getHolidayDataQuery, deleteHolidayQuery,
    getallUserLeaveDataQuery,
    fetchAllEmployeesQuery,
    insertUserLeaveCountBatch,
    getUserLeaveDataByIdQuery,
    updateUserLeaveQuery,
    fetchUserLeaveTakenOverviewQuery,
    deleteUserLeaveCountsByLeaveTypeId,
    updateLeaveTypeDescriptionQuery
} from "../../leaves/models/leaveQuery.js"
import { checkIfAlreadyRequestedQuery, getUserGender, leaveTakenCountQuery } from "../../approvals/models/leaveApprovalQuery.js"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { validationResult } from "express-validator";
import { updateApprovalLeaveDataQuery } from "../../approvals/models/approvalQuery.js"
import { uploadFileToDrive } from "../../../utils/googleDriveUploads.js"
import moment from "moment"
import pool from "../../../config/db.js"
import { uploadImageToCloud } from "../../helpers/cloudinary.js"

dotenv.config();

export const addHoliday = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { date, holiday } = req.body;

        const [exist_holiday] = await checkSameHolidayQuery([date])
        if (exist_holiday.length > 0) {
            return errorResponse(res, '', 'Sorry, Holiday already exists.');
        }
        await createHoliday([date, holiday]);
        return successResponse(res, '', `Holiday added successfully.`);
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const updateHoliday = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const req_data = req.body;
        const id = req.params.id;

        let table = 'holidays';

        const condition = {
            _id: id
        };

        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateHolidayQuery(query_values.updateQuery, query_values.updateValues)

        if (data.affectedRows == 0) {
            return successResponse(res, '', 'Holiday not found, wrong input.');
        }
        return successResponse(res, data, 'Holiday Updated Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchHolidayList = async (req,res,next) => {
    try {
        const [data] = await fetchHolidayListQuery();
        if (data.length == 0) {
            return successResponse(res, "", "Data not found");
        }
        return successResponse(res, data, 'Holiday List fetched successfully');
    }catch(error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteHoliday = async(req,res,next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id

        const [data] = await getHolidayDataQuery([id]);
        if (data.length == 0) {
            return successResponse(res, "", "Data not found");
        }else{
            await deleteHolidayQuery([id]);
            return successResponse(res, "", 'Data Deleted Successfully');
        }
    }catch(error){
        return internalServerErrorResponse(res, error);
    }
}

export const addLeaveTypeAndCount = async (req, res) => {
    let connection;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "Validation error");
        }

        const { leave_type, description, leave_count, gender } = req.body;

        // Get a connection from the pool
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Check if leave type already exists
        const [existingLeaveTypes] = await checkSameLeaveTypeNameQuery([leave_type], connection);
        if (existingLeaveTypes.length > 0) {
            await connection.rollback();
            return errorResponse(res, '', 'Sorry, Leave Type already exists.');
        }

        // Create leave type
        const [leaveTypeData] = await createLeaveType([leave_type, description], connection);
        const leave_type_id = leaveTypeData.insertId;

        // Create leave count
        await createLeaveCount([leave_type_id, leave_type, leave_count, gender], connection);

        // Fetch employees
        const [employees] = await fetchAllEmployeesQuery(connection);
        if (employees.length > 0) {
            const userLeaveCountData = employees.map(({ emp_id }) => [
                emp_id,
                leave_type_id,
                leave_type,
                leave_count
            ]);

            // Batch insert leave counts
            await insertUserLeaveCountBatch(userLeaveCountData, connection);
        }

        // Commit transaction
        await connection.commit();
        return successResponse(res, '', 'Leave type and count added successfully.');
    } catch (error) {
        if (connection) await connection.rollback(); // Rollback transaction on error
        return internalServerErrorResponse(res, error);
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
};

export const updateLeaveTypeAndCount = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const req_data = req.body;
        const id = req.params.id;
        const leave_type_id = req.params.leave_type_id;
        let table = 'leaveTypeCounts';

        const condition = {
            _id: id,
            leave_type_id:leave_type_id
        };
        if(req_data.description){
            await updateLeaveTypeDescriptionQuery([req_data.description, leave_type_id]);
            delete req_data.description
        }
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateLeaveQuery(query_values.updateQuery, query_values.updateValues)

        if (data.affectedRows == 0) {
            return successResponse(res, '', 'Data not found, wrong input.');
        }
        return successResponse(res, data, 'Data Updated Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteLeaveTypeAndCount  = async (req, res,next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id;
        const leave_type_id = req.params.leave_type_id;
        const [data] = await getLeavesTypesQuery([leave_type_id]);
        if (data.length == 0) {
            return successResponse(res, "", "Data not found");
        }
        await Promise.all([
            await deleteUserLeaveCountsByLeaveTypeId([leave_type_id]),
            await deleteLeaveTypeQuery([leave_type_id]),
            await deleteLeaveTypeAndCountQuery([id, leave_type_id])
        ])
        
        return successResponse(res, "",'Data deleted Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchLeaveTypesAndTheirCount = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await fetchLeavesCountQuery()
        if (data.length == 0) {
            return successResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'Leave data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchLeaveTakenOverview = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let {emp_id, status, date} = req.body;
        status = status || "approved";
        const [data] = await fetchLeaveTakenOverviewQuery([emp_id, status], date)
        if (data.length == 0) {
            return successResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'Leave data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}
export const fetchUserLeaveTakenOverview = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let {emp_id, date} = req.body;
        const [data] = await fetchUserLeaveTakenOverviewQuery([emp_id], date)
        if (data.length == 0) {
            return successResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'Leave data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const leaveRequest = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let { leave_type, emp_id, subject, body, from_date, to_date } = req.body;
        leave_type = leave_type.toLowerCase();
        const current_date = new Date().toISOString().split('T')[0];
        let from = new Date(from_date);
        let to = new Date(to_date);
        const [getUserData] = await getUserGender([emp_id]);
        if(getUserData[0].gender == "male" && leave_type == "maternity leaves") {
            return notFoundResponse(res, "", "Maternity leave is not applicable for male employees.");
        }
        const [existingData] = await checkIfAlreadyRequestedQuery(emp_id, from_date, to_date)
        if(existingData.length > 0){
            return notFoundResponse(res, "", "The requested leave period overlaps with an existing leave request.");
        }
        let new_from_date =  new Date(from).toISOString().split('T')[0];
        if (new_from_date < current_date) {
            return notFoundResponse(res, "", "The 'from' date cannot be in the past.");
        }
        
        if (to < from) {
            return notFoundResponse(res, "", "The 'to' date cannot be before the 'from' date.");
        }
        
        // Calculate the difference in milliseconds
        let diffInMs = Math.abs(to - from);

        // Convert the difference to days
        let daysCount = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        let total_days = daysCount + 1
        let [userLeaveTakenCount] = await leaveTakenCountQuery([emp_id, leave_type])
        let [leaveTypeCountByAdmin] = await getLeaveTypeCountByAdmin([leave_type])
        let message = ""
        if(leaveTypeCountByAdmin.length==0){
            message = "Please select valid leave type."
            return notFoundResponse(res, "", message);
        }
        let file=req.file;
        let file_response;
        if(leaveTypeCountByAdmin[0].leave_count>=(total_days+userLeaveTakenCount[0].leave_taken_count)){
            if(file){
                const max_size = 1 * 1024 * 1024;
                const allowedFileType = 'application/pdf';
                if (file.mimetype !== allowedFileType) {
                    return errorResponse(res, `File ${file.originalname} must be a PDF.`, "");
                }
                if (file.size > max_size) {
                    return errorResponse(res, `File ${file.originalname} exceeds the limit.`, "");
                }
                // file_response=await uploadFileToDrive(file)
                file_response=await uploadImageToCloud('raw',file.buffer,'leave_documents')
            }
            await insertUserLeaveDataQuery([
                emp_id, 
                leave_type,
                from_date,
                to_date,
                subject,
                body,
                file_response.secure_url
            ]);
            const [foreign_id] = await getLastLeaveId()
            await insertApprovalForLeaveQuery([emp_id, foreign_id[0]._id, "leave", leave_type, current_date, from_date, to_date, subject, body])
            message = 'Request sent successfully'
        }else{
            message = `User exceeded the leave count by ${(total_days+userLeaveTakenCount[0].leave_taken_count)-leaveTypeCountByAdmin[0].leave_count}`
        }

        return successResponse(res, "", message);
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const getUserLeaveDataForDashboard =async (req, res, next) => {
    try {
        const emp_id = req.params.id
        const [user_data] = await getAllUsersLeaveCountQuery([emp_id]);
        const [holiday_list_data] = await fetchHolidayListQuery();
        if (user_data.length == 0) {
            return successResponse(res, '', 'Data not found.');
        }
        return successResponse(res, {user_data, holiday_list_data}, "Data fetched successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const getUserLeaveData = async (req, res, next) => {
    try {
        const {emp_id} = req.body;
        const [data] = await getUserLeaveDataQuery([emp_id]);
        if (data.length == 0) {
            return successResponse(res, [], 'Data not found.');
        }
        return successResponse(res, data, "Data fetched successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const getUserAllLeaveData = async (req, res, next) => {
    try {
        const {emp_id} = req.body;
        const [data] = await getallUserLeaveDataQuery([emp_id]);
        if (data.length == 0) {
            return successResponse(res, [], 'Data not found.');
        }
        return successResponse(res, data, "Data fetched successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const updateUserLeaveData = async (req, res, next) => {
    try {
        const leave_id = parseInt(req.params.id);
        const emp_id = req.params.emp_id;
        const { from_date, to_date, leave_type } = req.body;

        if (!leave_id || !emp_id || !from_date || !to_date || !leave_type) {
            return errorResponse(res, "", "Missing required fields");
        }

        const from = new Date(from_date).toISOString().split('T')[0];
        const to = new Date(to_date).toISOString().split('T')[0];
        const current_date = new Date().toISOString().split('T')[0];

        if (from < current_date) {
            return errorResponse(res, "", "The 'from' date cannot be in the past.");
        }
        if (to < from) {
            return errorResponse(res, "", "The 'to' date cannot be before the 'from' date.");
        }

        const total_days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
        const normalized_leave_type = leave_type.toLowerCase();

        const [
            leave_date,
            user_leave_taken,
            leave_type_admin
        ] = await Promise.all([
            getUserLeaveDataByIdQuery([emp_id, leave_id]),
            leaveTakenCountQuery([emp_id, normalized_leave_type]),
            getLeaveTypeCountByAdmin([normalized_leave_type])
        ]);

        if (!leave_date?.[0]?.length) {
            return successResponse(res, [], 'Leave request not found.');
        }
        let leave_request_date = new Date(leave_date[0][0].created_at);
        leave_request_date=leave_request_date.toISOString().split('T')[0]
        const previous_days_date = moment().subtract(process.env.MAX_DAYS_TO_UPDATE, 'days').format('YYYY-MM-DD');
        if(previous_days_date==leave_request_date){
            return errorResponse(res, "", "You cannot update the leave request.");
        }

        if (!leave_type_admin?.[0]?.length) {
            return errorResponse(res, "", "Invalid leave type.");
        }

        const available_leaves = leave_type_admin[0][0].leave_count;
        const taken_leaves = user_leave_taken[0][0].leave_taken_count;
        const requested_total_leaves = total_days + taken_leaves;

        if (requested_total_leaves > available_leaves) {
            return errorResponse(res, "", 
                `Insufficient leave balance.`
            );
        }

        const update_data = {
            from_date,
            to_date,
            leave_type: normalized_leave_type
        };
    
        let query_values = await createDynamicUpdateQuery('leaveDatesAndReasons', { _id: leave_id}, update_data)
        const [data, approval_data] = await Promise.all([updateUserLeaveQuery(query_values.updateQuery, query_values.updateValues), updateApprovalLeaveDataQuery([normalized_leave_type, from_date, to_date, String(leave_id), emp_id])])
        return successResponse(res, data, "Data updated successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}