import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import {incrementId,createDynamicUpdateQuery} from "../../helpers/functions.js"

dotenv.config();

import {userRegistrationQuery, getUserDataByUsernameQuery, userDetailQuery, updateTokenQuery, 
<<<<<<< HEAD
        getLastEmployeeIdQuery, updateUserPasswordQuery, getAllLeaveCounts, insertUserLeaveCountQuery, checkUserNameAvailabilityQuery,updateUserProfileQuery,getFetchAllEmployeQuery,getUserDataQuery} from "../models/userQuery.js";
=======
        getLastEmployeeIdQuery, updateUserPasswordQuery, getAllLeaveCounts, insertUserLeaveCountQuery, checkUserNameAvailabilityQuery, insertOtpQuery, getOtpQuery} from "../models/userQuery.js";
>>>>>>> 7c7780fb0fd9887875e39ffe8a97d51d4e40d6c6

export const userRegistration = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let id = ''
        let [emp_data] = await getLastEmployeeIdQuery();

        if (emp_data.length == 0) {
            id = 'AMEMP000'
        }else{
            id = emp_data[0].emp_id
        }
        const emp_id = await incrementId(id)

        let { username, first_name, last_name, email, password, state_name,
            city_name,
            profile_picture, 
            blood_group,
            mobile_number,
            emergency_contact_number,
            emergency_contact_person_info,
            address,
            dob, 
            designation,
            designation_type,
            joining_date,
            experience,
            completed_projects,
            performance,
            teams,
            client_report, role = 'user' } = req.body;
        email = email.toLowerCase();
        const [existingUser] = await userDetailQuery([email]);
        const [existingUserName] = await checkUserNameAvailabilityQuery([username]);
        if (existingUserName.length) {
            return successResponse(res, {is_user_name_exists: true}, 'User name already exists, please choose another user name.');
        }
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
            state_name,
            city_name,
            profile_picture, 
            blood_group,
            mobile_number,
            emergency_contact_number,
            emergency_contact_person_info,
            address,
            dob, 
            designation,
            designation_type,
            joining_date,
            experience,
            completed_projects,
            performance,
            teams,
            client_report,
            role
        ]);
        let [leaveTypeAndCount] = await getAllLeaveCounts();
        for(let i = 0; i < leaveTypeAndCount.length; i++) {
            let leaveType = leaveTypeAndCount[i].leave_type;
            let leaveCount = leaveTypeAndCount[i].leave_count;
            await insertUserLeaveCountQuery([emp_id, leaveType, leaveCount])
        }
        
        return successResponse(res, user_data, 'User successfully registered');
    } catch (error) {
        next(error);
    }
};

export const checkUserNameAvailability = async(req, res, next) =>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {user_name} = req.body;
        const [existingUserName] = await checkUserNameAvailabilityQuery([user_name]);
        if (existingUserName.length) {
            return successResponse(res, {is_user_name_exists: 1}, 'User name already exists, please choose another user name.');
        }else{
            return successResponse(res, {is_user_name_exists: 0}, 'User name available.');
        }
    } catch (error) {
        next(error);
    }
}

export const sendOtpForPasswordUpdate = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { email } = req.body;
        const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
        const otpdata = await insertOtpQuery([otp, email])
        if (otpdata[0].changedRows === 0) {
            return errorResponse(res, '', 'Sorry, User not found. Please take a moment to register for an account.');
        } else {
            const data = await sendMail(email, `${otp} is the OTP for password update. Enter the Otp and then change password after the OTP is verified!\n\n\n\nRegards,\nAmarya Business Consultancy`, 'Password Change Verification');
            return successResponse(res, data, 'OTP for password update has been sent successfully.');
        }
    } catch (error) {
        next(error);
    }
}

export const verifyEmailForPasswordUpdate = async (req, res, next)=> {
    try{
        let { otp, email } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        otp = parseInt(otp, 10);
        const [user_otp] = await getOtpQuery([email]);
        if (otp === user_otp[0].otp) {
            return successResponse(res, [{ email: email}], 'OTP verified successfully.');
        } else {
            return errorResponse(res, '', 'Invalid OTP');
        }
    } catch (error) {
        next(error);
    }
}

export const userLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const { username, password } = req.body;
        const [user] = await getUserDataByUsernameQuery([username]);
        if (user.length == 0 ){
            return notFoundResponse(res, '', 'User not found');
        }else{
            let message = '';
            let token = '';
            if (username && password) {
                const isPasswordValid = await bcrypt.compare(password, user[0].password);
                if (isPasswordValid) {
                    message = 'You are successfully logged in';
                } else {
                    return unAuthorizedResponse(res, '', 'Authentication failed');
                }
            } else {
                return notFoundResponse(res, '', 'Input fields are incorrect!');
            }
            token = jwt.sign({ user_id: user[0].emp_id, name: user[0].first_name }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION_TIME,
            });
            await updateTokenQuery([ token, user[0].emp_id]);
            return successResponse(res, [{ user_id: user[0].emp_id, token: token, profile_picture:user[0].profile_picture, user_name: user[0].username  }], message);
        }
    }
    catch(error){
        next(error);
    }
}

export const userLogout = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        console.log(user_id)
        await updateTokenQuery(["", user_id]);
        return successResponse(res, '', `You have successfully logged out!`);
    } catch (error) {
        next(error);
    }
}

export const updateUserPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const { email, password, confirm_password } = req.body;
        let [user_data] = await userDetailQuery([email]);
        if (user_data.length == 0) {
            return notFoundResponse(res, '', 'User not found');
        }
        if (password === confirm_password) {
            const password_hash = await bcrypt.hash(password.toString(), 12);
            await updateUserPasswordQuery([password_hash, email]);
            return successResponse(res, 'User password updated successfully');
        } else {
            return notFoundResponse(res, '', 'Password and confirm password must be same, please try again.');
        }
    } catch (error) {
        next(error);
    }
}

export const updateUserProfile = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const user_id = req.params.id;
        let table = 'users';

        const condition = {
            emp_id: user_id,
        };
        const req_data = req.body; 
        let query_values = await createDynamicUpdateQuery(table, condition, req_data)
        //console.log(query_values.updateQuery, query_values.updateValues)
        await updateUserProfileQuery(query_values.updateQuery, query_values.updateValues);
        return successResponse(res, 'User profile Updated');
    } catch (error) {
        next(error);
    }
}

export const getUserData= async(req,res,next)=>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const  {emp_id} = req.body;
        const [data] = await getUserDataQuery([emp_id])
        if(data.length == 0){
            return notFoundResponse(res, '', 'Employee Data  not found.');
        }
        return successResponse(res, data, ' Employee Data Found successfully');
    } catch (error) {
        next(error);
    }

}


export const getFetchAllEmploye= async(req,res,next)=>{
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const [data] = await getFetchAllEmployeQuery()
        if(data.length == 0){
            return notFoundResponse(res, '', 'employee not found.');
        }
        return successResponse(res, data, ' All employee fetched successfully');
    } catch (error) {
        next(error);
    }
}


