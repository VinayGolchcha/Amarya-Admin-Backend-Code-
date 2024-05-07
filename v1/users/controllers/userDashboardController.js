import { validationResult } from "express-validator";
import { fetchAnnouncementsQuery, fetchActivityQuery,userDashboardProfileQuery,fetchUserProjectQuery,dashboardImageQuery} from "../models/userDashboardQuery.js";
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js";
import dotenv from "dotenv";
import cloudinaryConfig from "../../../config/cloudinary.js";
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

export const userProfileDashboard = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "")
    }
    const { emp_id } = req.body;
    const [data] = await userDashboardProfileQuery([emp_id])
    if (data.length == 0) {
      return notFoundResponse(res, '', 'Employee Data  not found.');
    }
    return successResponse(res, data, ' Employee Data Found successfully');
  } catch (error) {
    next(error);
  }
}

export const getDashImage = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "")
    }
    const {img}=req.body;
    const result=await cloudinaryConfig.uploader.upload(img,{
      folder:"Product",})
   //width:300,
  //crop:scale
  console.log(result.url.secure);
  const Product= await dashboardImageQuery({img:
    {
    public_id:result.public_id,
    url:result.secure_url
  }
});
 console.log(Product)
return successResponse(res, Product, "img successfully saved");
}
 catch (error) {
    next(error);
  }
}


export const getUserProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array(), "")
    }
    const { emp_id } = req.body;
    const [data] = await fetchUserProjectQuery([emp_id])
    if (data.length == 0) {
      return notFoundResponse(res, '', 'user project not fetched successfully');
    }
    return successResponse(res, data, 'user project fetched successfully');
  } catch (error) {
    next(error);
  }
}


