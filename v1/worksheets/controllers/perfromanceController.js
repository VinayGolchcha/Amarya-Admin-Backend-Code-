import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import {getCategoryTotalPoints} from "../models/performanceQuery.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
dotenv.config();

export const calculatePerFormanceForEachEmployee = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        
        let category_points_can_be_earned = await getCategoryTotalPoints()
        

        return successResponse(res, 'Performance Updated successfully.');
    } catch (error) {
        next(error);
    }
};