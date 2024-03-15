import dotenv from "dotenv"
import {
    createHoliday, updateHolidayQuery, createLeaveType,
    createLeaveCount, updateLeaveQuery, fetchLeavesCountQuery,
    fetchLeavesTypesQuery, insertUserLeaveDataQuery, insertApprovalForLeaveQuery, getLastLeaveId, getLeaveTypeCountByAdmin,
    getAllUsersLeaveCountQuery
} from "../../leaves/models/leaveQuery.js"
import { leaveTakenCountQuery } from "../../approvals/models/leaveApprovalQuery.js"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { validationResult } from "express-validator";
dotenv.config();

export const addHoliday = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { date, holiday } = req.body;
        await createHoliday([date, holiday]);
        return successResponse(res, '', `Holiday added successfully.`);
    } catch (error) {
        next(error);
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
            return notFoundResponse(res, '', 'Holiday not found, wrong input.');
        }
        return successResponse(res, data, 'Holiday Updated Successfully');
    } catch (error) {
        next(error);
    }
}

export const addLeaveType = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { leave_type, description } = req.body;
        await createLeaveType([leave_type, description]);
        return successResponse(res, '', `Leave type added successfully.`);
    } catch (error) {
        next(error);
    }
}
export const addLeaveTypeAndCount = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { leave_type_id, leave_type, leave_count, gender } = req.body;
        await createLeaveCount([leave_type_id, leave_type, leave_count, gender]);
        return successResponse(res, '', `Leave added successfully.`);
    } catch (error) {
        next(error);
    }
}

export const updateLeave = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const req_data = req.body;
        const id = req.params.id;

        let table = 'leaveTypeCounts';

        const condition = {
            _id: id
        };

        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateLeaveQuery(query_values.updateQuery, query_values.updateValues)

        if (data.affectedRows == 0) {
            return notFoundResponse(res, '', 'Leave not found, wrong input.');
        }
        return successResponse(res, data, 'Leave Updated Successfully');
    } catch (error) {
        next(error);
    }
}

export const fetchLeavesCount = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await fetchLeavesCountQuery()
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'Leave data fetched successfully');
    } catch (error) {
        next(error);
    }
}
export const fetchListOfLeaves = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await fetchLeavesTypesQuery()
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'Leave data fetched successfully');
    } catch (error) {
        next(error);
    }
}

export const leaveRequest = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let { leave_type, emp_id, subject, body, from_date, to_date } = req.body;
        const current_date = new Date().toISOString().split('T')[0];
        let from = new Date(from_date);
        let to = new Date(to_date);

        // Calculate the difference in milliseconds
        let diffInMs = Math.abs(to - from);

        // Convert the difference to days
        let daysCount = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        let total_days = daysCount + 1
        let [userLeaveTakenCount] = await leaveTakenCountQuery([emp_id, leave_type])
        let [leaveTypeCountByAdmin] = await getLeaveTypeCountByAdmin([leave_type])
        let message = ""
        if(leaveTypeCountByAdmin[0].leave_count>=(total_days+userLeaveTakenCount[0].leave_taken_count)){
            await insertUserLeaveDataQuery([
                emp_id, 
                leave_type,
                from_date,
                to_date,
                subject,
                body
            ]);
            const [foreign_id] = await getLastLeaveId()
            await insertApprovalForLeaveQuery([emp_id, foreign_id[0]._id, "leave", leave_type, current_date, from_date, to_date, subject, body])
            message = 'Request sent successfully'
        }else{
            message = `User exceeded the leave count by ${(total_days+userLeaveTakenCount[0].leave_taken_count)-leaveTypeCountByAdmin[0].leave_count}`
        }

        return successResponse(res, "", message);
    } catch (error) {
        next(error);
    }
}

export const getAllUsersLeaveCountByAdmin =async (req, res, next) => {
    try {
        const [data] = await getAllUsersLeaveCountQuery()
        return successResponse(res, data, "Data fetched successfully");
    } catch (error) {
        next(error);
    }
}