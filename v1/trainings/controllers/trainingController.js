import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { insertTrainingDataQuery, getLastTrainingIdQuery, addUserTrainingInfoQuery, getTrainingDataQuery, displayDataForTrainingCardsQuery, displayTrainingsForUserQuery, deleteUserTrainingDataQuery, 
    getUserDataForTrainingQuery, deleteTrainingDataQuery, updateTrainingQuery, checkSameTrainingQuery, checkExistingUserTrainingDataQuery, displayAllUsersTrainingDataQuery } from "../models/trainingQuery.js";
import {incrementId, createDynamicUpdateQuery} from "../../helpers/functions.js"
import {insertApprovalForTrainingQuery} from "../../approvals/models/trainingApprovalQuery.js"
import { generateDownloadLinkMySQL } from "../../helpers/downloadLink.js";
dotenv.config();

export const addNewTraining = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let id = ''
        let [training_data] = await getLastTrainingIdQuery();

        if (training_data.length == 0) {
            id = 'AMTRAN000'
        }else{
            id = training_data[0].training_id
        }
        const training_id = await incrementId(id)
        let roadmap_url;
        const file = req.file;
        const {course_name, course_description, details} = req.body;

        const max_size = 1 * 1024 * 1024; // 1MB in bytes
        if (file.size > max_size) {
            return errorResponse(res, `File ${file.originalname} exceeds the limit.`, "");
        }

        const [exist_training] = await checkSameTrainingQuery([course_name])
        if (exist_training.length > 0){
            return notFoundResponse(res, '', 'Sorry, Training with this name already exists.');
        }
     
        const download_link = await generateDownloadLinkMySQL(file.buffer, file.originalname);
        const data = await insertTrainingDataQuery([
            training_id,
            course_name,
            course_description,
            roadmap_url=download_link,
            details
        ]);

        return successResponse(res, data, 'Training successfully added');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const requestUserTraining = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let { emp_id, training_id, progress_status, request_type} = req.body;
        let [training_data] = await getTrainingDataQuery([training_id])
        let [existing_training_data] = await checkExistingUserTrainingDataQuery([emp_id, training_id])
        const current_date = new Date().toISOString().split('T')[0];

        if(training_data.length == 0 ) {
           return notFoundResponse(res, '', "Training Id provided is not correct")
        }else if (existing_training_data.length > 0){
            return notFoundResponse(res, '', `Current training is already registered with the given employee's id.`);
        }else{
            const course_name = training_data[0].course_name;
            const course_description = training_data[0].course_description;
            const details = training_data[0].details;
            const roadmap_url = training_data[0].roadmap_url;

            await insertApprovalForTrainingQuery([emp_id, training_id, request_type, course_name, current_date, course_description, details ])
            await addUserTrainingInfoQuery([
                emp_id,
                training_id,
                course_name,
                course_description,
                details,
                roadmap_url,
                progress_status
            ]);
            return successResponse(res, '', 'Training successfully added');
        }
        
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const trainingCardsData = async (req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const [data] = await displayDataForTrainingCardsQuery([])

        if(data.length == 0) {
            return notFoundResponse(res, "", "No Trainings exists.")
        }else{ 
            return successResponse(res, data, 'Data Fetched Successfully');
        }
    }catch(error) {
        return internalServerErrorResponse(res, error);
    }
};

export const getUserTrainingData = async (req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const  {emp_id} = req.body;
        let [data] = await displayTrainingsForUserQuery([emp_id])

        if(data.length == 0) {
            return notFoundResponse(res, "", "User has not registered in any trainings or the given employee id is wrong.")
        }else{ 
            return successResponse(res, data, 'Data Fetched Successfully');
        }
    }catch(error) {
        return internalServerErrorResponse(res, error);
    }
};

export const updateTrainingData = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
 
        const req_data = req.body;
        const id = req.params.id;
        const file = req.file;

        let table = 'trainings';

        const condition = {
            training_id: id
        };
        const max_size = 1 * 1024 * 1024; // 1MB in bytes
        if(file){
            if (file.size > max_size) {
                return errorResponse(res, `File ${file.originalname} exceeds the limit.`, "");
            }else{
                const download_link = await generateDownloadLinkMySQL(file.buffer, file.originalname);
                req_data.roadmap_url = download_link
            }
        }

        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        let [data] = await updateTrainingQuery(query_values.updateQuery, query_values.updateValues)

        if (data.affectedRows == 0){
            return notFoundResponse(res, '', 'Training not found, wrong input.');
        }
        return successResponse(res, data, 'Training Updated Successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteTrainingData = async (req, res, next) =>{
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id;
        let [data] = await getTrainingDataQuery([id]);

        if (data.length == 0) {
            return notFoundResponse(res, "", "Data not found")
        }else{
            await deleteTrainingDataQuery([id]);
            return successResponse(res, "", 'Data Deleted Successfully');
        }

    }catch(error) {
        return internalServerErrorResponse(res, error);
    }
};

export const getEveryUserTrainingData = async (req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let [data] = await displayAllUsersTrainingDataQuery()

        if(data.length == 0) {
            return notFoundResponse(res, "" ,"No trainings alloted till now.")
        }else{ 
            return successResponse(res, data, 'Data Fetched Successfully');
        }
    }catch(error) {
        return internalServerErrorResponse(res, error);
    }
};