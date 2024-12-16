import express, { Router } from 'express';
const app = express()
const router = Router();
import {createUserWorksheet, updateUserWorksheet, deleteUserWorksheet, fetchUserWorksheet} from '../controllers/worksheetController.js';
import {calculatePerformanceForTeam, employeeMonthlyPerformanceBasedOnWorksheetHours, getAllMonthWeightedAverageData, getEmployeeYearlyWeightedAverage } from "../controllers/performanceController.js"
import {createWorksheetVal, updateWorksheetVal, deleteUserWorksheetVal, fetchUserWorksheetVal, allMonthVal} from '../../../utils/validation.js';
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"
import { generateUserWorksheetExcel } from '../../../crons/cronFunctions.js';



app.post('/create-worksheet', authenticateUserSession, createWorksheetVal, createUserWorksheet);
app.put('/update-worksheet/:id/:emp_id', authenticateUserAdminSession, updateWorksheetVal, updateUserWorksheet);
app.delete('/delete-worksheet/:id/:emp_id',authenticateAdminSession, deleteUserWorksheetVal, deleteUserWorksheet);
app.get("/fetch-user-worksheet/:emp_id", authenticateUserAdminSession, fetchUserWorksheetVal, fetchUserWorksheet);
app.get("/admin/calculate-team-performance", authenticateAdminSession, calculatePerformanceForTeam);
app.get('/admin/get-all-employee-weighted-average/:date/:emp_id', employeeMonthlyPerformanceBasedOnWorksheetHours);
app.get('/all-month-weighted-average/:year/:emp_id',authenticateUserAdminSession,allMonthVal, getAllMonthWeightedAverageData);
app.get('/get-all-year-weighted-average/:year/:emp_id',authenticateUserAdminSession,allMonthVal, getEmployeeYearlyWeightedAverage);
app.post("/upload-worksheet",generateUserWorksheetExcel)

// ##currently commented, as this is converted to a cron, but needs to be here for testing or any change. DO NOT DELETE OR REMOVE THIS API.
// app.get("/calculate-performance", lockYearlyEarnedPointsForEachEmployee);  

app.use("/", router);

export default app;