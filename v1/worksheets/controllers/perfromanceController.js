import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import { getCategoryTotalPointsQuery, getUserPointsQuery, getAllEmployeesQuery, updateUserPerformanceQuery} from "../models/performanceQuery.js"
import { getWorkingDaysCountPreviousMonth } from "../../helpers/functions.js"
dotenv.config();

export const calculatePerFormanceForEachEmployee = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const current_date = new Date();
        let previous_month = new Date(current_date.getFullYear(), current_date.getMonth() - 1, 1);
        previous_month = previous_month.getMonth() + 1; 
        let number_of_working_days_previous_month = getWorkingDaysCountPreviousMonth()    

        let [category_points_can_be_earned_per_day] = await getCategoryTotalPointsQuery()
        let category_points_can_be_earned_per_month = category_points_can_be_earned_per_day[0].total_points * number_of_working_days_previous_month
        console.log("Monthly earned total points", category_points_can_be_earned_per_month)

        let [employee_data] = await getAllEmployeesQuery()
        let [data] = await getUserPointsQuery([previous_month])
        console.log(data)
       
        //Employee Performance Logic
        for(let i=0; i< data.length; i++){
            let emp_id = data[i].emp_id
            let earned_points = parseInt(data[i].total_earned_points)
            console.log(emp_id, earned_points)

            let monthly_performance = earned_points / category_points_can_be_earned_per_month
            // monthly_performance = Math.round(monthly_performance)
            // Add Performance to user table
           let [emp_data] =  await updateUserPerformanceQuery([monthly_performance, emp_id])
            console.log("monthly performance", monthly_performance)
        }

        return successResponse(res, 'Performance Updated successfully.');
    } catch (error) {
        next(error);
    }
};