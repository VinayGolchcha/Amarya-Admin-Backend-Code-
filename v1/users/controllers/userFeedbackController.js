import { validationResult } from "express-validator";
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js";
import { feedbackFormQuery} from '../models/userFeedbackQuery.js';
import dotenv from "dotenv";
dotenv.config();

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
  