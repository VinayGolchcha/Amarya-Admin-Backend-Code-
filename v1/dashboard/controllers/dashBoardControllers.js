import { validationResult } from "express-validator";
import { fetchAnnouncementsQuery, fetchActivityQuery, getUserProfileQuery, feedbackFormQuery } from "../models/dashBoardQuery.js";
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js"
import dotenv from "dotenv";
import cloudinary from "cloudinary";
// import { incrementId } from "../../helpers/functions.js"
dotenv.config();

export const fetchAnnouncements = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "")
    }

    let [data] = await fetchAnnouncementsQuery();
    return successResponse(res, data, 'Announcements Fetched Successfully');
  } catch (error) {
    next(error);
  }
}

export const getAllActivities = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }

    let [data] = await fetchActivityQuery();
    return successResponse(res, data, "Activiy Fetched Successfully");
  } catch (err) {
    next(err);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "")
    }
    const { emp_id } = req.body;
    const [data] = await getUserProfileQuery([emp_id])
    if (data.length == 0) {
      return notFoundResponse(res, '', 'Employee Data  not found.');
    }
    return successResponse(res, data, ' Employee Data Found successfully');
  } catch (error) {
    next(error);
  }

} 
/*
export const uploadPicture=async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) 
      {
            cloudinary.config({
                cloud_name: 'dnmusgx2e',
                api_key: '264954296543697',
                api_secret: 'G98KJECfYIHztH2IpwuZoJbDDyE'
            });

        }

    }
    catch (err) {
        next(err);
      }
};
*/

export const feedbackForm= async(req,res,next)=>{
  try{
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "")
  }
  const {emp_id, subject,description,Date} = req.body; 
  await feedbackFormQuery([
    emp_id,
    subject,
    description,
    new Date(),
  ]);
  return successResponse(res, 'Feedback send  successfully.');
} catch (error) {
  next(error);
}
};
