import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, internalServerErrorResponse } from "../../../utils/response.js"
import {assetApprovalQuery, fetchAssetDataQuery, assetRejectionQuery, deleteAssetQuery, checkIfAlreadyAssigned, changeAssetStatusToAvailable} from "../models/assetApprovalQuery.js"
import {fetchTrainingDataQuery, trainingApprovalQuery, trainingRejectionQuery, deleteTrainingQuery} from "../models/trainingApprovalQuery.js"
import {leaveApprovalQuery, deleteLeaveQuery, leaveRejectionQuery, getUserLeaveDaysQuery, leaveTakenCountQuery, checkIfLeaveAlreadyApprovedQuery} from "../models/leaveApprovalQuery.js"
import { fetchUnassignedAssetItemQuery } from "../models/approvalQuery.js";
dotenv.config();


export const approvalByAdmin = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }

        let { emp_id, status, foreign_id, item, request_type, asset_type } = req.body;
        request_type = request_type.toLowerCase();
        status = status.toLowerCase();
        item = item.toLowerCase();
        const current_date = new Date().toISOString().split('T')[0];
        let message = "";
        let statusCode;
        
        const handleInventoryRequest = async () => {
            asset_type = asset_type.toLowerCase();
            if(foreign_id){
                const [requestData] = await fetchAssetDataQuery([foreign_id]);
                if (requestData.length === 0) {
                    message = 'Asset not found';
                    statusCode = 404
                    return {message, statusCode}
                }else if(requestData[0].item != item || (requestData[0].status == "assigned" && status !="delete")){
                    message = 'Inventory id given is not of the requested asset or asset is already assigned';
                    statusCode = 404
                    return {message, statusCode}
                }
            }
            if (status === "approved") {
                try {
                    await assetApprovalQuery([foreign_id, current_date, status, emp_id, item, asset_type], [status, current_date, current_date, foreign_id, emp_id, item, asset_type], [item,foreign_id]);
                    message = 'Asset approved successfully';
                    statusCode = 200
                    return {message, statusCode}
                } catch (error) {
                    message = 'Request item do not match';
                    statusCode = 400
                    return {message, statusCode}
                }
            } else if (status === "rejected") {
                if(foreign_id){
                    const assetData = await checkIfAlreadyAssigned([emp_id, foreign_id, "approved"])
                if (assetData.length > 0) {
                    message = 'Asset already assigned to this user';
                    statusCode = 400
                    return {message, statusCode}
                }
                }
                await assetRejectionQuery([status, emp_id, item], [status, emp_id, item]);
                message = 'Asset rejected successfully';
                statusCode = 200
                return {message, statusCode}
            } else {
                if(foreign_id){
                    await changeAssetStatusToAvailable([item, foreign_id, emp_id]);
                    await deleteAssetQuery([foreign_id, emp_id]);
                    message = 'Asset request deleted successfully';
                    statusCode = 200
                    return {message, statusCode}
                }else{
                    message = 'Either assign the asset or reject the request before deleting the asset request.';
                    statusCode = 200
                    return {message, statusCode}
                }
            }
        };

        const handleTrainingRequest = async () => {
            const [requestData] = await fetchTrainingDataQuery([emp_id, foreign_id]);

            if (requestData.length === 0) {
                return successResponse(res, [], 'Training not found');
            }

            if (status === "approved") {
                if(requestData[0].status==="approved"){
                    message = 'Training request already approved';
                    statusCode = 400
                    return {message, statusCode}
                }
                await trainingApprovalQuery([status, emp_id, foreign_id], [status, current_date, emp_id, foreign_id]);
                message = 'Training request approved successfully';
                statusCode = 200
                return {message, statusCode}
            } else if (status === "rejected") {
                if(requestData[0].status==="rejected"){
                    message = 'Training request already approved';
                    statusCode = 400
                    return {message, statusCode}
                }
                await trainingRejectionQuery([status, emp_id, foreign_id], [status, emp_id, foreign_id]);
                message = 'Training request rejected successfully';
                statusCode = 200
                return {message, statusCode}
            } else {
                await deleteTrainingQuery([foreign_id, emp_id]);
                message = 'Request deleted successfully';
                statusCode = 200
                return {message, statusCode}
            }
        };

        const handleLeaveRequest = async () => {
            let message = "";
            let statusCode = 200; // Default success code
        
            // Fetch user leave data
            let [userLeaveData] = await getUserLeaveDaysQuery([foreign_id]);
            if (userLeaveData.length === 0) {
                message = "Leave data not found.";
                statusCode = 404;
                return { message, statusCode };
            }
        
            // Extract leave data
            const leave_taken_count = userLeaveData[0].days_count + 1;
            const leave_type = userLeaveData[0].leave_type;
            const leave_type_count_by_admin = userLeaveData[0].leave_count;
        
            // Check current leave status
            let [current_status] = await checkIfLeaveAlreadyApprovedQuery([emp_id, foreign_id, request_type]);
            if (!current_status || current_status.length === 0) {
                message = "Leave request status not found.";
                statusCode = 404;
                return { message, statusCode };
            }
        
            if (status === "approved") {
                if (current_status[0].status === "approved") {
                    message = "Leave already approved.";
                    statusCode = 400;
                    return { message, statusCode };
                }
                if (current_status[0].status === "rejected") {
                    message = "Leave already rejected, approval not possible.";
                    statusCode = 400;
                    return { message, statusCode };
                }
        
                let [userLeaveTakenCount] = await leaveTakenCountQuery([emp_id, leave_type]);
                const total_leave_taken = userLeaveTakenCount ? userLeaveTakenCount[0].leave_taken_count + leave_taken_count : leave_taken_count;
        
                if (leave_type_count_by_admin >= total_leave_taken) {
                    await leaveApprovalQuery([leave_taken_count, emp_id, leave_type], [status, current_date, emp_id, foreign_id], [status, foreign_id, leave_type]);
                    message = "Leave approved successfully.";
                } else {
                    message = `User exceeded the leave count by ${total_leave_taken - leave_type_count_by_admin}.`;
                }
        
            } else if (status === "rejected") {
                if (current_status[0].status === "approved") {
                    message = "Leave already approved, rejection not possible.";
                } else {
                    await leaveRejectionQuery([status, emp_id, foreign_id], [status, foreign_id, leave_type]);
                    message = "Leave rejected successfully.";
                }
        
            } else if (status === "deleted") {
                await deleteLeaveQuery([emp_id, foreign_id], [foreign_id, leave_type]);
                message = "Leave deleted successfully.";
        
            } else {
                message = "Invalid leave status provided.";
                statusCode = 400;
            }
        
            return { message, statusCode };
        };
        
        let data;
        if (request_type === "inventory") {
             data=await handleInventoryRequest();
        } else if (request_type === "training") {
             data=await handleTrainingRequest();
        }else if(request_type === "leave"){
             data=await handleLeaveRequest();
        }

        if(data.statusCode==200){
            return successResponse(res, "", data.message);
        }else{
            return successResponse(res, [], data.message);
        }
    } catch (error) {
        console.log(error);
        return internalServerErrorResponse(res, error);
    }
};

export const fetchUnassignedAssetItem = async(req, res, next) => {
    try {
        const {item, asset_type} = req.query
        let [asset_data] = await fetchUnassignedAssetItemQuery([item, asset_type])
        if(asset_data.length == 0) {
            return successResponse(res, [], 'Asset not found')
        }
        return successResponse(res, asset_data, "Asset fetched successfully");
    } catch (error) {
        console.log(error);
        return internalServerErrorResponse(res, error);
    }
}