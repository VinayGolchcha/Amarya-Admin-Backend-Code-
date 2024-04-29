import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {createUserWorksheet, updateUserWorksheet, deleteUserWorksheet, fetchUserWorksheet} from '../controllers/worksheetController.js';
import {calculatePerformanceForTeam} from "../controllers/performanceController.js"
import {createWorksheetVal, updateWorksheetVal, deleteUserWorksheetVal, fetchUserWorksheetVal} from '../../../utils/validation.js';
// router.use(authenticateToken)



app.post('/create-worksheet',createWorksheetVal, createUserWorksheet);
app.put('/update-worksheet/:id/:emp_id',updateWorksheetVal, updateUserWorksheet);
app.delete('/delete-worksheet/:id/:emp_id',deleteUserWorksheetVal, deleteUserWorksheet);
app.get("/fetch-user-worksheet/:emp_id",fetchUserWorksheetVal, fetchUserWorksheet);
app.get("/admin/calculate-team-performance", calculatePerformanceForTeam);

// ##currently commented, as this is converted to a cron, but needs to be here for testing or any change. DO NOT DELETE OR REMOVE THIS API.
// app.get("/calculate-performance", calculatePerFormanceForEachEmployee);  

app.use("/", router);

export default app;