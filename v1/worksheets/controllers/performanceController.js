import { validationResult } from "express-validator";
import dotenv from "dotenv"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import { getCategoryTotalPointsQuery, getTeamPointsQuery, fetchTeamCountQuery, 
    fetchTeamNameQuery,
    getWeightedAverage,} from "../models/performanceQuery.js"
import { calculateEmpWorkingDaysForEachMonth, getWorkingDaysCount, getWorkingDaysCountPreviousMonth } from "../../helpers/functions.js"
dotenv.config();

export const calculatePerformanceForTeam = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }

        const number_of_working_days_previous_month = getWorkingDaysCountPreviousMonth();

        const [
            [category_points_can_be_earned_per_day],
            [month_data],
            [total_team_count]
        ] = await Promise.all([
            getCategoryTotalPointsQuery(),
            getTeamPointsQuery(),
            fetchTeamCountQuery()
        ]);

        const category_points_can_be_earned_per_month = category_points_can_be_earned_per_day[0].total_points * number_of_working_days_previous_month;

        const team_performance = await Promise.all(total_team_count.map(async team => {
            const team_id = team.team_id;
            const matching_team = month_data.find(item => item._id === team_id);

            if (matching_team) {
                const [team_name_obj] = await fetchTeamNameQuery([team_id]);
                const total_points = category_points_can_be_earned_per_month * team.total_users;
                const team_performance_percentage = (parseInt(matching_team.team_total_earned_points) / total_points) * 100;

                return {
                    team: team_id,
                    team_name: team_name_obj[0].team,
                    team_performance_percent: Math.round(team_performance_percentage)
                };
            }
            return null;
        }));

        const filtered_team_performance = team_performance.filter(performance => performance !== null);

        return successResponse(res, filtered_team_performance, 'Team Performance calculated successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const employeeMonthlyPerformanceBasedOnWorksheetHours = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }
        const {date, emp_id} = req.params;
        const [year, month] = date.split('-');
        let MAX_WORKING_HOURS = process.env.MAX_WORKING_HOURS || 8
        const [number_of_working_days] = await getWorkingDaysCount([year, month, emp_id]);
        const [weighted_average_data] = await getWeightedAverage([date, emp_id], number_of_working_days[0].working_days_count, MAX_WORKING_HOURS);
        if (weighted_average_data.length == 0) {
            return successResponse(res, [], 'Data not found');
        }
        return successResponse(res, weighted_average_data, 'Employee Monthly Performance calculated successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};

export const getAllMonthWeightedAverageData = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }
        const {year, emp_id} = req.params;
        let MAX_WORKING_HOURS = process.env.MAX_WORKING_HOURS || 8
        let working_days = await calculateEmpWorkingDaysForEachMonth(year, emp_id);
        let all_months_weighted_average = {}
        for (const key in working_days) {
            if (Object.prototype.hasOwnProperty.call(working_days, key)) {
                const element = working_days[key];
                const [weighted_average_data] = await getWeightedAverage([`${year+'-'+key}`, emp_id], element, MAX_WORKING_HOURS);
                all_months_weighted_average[key] = weighted_average_data.weighted_average_percentage
            }
        }
        return successResponse(res, all_months_weighted_average, 'Employee Monthly Performance fetched successfully.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const getEmployeeYearlyWeightedAverage = async(req, res, next) => {
    try {
        const {year, emp_id} = req.params;
        let MAX_WORKING_HOURS = process.env.MAX_WORKING_HOURS || 8
        let working_days = await calculateEmpWorkingDaysForEachMonth(year, emp_id);
        let all_months_weighted_average = {}
        for (const key in working_days) {
            if (Object.prototype.hasOwnProperty.call(working_days, key)) {
                const element = working_days[key];
                const [weighted_average_data] = await getWeightedAverage([`${year+'-'+key}`, emp_id], element, MAX_WORKING_HOURS);
                all_months_weighted_average[key] = weighted_average_data.weighted_average_percentage
            }
        }
        let total_sum = 0;
        let total_elements =  []
        for(const key in all_months_weighted_average) {
            let element = all_months_weighted_average[key]
            if(element != 0){
                total_elements.push(element)
            }
            total_sum += element
        }
        let yearly_weighted_average_percentage = total_sum / total_elements.length
        let data  = {}
        data[year] = yearly_weighted_average_percentage
        return successResponse(res, data, 'Employee yearly performance till date.');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}