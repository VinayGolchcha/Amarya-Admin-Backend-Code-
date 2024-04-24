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