
import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js"
import {assetApprovalQuery, fetchAssetDataQuery, assetRejectionQuery, deleteAssetQuery} from "../models/assetApprovalQuery.js"
import {fetchTrainingDataQuery, trainingApprovalQuery, trainingRejectionQuery, deleteTrainingQuery} from "../models/trainingApprovalQuery.js"
dotenv.config();


export const assetApprovalByAdmin = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }

        const { emp_id, status, foreign_id, item, request_type } = req.body;
        const current_date = new Date().toISOString().split('T')[0];
        let message = "";

        const handleInventoryRequest = async () => {
            const [requestData] = await fetchAssetDataQuery([emp_id, item]);

            if (requestData.length === 0) {
                return notFoundResponse(res, '', 'Asset not found');
            }

            if (status === "approved") {
                await assetApprovalQuery([foreign_id, current_date, status, emp_id, item], [status, current_date, current_date, foreign_id, emp_id, item]);
                message = 'Asset approved successfully';
            } else if (status === "rejected") {
                await assetRejectionQuery([status, emp_id, item], [status, emp_id, item]);
                message = 'Asset rejected successfully';
            } else {
                await deleteAssetQuery([foreign_id, emp_id]);
            }
        };

        const handleTrainingRequest = async () => {
            const [requestData] = await fetchTrainingDataQuery([emp_id, foreign_id]);

            if (requestData.length === 0) {
                return notFoundResponse(res, '', 'Training not found');
            }

            if (status === "approved") {
                await trainingApprovalQuery([status, emp_id, foreign_id], [status, current_date, emp_id, foreign_id]);
                message = 'Training approved successfully';
            } else if (status === "rejected") {
                await trainingRejectionQuery([status, emp_id, foreign_id], [status, emp_id, foreign_id]);
                message = 'Training rejected successfully';
            } else {
                await deleteTrainingQuery([foreign_id, emp_id]);
            }
        };

        if (request_type === "inventory") {
            await handleInventoryRequest();
        } else if (request_type === "training") {
            await handleTrainingRequest();
        }

        return successResponse(res, "", message);
    } catch (error) {
        next(error);
    }
};
