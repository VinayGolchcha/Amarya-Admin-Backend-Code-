import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import { insertUserWorksheetQuery, updateUserWorksheetQuery, deleteUserWorksheetQuery, fetchUserDataForExcelQuery } from "../models/query.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import moment from "moment-timezone";
import cron from "node-cron"
dotenv.config();

export const createUserWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { emp_id, team_id, category_id, skill_set_id, description, date } = req.body;  // date format should be YYYY-MM-DD
        await insertUserWorksheetQuery([emp_id, team_id, category_id, skill_set_id, description, date]);
        return successResponse(res, 'worksheet filled successfully.');
    } catch (error) {
        next(error);
    }
};

export const updateUserWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const user_worksheet_id = req.params.id;
        const emp_id = req.params.emp_id;
        let table = 'worksheets';

        const condition = {
            _id: user_worksheet_id,
            emp_id: emp_id
        };
        const req_data = req.body;
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        await updateUserWorksheetQuery(query_values.updateQuery, query_values.updateValues);
        return successResponse(res, 'worksheet updated successfully.');
    } catch (error) {
        next(error);
    }
}

export const deleteUserWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const worksheet_id = req.params.id
        const emp_id = req.params.emp_id;
        await deleteUserWorksheetQuery([worksheet_id, emp_id]);
        return successResponse(res, 'worksheet deleted successfully.');
    } catch (error) {
        next(error);
    }
};

export const createExcelSheetForWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const user_worksheet_data = await fetchUserDataForExcelQuery()
        return successResponse(res, 'testing');
    } catch (error) {
        next(error);
    }
}

// cron.schedule('0 4 1 * *', async () => {
//     try {
//         const user_worksheet_data = await fetchUserDataForExcelQuery()
//     } catch (error) {
//         next(error);
//     }
// });