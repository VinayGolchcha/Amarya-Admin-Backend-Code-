import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {createUserWorksheet, updateUserWorksheet, deleteUserWorksheet, fetchUserWorksheet} from '../controllers/worksheetController.js';
import {createWorksheetVal, updateWorksheetVal, deleteUserWorksheetVal, fetchUserWorksheetVal} from '../../../utils/validation.js';
// router.use(authenticateToken)



app.post('/create-worksheet',createWorksheetVal, createUserWorksheet);
app.put('/update-worksheet/:id/:emp_id',updateWorksheetVal, updateUserWorksheet);
app.delete('/delete-worksheet/:id/:emp_id',deleteUserWorksheetVal, deleteUserWorksheet)
app.get("/fetch-user-worksheet/:emp_id",fetchUserWorksheetVal, fetchUserWorksheet)


app.use("/", router);

export default app;