import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse } from "../../../utils/response.js"
import { getCategoryTotalPointsQuery, getUserPointsQuery, updateUserPerformanceQuery, getTeamPointsQuery, fetchTeamCountQuery, fetchTeamNameQuery} from "../models/performanceQuery.js"
import { getWorkingDaysCountPreviousMonth } from "../../helpers/functions.js"
dotenv.config();

// export const calculatePerFormanceForEachEmployee = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return errorResponse(res, errors.array(), "")
//         }

//         let number_of_working_days_previous_month = getWorkingDaysCountPreviousMonth()    
//         let [category_points_can_be_earned_per_day] = await getCategoryTotalPointsQuery()
//         let category_points_can_be_earned_per_month = category_points_can_be_earned_per_day[0].total_points * number_of_working_days_previous_month

//         let [data] = await getUserPointsQuery()
       
//         //Employee Performance Logic
//         for(let i=0; i< data.length; i++){
//             let emp_id = data[i].emp_id
//             let earned_points = parseInt(data[i].total_earned_points)
//             let monthly_performance = earned_points / category_points_can_be_earned_per_month
//             monthly_performance = Math.round(monthly_performance)
//             // Add Performance to user table
//            await updateUserPerformanceQuery([monthly_performance, emp_id])
//         }

//         return successResponse(res, 'Performance Updated successfully.');
//     } catch (error) {
//         next(error);
//     }
// };

export const calculatePerformanceForTeam = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let team_performance = [];
        let number_of_working_days_previous_month = getWorkingDaysCountPreviousMonth() 
        let [category_points_can_be_earned_per_day] = await getCategoryTotalPointsQuery()
        let category_points_can_be_earned_per_month = category_points_can_be_earned_per_day[0].total_points * number_of_working_days_previous_month
 
        let [month_data] = await getTeamPointsQuery();
        let [total_team_count] = await fetchTeamCountQuery();
 
        for (const team of total_team_count) {
            const team_id = team.team_id;
            const matching_team = month_data.find(item => item._id === team_id);
            if(matching_team) {
                let [team_name] = await fetchTeamNameQuery([team_id])
                let total_points = category_points_can_be_earned_per_month * team.total_users
                let team_performance_percentage = (parseInt(matching_team.team_total_earned_points) / total_points) * 100

                const performance_data = {
                    team: team_id,
                    team_name: team_name[0].team,
                    team_performance_percent: Math.round(team_performance_percentage)
                }

                team_performance.push(performance_data)
            }
        }

        return successResponse(res, team_performance, 'Team Performance calculated successfully.');
    } catch (error) {
        next(error);
    }
};