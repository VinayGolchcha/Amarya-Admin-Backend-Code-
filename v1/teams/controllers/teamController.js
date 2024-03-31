import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { deleteTeamQuery, getAllTeamQuery, insertTeamQuery, updateTeamWorksheetQuery } from "../models/query.js";
dotenv.config();

export const createTeam = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {team} = req.body;
        await insertTeamQuery([team]);
        return successResponse(res, 'Team created successfully.');
    } catch (error) {
        next(error);
    }
};

export const updateTeam = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id;
        let table = 'teams';

        const condition = {
            _id: id
        };
        // const {emp_id, team_id, category_id, skill_set, description} = req.body;
        const req_data = req.body;
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        await updateTeamWorksheetQuery(query_values.updateQuery, query_values.updateValues);
        return successResponse(res, 'Team updated successfully.');
    } catch (error) {
        next(error);
    }
}

export const fetchTeams = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await getAllTeamQuery();
        return successResponse(res, data,'Teams fetched successfully.');
    } catch (error) {
        next(error);
    }
}

export const deleteTeam = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const team_id = req.params.id
        await deleteTeamQuery([team_id]);
        return successResponse(res, 'Team deleted successfully.');
    } catch (error) {
        next(error);
    }
};