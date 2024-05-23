import { validationResult } from "express-validator";
import { addPolicyQuery, deletePolicyQuery, fetchPolicyQuery, updatePolicyQuery } from "../models/policiesQuery.js";
import { errorResponse, notFoundResponse, successResponse } from "../../../utils/response.js";
import dotenv from "dotenv";

dotenv.config();

export const handleAddPolicy = async (req ,res , next) => {
    try { 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return errorResponse(res, error.array() ,"");
        }
        const {policy_type , image_data } = req.body;
        let [data] = await addPolicyQuery([
            policy_type,
            image_data
        ])

        return successResponse(res,data,"Policy added Successfully");
    }
    catch (err){
        next(err)
    } 
}
export const handleDeletePolicy = async(req,res,next) =>  {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return errorResponse(res, error.array() ,"");
        }
        const { id } = req.params.id;
        let [data] = await deletePolicyQuery([id]);

        if (data.affectedRows == 0) {
        return notFoundResponse(res, "", "Policy not found, wrong input.");
        }
        return successResponse(res, "", "Policy Deleted Successfully");
    }catch(err) {
        next(err)
    }

} 

export const fetchPolicy = async(req , res , next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return errorResponse(res, error.array(), "");
        }
        let [data] = await fetchPolicyQuery();
        return successResponse(res, data , "Policies fetched successfully");

    }catch(err){
        next(err);
    }

}

export const handleUpdatePolicy = async (req, res , next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return errorResponse(res,error.array(),"");
        }
        const req_data = req.body;
    const id = req.params.id;

    let updateQuery = "UPDATE policies SET ";
    let updateValues = [];

    const condition = {
      _id: id,
    };

    Object.keys(req_data).forEach((key, index, array) => {
      updateQuery += `${key} = ?`;
      updateValues.push(req_data[key]);

      if (index < array.length - 1) {
        updateQuery += ", ";
      }
    });

    updateQuery += " WHERE ";

    Object.keys(condition).forEach((key, index, array) => {
      updateQuery += `${key} = ?`;
      updateValues.push(condition[key]);

      if (index < array.length - 1) {
        updateQuery += " AND ";
      }
    });

    let [data] = await updatePolicyQuery(updateQuery, updateValues);

      
          if (data.affectedRows == 0) {
            return notFoundResponse(res, "", "Policy not found, wrong input.");
          }
          return successResponse(res, data, "Policy Updated Successfully");

    }catch(err){
        next(err);
    }
} 