import {successResponse, errorResponse, notFoundResponse} from "../../../utils/response.js";
import { validationResult } from "express-validator";
import {addAnnouncementQuery, fetchActivityQuery, updateAnnouncementQuery, deleteActivityQuery} from "../../announcements/models/announcementQuery.js";
import dotenv from "dotenv";
import { addActivityQuery, getActivityByIdQuery } from "../query/activityQuery.js";
import { crossOriginResourcePolicy } from "helmet";
dotenv.config();

export const addActivity = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
    const { event_type, priority, from_date, to_date, title, description , image_data } =
      req.body;
    if(!image_data){
      return errorResponse(res, ["image data is not empty" ], "");
    }
    const Image = Buffer.from(image_data, 'base64');
    const current_date = new Date();
    const check_from_date = new Date(from_date);
    const check_to_date = new Date(to_date);
    if(check_from_date.toISOString().split('T')[0] < current_date.toISOString().split('T')[0] ){
        return errorResponse(res, errors.array(), "From date should be greater than or equal to current date");
    }
    if(check_to_date < check_from_date){
        return errorResponse(res, errors.array(), "To date should be greater than or equal to the from date");
    }
    if(description.length >200){
        return errorResponse(res, errors.array(), "Description must be written in less than 200 characters");
    }
    if (event_type != "activity") {
      return notFoundResponse(res, "", "Event type not supported");
    }

    

    let [data] = await addActivityQuery([
      event_type,
      priority,
      from_date,
      to_date,
      title,
      description,
      Image
    ]);
    return successResponse(res, data, "Activity added successfully");
  } catch (error) {
    next(error);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }

    const req_data = req.body;
    const id = req.params.id;

    let updateQuery = "UPDATE announcements SET ";
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

    let [data] = await updateAnnouncementQuery(updateQuery, updateValues);

    if (data.affectedRows == 0) {
      return notFoundResponse(res, "", "Activity not found, wrong input.");
    }
    return successResponse(res, data, "Activity Updated Successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllActivities = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
    let event_type = "activity";
    let [data] = await fetchActivityQuery([event_type]);
    return successResponse(res, data, "Activiy Fetched Successfully");
  } catch (err) {
    next(err);
  }
};

export const filterActivityByDate = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
    const date = req.params.date;
    let event_type = "activity";
    let array = await fetchActivityQuery([event_type]);
    const result = array[0].filter((item) => item.created_at.toISOString().includes(date));
    if (result.length === 0) {
      return notFoundResponse(res, result, "Activity not found in specified date");
    }
    return successResponse(res, result, "Activiy Fetched Successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteActivity = async(req,res,next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
    const id  = req.params.id;
    let [data] = await deleteActivityQuery([id]);
    if (data.affectedRows == 0){
      return notFoundResponse(res, '', 'Activity not found, wrong input.');
    }
    return successResponse(res, '', 'Activity Deleted Successfully');
  } catch (err) {
    next(err);
  }
};

export const getActivityById = async(req ,res , next) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
    const { id } = req.params;
    const [data] = await getActivityByIdQuery([id]);
    if (data.length === 0){
      return notFoundResponse(res, '', 'Activity not found, wrong input.');
    }
    return successResponse(res, data, "Activiy Fetched Successfully");
  }catch(err){
    next(err);
  }
}