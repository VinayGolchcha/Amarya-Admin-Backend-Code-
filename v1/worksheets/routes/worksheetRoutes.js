import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {createUserWorksheet, updateUserWorksheet, deleteUserWorksheet} from '../controllers/worksheetController.js';
import {createWorksheetVal, updateWorksheetVal, deleteUserWorksheetVal} from '../../../utils/validation.js';
// router.use(authenticateToken)



app.post('/create-worksheet',createWorksheetVal, createUserWorksheet);
app.put('/update-worksheet/:id/:emp_id',updateWorksheetVal, updateUserWorksheet);
app.delete('/delete-worksheet/:id/:emp_id',deleteUserWorksheetVal, deleteUserWorksheet)


app.use("/", router);

export default app;