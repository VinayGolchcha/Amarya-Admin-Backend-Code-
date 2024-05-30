import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { successResponse } from "../../../utils/response.js";
import { getMonthlyProjectCountQuery, getUserCountOnClientProjectQuery, getTotalProjectsQuery, getUserCountOnClientProjectBasedOnTeamQuery, 
    getEmployeeTeamCountQuery, fetchAllProjectsDataQuery} from "../query/dashboardQuery.js";
dotenv.config();

export const adminDashboard = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const [
            [live_projects_data],
            [employee_count_with_team],
            [total_projects],
            [employee_count_with_client],
            [get_employee_team_count],
            [project_details]
        ] = await Promise.all([
            getMonthlyProjectCountQuery(),
            getUserCountOnClientProjectBasedOnTeamQuery(),
            getTotalProjectsQuery(),
            getUserCountOnClientProjectQuery(),
            getEmployeeTeamCountQuery(),
            fetchAllProjectsDataQuery()
        ]);

        employee_count_with_team.push(total_projects[0])
        employee_count_with_team.push(employee_count_with_client[0])

        const data = {
            live_projects_data: live_projects_data,
            employee_count_with_team: employee_count_with_team,
            get_employee_team_count: get_employee_team_count,
            project_details: project_details
        }
        return successResponse(res, data, 'Employee Count Fetched Successfully');
    } catch (error) {
        next(error);
    }
}