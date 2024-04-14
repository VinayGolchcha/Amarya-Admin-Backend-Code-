import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js"
import { insertAssetQuery, getLastAssetIdQuery, insertUserAssetDataQuery, fetchUserAssetsQuery, deleteAssetQuery, getAssetDataQuery, fetchAssetsQuery, updateAssetQuery } from "../models/assetQuery.js";
import {insertApprovalQuery} from "../../approvals/models/assetApprovalQuery.js";
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
dotenv.config();


export const createAsset = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let id = ''
        let [asset_data] = await getLastAssetIdQuery();

        if (asset_data.length == 0) {
            id = 'AMINV000'
        } else {
            id = asset_data[0].asset_id
        }
        const asset_id = await incrementId(id)

        const { asset_type, item, purchase_date, warranty_period, price, model_number, item_description, image_url } = req.body;
        await insertAssetQuery([
            asset_id,
            asset_type,
            item,
            purchase_date,
            warranty_period,
            price,
            model_number,
            item_description,
            image_url,
            new Date(),
            new Date(),
        ]);
        return successResponse(res, 'Asset successfully added');
    } catch (error) {
        next(error);
    }
}

export const updateAsset = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const req_data = req.body;
        const id = req.params.id;

        let table = 'assets';

        const condition = {
            asset_id: id
        };

        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateAssetQuery(query_values.updateQuery, query_values.updateValues)

        if (data.affectedRows == 0){
            return notFoundResponse(res, '', 'Asset not found, wrong input.');
        }
        return successResponse(res, data, 'Asset Updated Successfully');
    } catch (error) {
        next(error);
    }
}

export const assetRequest = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let { asset_type, emp_id, item, primary_purpose, requirement_type, request_type, details } = req.body;
        const current_date = new Date().toISOString().split('T')[0];

        await insertApprovalQuery([emp_id, request_type, item, current_date, primary_purpose, details ])
        const [data] = await insertUserAssetDataQuery([
            emp_id,
            asset_type,
            item,
            requirement_type,
            primary_purpose,
            details
        ]);
        return successResponse(res, data, 'Request sent successfully');
    } catch (error) {
        next(error);
    }
}

export const fetchUserAssets = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {emp_id} = req.body.emp_id;
        const [data] = await fetchUserAssetsQuery([emp_id])
        if(data.length == 0){
            return notFoundResponse(res, '', 'Data not found for this user.');
        }
        return successResponse(res, data, 'Asset data fetched successfully');
    } catch (error) {
        next(error);
    }
}

export const fetchAssets = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await fetchAssetsQuery()
        if(data.length == 0){
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'Asset data fetched successfully');
    } catch (error) {
        next(error);
    }
}

export const deleteAsset = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const asset_id = req.params.id;

        const [data] = await getAssetDataQuery([asset_id])
        if (data.length == 0) {
            return errorResponse(res, errors.array(), "Data not found")
        }else{
            await deleteAssetQuery([asset_id]);
            return successResponse(res, "", 'Asset Deleted Successfully');
        }
    } catch (error) {
        next(error);
    }
}