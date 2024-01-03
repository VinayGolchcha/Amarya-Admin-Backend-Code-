import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse } from "../../../utils/response.js"
dotenv.config();

import {userRegistrationQuery, getUserDataByUsernameQuery,userDetailQuery} from "../models/userQuery.js";

export const userRegistration = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }


        const emp_id = 'AMEMP002'
        const { username, first_name, last_name, email, password } = req.body;
        email = email.toLowerCase();
        const [existingUser] = await userDetailQuery([email]);
        if (existingUser.length) {
            return successResponse(res, '', 'User with this email already exists.');
        }
        const password_hash = await bcrypt.hash(password.toString(), 12);
        const [user_data] = await userRegistrationQuery([
            emp_id,
            username,
            password_hash,
            first_name,
            last_name,
            email,
            new Date(),
            new Date(),
        ]);
        return successResponse(res, user_data, 'User successfully registered');
    } catch (error) {
        next(error);
    }
};
