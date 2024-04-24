import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { fetchAnnouncementsQuery, fetchActivityQuery, getUserProfileQuery, feedbackFormQuery } from "../models/dashBoardQuery.js";
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js";
import dotenv from "dotenv";
// import { incrementId } from "../../helpers/functions.js"
dotenv.config();
import cloudinaryConfig from "../../../config/cloudinary.js";




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

export const showImage = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "");
    }
      const image ='https://res.cloudinary.com/dnmusgx2e/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1713772470/PicsArt_12_14_01.11.12-q8vcVogs_km0db4.jpg';
      const result = await cloudinaryConfig.uploader.upload(image);
      console.log({ imageUrl: result.secure_url });
      return successResponse(res, imageUrl, 'Image uploaded successfully');
    }
   catch (err) {
    next(err);
  }
};


export const feedbackForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "")
    }
    const { user_id, subject, description } = req.body;
    await feedbackFormQuery([
      user_id,
      subject,
      description
    ]);
    return successResponse(res, 'Feedback send  successfully.');
  } catch (error) {
    next(error);
  }
};