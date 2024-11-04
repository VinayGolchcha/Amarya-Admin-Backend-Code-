import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import crypto from 'crypto-js';
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { incrementId, createDynamicUpdateQuery, calculateTotalExperienceInFloat } from "../../helpers/functions.js"
import {sendMail} from "../../../config/nodemailer.js"
import {getTeamQuery} from "../../teams/models/query.js"
import {insertTeamToUser} from "../models/userTeamsQuery.js"
import {uploadImageToCloud, deleteImageFromCloud} from "../../helpers/cloudinary.js";
import {insertEmpImageQuery, deleteImageQuery} from "../../images/imagesQuery.js";
import { create, insertTokenQuery, updateQuery, updateUserDataInMessengerQuery, userDataQuery } from "../models/userMongoQuery.js";
dotenv.config();

import {userRegistrationQuery, getUserDataByUsernameQuery, userDetailQuery, updateTokenQuery, updateUserProfileQuery,
        getLastEmployeeIdQuery, updateUserPasswordQuery, getAllLeaveCounts, insertUserLeaveCountQuery, checkUserNameAvailabilityQuery, insertOtpQuery, getOtpQuery,getUserDataByUserIdQuery
        ,checkUserDataByUserIdQuery, updateUserProfilePictureQuery, fetchAllEmployeeIdsQuery,
        getAllUserData,
        updateExperienceQuery,
        fetchAllEmployeeListQuery} from "../models/userQuery.js";
import { insertPerformanceQuery } from "../../worksheets/models/performanceQuery.js";

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
        let image_url

        const file = req.file;
        let { username, first_name, last_name, email, password,
            gender,
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
            team_id,
            client_report, role = 'user' } = req.body;
        email = email.toLowerCase();
        const [existingUser] = await userDetailQuery([email]);
        const [existingUserName] = await checkUserNameAvailabilityQuery([username]);
        const [team_exists] = await getTeamQuery([team_id]);
        if (existingUserName.length) {
            return successResponse(res, {is_user_name_exists: true}, 'User name already exists, please choose another user name.');
        }
        if (existingUser.length) {
            return successResponse(res, '', 'User with this email already exists.');
        }
        if (team_exists.length == 0){
            return successResponse(res, '', 'No team with this name exists.');
        }

        if(file){
            const imageBuffer = file.buffer;
            let uploaded_data = await uploadImageToCloud(imageBuffer);
            await insertEmpImageQuery(["profile", uploaded_data.secure_url, uploaded_data.public_id, emp_id, file.originalname])
            image_url = uploaded_data.secure_url
        }

        const password_hash = await bcrypt.hash(password.toString(), 12);
        const [user_data] = await userRegistrationQuery([
            emp_id,
            username,
            password_hash,
            first_name,
            last_name,
            email,
            gender,
            image_url, 
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
            team_id,
            client_report,
            role
        ]);

        const user_message_data = {
                username : first_name + " "+ last_name,
                email,
                password: password_hash
        }
        await create(user_message_data)
        await insertTeamToUser([emp_id, team_id]);
        if(role=="user"){
            let [leaveTypeAndCount, performanceData] = await Promise.all([getAllLeaveCounts(), insertPerformanceQuery([emp_id])]);
            for(let i = 0; i < leaveTypeAndCount.length; i++) {
                let leaveType = leaveTypeAndCount[i].leave_type;
                let leaveCount = leaveTypeAndCount[i].leave_count;
                let leaveTypeId = leaveTypeAndCount[i]._id
                await insertUserLeaveCountQuery([emp_id, leaveType, leaveCount, leaveTypeId])
            }
        }
        return successResponse(res, user_data, 'User successfully registered');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

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
        return internalServerErrorResponse(res, error);
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
        const [user_exist] = await userDetailQuery([email])

        if (user_exist.length > 0) {
            const [user_otp] = await getOtpQuery([email]);
            if (otp === user_otp[0].otp) {
                return successResponse(res, [{ email: email}], 'OTP verified successfully.');
            } else {
                return errorResponse(res, '', 'Invalid OTP');
            }
        }else{
            return errorResponse(res, '', 'User not found');
        }
        
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const userLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }

        const { username, password } = req.body;
        const [user] = await getUserDataByUsernameQuery([username]);

        if (user.length === 0) {
            return successResponse(res, [], 'User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        const user_id = user[0].emp_id;
        if (!isPasswordValid) {
            return unAuthorizedResponse(res, '', 'Authentication failed');
        }

        // const ip_address = req.ip || req.connection.remoteAddress; // Get user's IP address
        const encrypted_user_id = crypto.AES.encrypt(user_id.toString(), process.env.ENCRYPTION_SECRET).toString();
        const token = jwt.sign({
            user_id: user_id,
            name: user[0].first_name,
            role: user[0].role,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION_TIME,
        });

        await updateTokenQuery([token, user_id]);
        // Set JWT and user_id as HttpOnly and SameSite=Strict cookies
        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true, // Only use Secure in production
            maxAge: parseInt(process.env.JWT_EXPIRATION_TIME) * 1000
        });
        res.cookie('user_id', user[0].emp_id, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/',
            maxAge: parseInt(process.env.JWT_EXPIRATION_TIME) * 1000
        });
        res.setHeader('x-encryption-key', encrypted_user_id);
        console.log(encrypted_user_id);
        return successResponse(res, [{
            user_id: user[0].emp_id,
            profile_picture: user[0].profile_picture,
            user_name: user[0].username,
            role: user[0].role,
            designation: user[0].designation,
            full_name: user[0].first_name + ' ' + user[0].last_name
        }], 'You are successfully logged in');

    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}


export const userLogout = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        await updateTokenQuery(["", user_id]);
        if(user_id){
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                path: '/',
              });
            res.clearCookie('user_id', {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                path: '/',
              });
        }
        return successResponse(res, '', `You have successfully logged out!`);
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const updateUserPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let { otp, email, password, confirm_password } = req.body;
        let [user_data] = await userDetailQuery([email]);
        if (user_data.length == 0) {
            return successResponse(res, [], 'User not found');
        }
        otp = parseInt(otp, 10);
        const [user_otp] = await getOtpQuery([email]);
        if (otp != user_otp[0].otp) {
            return errorResponse(res, '', 'Invalid OTP');
        }
        if (password === confirm_password) {
            const password_hash = await bcrypt.hash(password.toString(), 12);
            await updateUserPasswordQuery([password_hash, 0, email]);
            // await updateQuery(email, password_hash)
            return successResponse(res, 'User password updated successfully');
        } else {
            return notFoundResponse(res, '', 'Password and confirm password must be same, please try again.');
        }
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const getUserProfile = async(req,res,next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const emp_id = req.params.emp_id;
        const [user] = await getUserDataByUserIdQuery([emp_id]);
        if (user.length == 0 ){
            return successResponse(res, [], 'User not found');
        }
        else{
            return successResponse(res, [user]);
        }
    }
    catch(error){
        return internalServerErrorResponse(res, error);;
    }
}

export const updateUserProfile = async(req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const id = req.params.id;
        const file = req.file;
        let usersname
        let table = 'users';
        const condition = {
            emp_id: id
        };
        const req_data = req.body;
        delete req_data.password;

        let [exist_id] = await checkUserDataByUserIdQuery([id])

        if (exist_id.length > 0) {
            if(req_data.public_id){
                await deleteImageFromCloud(req_data.public_id);
                await deleteImageQuery([req_data.public_id])
            }
            delete req_data.public_id;
            delete req_data.file;

            if(file){
                const imageBuffer = file.buffer;
                let uploaded_data = await uploadImageToCloud(imageBuffer);
                await insertEmpImageQuery(["profile", uploaded_data.secure_url, uploaded_data.public_id, id, file.originalname])
                await updateUserProfilePictureQuery([uploaded_data.secure_url, id])
            }
            if(Object.keys(req_data).length !== 0){
            let query_values = await createDynamicUpdateQuery(table, condition, req_data)
            await updateUserProfileQuery(query_values.updateQuery, query_values.updateValues);
            if(req_data.first_name){
                if(req_data.last_name){
                        usersname = req_data.first_name + " " + req_data.last_name
                }
                usersname = req_data.first_name + " " + exist_id[0].last_name
            }else if(req_data.last_name){
                usersname = exist_id[0].first_name + " " + req_data.last_name
            }
                await updateUserDataInMessengerQuery(exist_id[0].email, usersname)
            }
            return successResponse(res, [], 'User profile updated successfully.');
        }else{
            return successResponse(res, [], 'User not found.');
        }
    }
    catch(error){
        return internalServerErrorResponse(res, error);;
    }
}

export const fetchAllEmployeeIds = async(req, res, next) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
       
        let [emp_ids] = await fetchAllEmployeeIdsQuery()
        return successResponse(res, emp_ids, 'Emp ids fetched successfully.');
    }
    catch(error){
        return internalServerErrorResponse(res, error);;
    }
}

export const userGhostLogin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let is_email_verified = true;
        const { email, password } = req.body;
        const user = await userDataQuery(email);
        if (!user) {
            return errorResponse(res, '', 'User not found');
        }
        const currentUser = user;
        if (currentUser.is_email_verified===false) {
            is_email_verified = false;
            return errorResponse(res, {is_email_verified:is_email_verified}, 'Please verify your email first before proceeding.');
        }
        let message = '';
        let token = '';
        if (email && password) {
            const isPasswordValid = await bcrypt.compare(password, currentUser.password);
            if (isPasswordValid) {
                message = 'You are successfully logged in';
            } else {
                return unAuthorizedResponse(res, '', 'Password is not correct. Please try again.');
            }
        } else {
            return errorResponse(res, '', 'Input fields are incorrect!');
        }
        token = jwt.sign({ id: currentUser._id, name: currentUser.user_name }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION_TIME,
        });
        await insertTokenQuery(token, currentUser._id);
        // res.cookie('token', token, {
        //     domain: 'vercel.app',
        //     path: '/',
        //     httpOnly: true,
        //     sameSite: 'None',
        //     secure: true,
        //     maxAge: parseInt(process.env.JWT_EXPIRATION_TIME) * 1000
        //   });
        const cookie_value = `token=${token}; Domain=vercel.app; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${parseInt(process.env.JWT_EXPIRATION_TIME) * 1000}`;
        res.header('Set-Cookie', cookie_value);
        return successResponse(res, { user_id: currentUser._id, user_name: currentUser.username + " " , email: email, is_email_verified: is_email_verified, token: token, socket_id: currentUser.socket_id }, message);
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
}

export const updateExperience = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const [userData] = await getAllUserData();

        for(let i =0; i<=userData.length; i++) {
            let previousExp = userData[i].experience
            let joiningDate = userData[i].joining_date
            let exp = await calculateTotalExperienceInFloat(joiningDate, previousExp);
            await updateExperienceQuery([exp, userData[i].emp_id])
        }
        return successResponse(res, '', 'All experience updated successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchAllEmployeeList = async (req, res, next) => {
    try{
        let [users_list] = await fetchAllEmployeeListQuery()
        if (users_list.length == 0 ){
            return successResponse(res, [], 'User not found');
        }
        return successResponse(res, users_list, 'All employee list fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}