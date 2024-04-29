import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery } from "../../helpers/functions.js"
import { insertUserProjectQuery,getUserProjectQuery,userUpdateProjectQuery,checkProjectIdQuery} from "../models/userProjectQuery.js";
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
    try{
        const project_id = req.body.project_id;
        const [user] = await getUserProjectQuery([project_id]);
        if (user.length == 0 ){
            return notFoundResponse(res, '', 'User project not found');
        }
        else{
            return successResponse(res, [user]);
        }
    }
    catch(err){
        next(err);
    }
}
export const userUpdateProject = async(req, res, next) => {
        try{
            const errors = validationResult(req);
    
            if (!errors.isEmpty()) {
                return errorResponse(res, errors.array(), "")
            }
            const id = req.params.id;
            let table = 'users';
            const condition = {
                project_id: id
            };
            const req_data = req.body;
    
            let [exist_id] = await checkProjectIdQuery([id])
    
            if (exist_id.length > 0) {
                let query_values = await createDynamicUpdateQuery(table, condition, req_data)
                let [data] = await userUpdateProjectQuery(query_values.updateQuery, query_values.updateValues);
                return successResponse(res, data, 'User project updated successfully.');
            }else{
                return notFoundResponse(res, '', 'User not found.');
            }
        }
        catch(err){
            next(err);
        }
    }
