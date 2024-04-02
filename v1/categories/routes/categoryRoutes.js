import express, { Router } from 'express';
import { createCategoryVal, updateCategoryVal, deleteIdVal} from '../../../utils/validation.js';
import { createCategoryForWorksheet, fetchCategoryForWorkSheet, updateCategoryForWorksheet, deleteCategoryForWorksheet} from '../controllers/categoryController.js';
const app = express()
const router = Router();

app.post('/create-category',createCategoryVal, createCategoryForWorksheet);
app.put("/update-category/:id",updateCategoryVal, updateCategoryForWorksheet);
app.get('/fetch-all-categories', fetchCategoryForWorkSheet);
app.delete('/delete-category/:id',deleteIdVal, deleteCategoryForWorksheet);

app.use("/", router);

export default app;