import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { deleteProjectQuery, getAllProjectQuery, insertProjectQuery, updateProjectWorksheetQuery } from "../models/query.js";
dotenv.config();

export const createProject = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {project, category_id, client_name, project_status, project_lead, start_month, end_month} = req.body;
        await insertProjectQuery([project, category_id, client_name, project_status, project_lead, start_month, end_month]);
        return successResponse(res, 'Project created successfully.');
    } catch (error) {
        next(error);
    }
};

export const updateProject = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id;
        const category_id = req.params.category_id;
        let table = 'projects';

        const condition = {
            _id: id,
            category_id: category_id
        };
        // const {emp_id, team_id, category_id, skill_set, description} = req.body;
        const req_data = req.body;
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        await updateProjectWorksheetQuery(query_values.updateQuery, query_values.updateValues);
        return successResponse(res, 'Project updated successfully.');
    } catch (error) {
        next(error);
    }
}

export const fetchProjects = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await getAllProjectQuery();
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data,'Projects fetched successfully.');
    } catch (error) {
        next(error);
    }
}

export const deleteProject = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const projecy_id = req.params.id;
        const category_id = req.params.category_id;
        await deleteProjectQuery([projecy_id, category_id]);
        return successResponse(res, 'project deleted successfully.');
    } catch (error) {
        next(error);
    }
};