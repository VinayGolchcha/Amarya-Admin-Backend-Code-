import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { insertUserProjectQuery,getUserProjectQuery} from "../models/userProjectQuery.js";
dotenv.config();



export const createUserProject = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { project_id,
            emp_id,
            tech,
            team_id,
            start_month,
            end_month,
            project_manager,
            status} = req.body;
        await insertUserProjectQuery([ project_id,
            emp_id,
            tech,
            team_id,
            start_month,
            end_month,
            project_manager,
            status]);
        return successResponse(res, 'success', 'User Project created successfully.');
    } catch (error) {
        next(error);
    }
};

export const fetchUserProjects = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await getUserProjectQuery();
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data,'Projects fetched successfully.');
    } catch (error) {
        next(error);
    }
}