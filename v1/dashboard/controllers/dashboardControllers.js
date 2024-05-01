import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { successResponse } from "../../../utils/response.js";
import { fetchEmployeeCountQuery} from "../query/dashboardQuery.js";
dotenv.config();
export const fetchEmployeeCount = async(req, res, next) => {
    try {
        let [data] = await fetchEmployeeCountQuery();
        return successResponse(res, data, 'Employee Count Fetched Successfully');
    } catch (error) {
        next(error);
    }
}
