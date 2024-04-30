import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { successResponse } from "../../../utils/response.js";
import { fetchEmployeeCountQuery} from "../query/dashboardQuery.js";
dotenv.config();
export const fetchEmployeeCount = async(req, res, next) => {
    try {
        let [data] = await fetchEmployeeCountQuery();
        const responseData = data.map(row => ({
            team: row.team,
            employeeCount: row.employee_count
          }));
        return successResponse(res, responseData, 'Employee Count Fetched Successfully');
    } catch (error) {
        next(error);
    }
}

// export const fetchTeamPerformance = async(req, res, next) => {    
//     try{
//         let [data] = await fetchTeamPerformanceQuery();
//         return successResponse(res, data, 'performace based on teams data fetched succeccfully');
//     }catch(error){
//         next(error);
//     }
// }