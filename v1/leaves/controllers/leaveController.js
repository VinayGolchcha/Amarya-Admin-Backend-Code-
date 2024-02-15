import dotenv from "dotenv"
import {createHoliday} from "../../leaves/models/leaveQuery.js"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
dotenv.config();

export const addHoliday = async (req, res, next) => {
    try {
        const {date, holiday_name} = req.body;
        await createHoliday([date,  holiday_name]);
        return successResponse(res, '', `Holiday added successfully.`);
    } catch (error) {
        next(error);
    }
}