import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js"
import { insertAssetQuery, getLastAssetIdQuery } from "../models/assetQuery.js";
import {incrementId} from "../../helpers/functions.js"
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
        }else{
            id = asset_data[0].asset_id
        }
        const asset_id = await incrementId(id)

        const {asset_type, item, purchase_date, warranty_period, price, model_number, item_description, image_url } = req.body;
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