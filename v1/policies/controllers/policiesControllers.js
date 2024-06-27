import { validationResult } from "express-validator";
import { addPolicyQuery, deletePolicyQuery, fetchPolicyQuery, fetchPolicyIfExistsQuery, fetchPolicyByIdQuery } from "../models/policiesQuery.js";
import { errorResponse, internalServerErrorResponse, notFoundResponse, successResponse } from "../../../utils/response.js";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

export const addPolicy = async (req, res, next) => {
    try { 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return errorResponse(res, errors.array() ,"");
        }
        const file_data = req.file;
        const {policy_heads} = req.body;

        const [policy_exists] = await fetchPolicyIfExistsQuery();

        if (policy_exists.length > 0) {
            return notFoundResponse(res, '', "Policy File already exists, if you want to add new file, pls delete the existing one.");
        }
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const target_directory = path.join(`${__dirname}`, '..','..','..','downloads', file_data.originalname);
        fs.writeFileSync(target_directory, file_data.buffer);
        let [data] = await addPolicyQuery([
            policy_heads,
            file_data.originalname
        ])
        return successResponse(res, data, "Policy added Successfully");
    }catch (error){
        return internalServerErrorResponse(res, error);
    } 
}

export const deletePolicy = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }
        const id = req.params.id;

        const [policy] = await fetchPolicyByIdQuery([id]);
        if (!policy) {
            return notFoundResponse(res, "", "Policy not found, wrong input.");
        }

        const file_name = policy[0].file_data;
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const file_path = path.join(__dirname, '..', '..', '..', 'downloads', file_name);

        await deletePolicyQuery([id]);

        if (fs.existsSync(file_path)) {
            fs.unlinkSync(file_path);
        }

        return successResponse(res, "", "Policy Deleted Successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const fetchPolicy = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }
        let [data] = await fetchPolicyQuery();
        if (data.length === 0) {
            return notFoundResponse(res, "", "No policies found.");
        }
        const policy = data[0];
        const file_name = policy.file_data;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const file_url = `${baseUrl}/api/v1/policy/download/${file_name}`;
        return successResponse(res,{file_url, policy_id: policy._id, policy_heads: policy.policy_heads}, "Policy data fetched successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};