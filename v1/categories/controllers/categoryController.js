import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import { createDynamicUpdateQuery } from "../../helpers/functions.js";
import { deleteCategoryQuery, getAllCategoryQuery, insertCategoryQuery, updateCategoryWorksheetQuery } from "../models/query.js";


export const createCategoryForWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {category} = req.body;
        await insertCategoryQuery([category]);
        return successResponse(res, 'category created successfully.');
    } catch (error) {
        next(error);
    }
};

export const updateCategoryForWorksheet = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const category_id = req.params.id;
        let table = 'categories';

        const condition = {
            _id: category_id
        };
        // const {emp_id, team_id, category_id, skill_set, description} = req.body;
        const req_data = req.body;
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        await updateCategoryWorksheetQuery(query_values.updateQuery, query_values.updateValues);
        return successResponse(res, 'Category updated successfully.');
    } catch (error) {
        next(error);
    }
}

export const fetchCategoryForWorkSheet = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await getAllCategoryQuery();
        return successResponse(res, data,'Categories fetched successfully.');
    } catch (error) {
        next(error);
    }
}

export const deleteCategoryForWorksheet = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const category_id = req.params.id
        await deleteCategoryQuery([category_id]);
        return successResponse(res, 'category deleted successfully.');
    } catch (error) {
        next(error);
    }
};