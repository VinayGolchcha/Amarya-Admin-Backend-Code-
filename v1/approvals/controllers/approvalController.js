
import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js"
import {assetApprovalQuery, deleteAssetQuery, fetchRequestDataQuery} from "../models/assetApprovalQuery.js"
dotenv.config();


export const assetApprovalByAdmin = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const emp_id = req.params.id;
        const {status, warranty_period,issued_from, asset_id, model_number, item} = req.body
        const [requestData] = await fetchRequestDataQuery([emp_id,item])
        if (requestData.length == 0) {
            return notFoundResponse(res, '', 'Asset not found');
        }
        const data = await assetApprovalQuery([asset_id, model_number, warranty_period, issued_from, status, emp_id, item], [status, issued_from, asset_id, emp_id,item])
        return successResponse(res, data, 'Asset approved successfully');
    } catch (error) {
        next(error);
    }
}

export const deleteAssetByAdmin = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {asset_id, emp_id} = req.body;
        const [request_data] = await fetchRequestDataQuery([asset_id])
        console.log(request_data);
        if (request_data.length == 0) {
            return notFoundResponse(res, '', 'Asset not found');
        }
        await deleteAssetQuery([asset_id, emp_id]);
        return successResponse(res,'Asset deleted successfully');
    } catch (error) {
        next(error);
    }
}