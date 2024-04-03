import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { deleteSkillSetQuery, insertSkillSetQuery, updateSkillSetQuery } from "../models/query.js";
dotenv.config();
export const createSkillSet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {skill} = req.body;
        await insertSkillSetQuery([skill]);
        return successResponse(res, 'skill created successfully.');
    } catch (error) {
        next(error);
    }
};

export const updateSkillSet = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const skill_id = req.params.id;
        let table = 'skillSets';

        const condition = {
            _id: skill_id,
        };
        const req_data = req.body; // {skill}
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        await updateSkillSetQuery(query_values.updateQuery, query_values.updateValues);
        return successResponse(res, 'skill updated successfully.');
    } catch (error) {
        next(error);
    }
}

export const fetchSkillSets = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await getAllSkillSetQuery();
        if (data.length == 0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data,'Projects fetched successfully.');
    } catch (error) {
        next(error);
    }
}

export const deleteSkillSet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const skill_set_id = req.params.id
        await deleteSkillSetQuery([skill_set_id]);
        return successResponse(res, 'category deleted successfully.');
    } catch (error) {
        next(error);
    }
};