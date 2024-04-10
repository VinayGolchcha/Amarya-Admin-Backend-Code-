import pool from "../../../config/db.js"
import XlsxPopulate from "xlsx-populate"
import { uploadFileToDrive } from "../../../utils/googleDriveUploads.js";
export const insertUserWorksheetQuery = async (array) => {
    try {
        let query = `INSERT INTO worksheets (emp_id, team_id, category_id, skill_set_id, description, date) VALUES (?, ?, ?, ?, ?, ?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserWorksheetQuery:", error);
        throw error;
    }
}

export const updateUserWorksheetQuery = async (query,array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserWorksheetQuery:", error);
        throw error;
    }
}

export const deleteUserWorksheetQuery = async (array) => {
    try {
        let query = `DELETE FROM worksheets WHERE _id = ? AND emp_id = ?`;
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing deleteTeamQuery:", error);
        throw error;
    }
}
export const fetchUserWorksheetQuery = async (empId) => {
    try {
        let query = `SELECT * FROM worksheets WHERE emp_id = ? ORDER BY date DESC`;
        return await pool.query(query, [empId]);
    } catch (error) {
        console.error("Error executing fetchUserWorksheetQuery:", error);
        throw error;
    }
}


export const fetchUserDataForExcelQuery = async () => {
    try {
        const query = `
            SELECT *
            FROM worksheets
            WHERE date BETWEEN DATE_FORMAT(CURRENT_DATE() - INTERVAL 1 MONTH, '%Y-%m-01') AND LAST_DAY(CURRENT_DATE() - INTERVAL 1 MONTH);
        `;
        
        // Query MySQL to get data
        const [results, fields] = await pool.query(query);
        
        // Get the current month and year
        const current_date = new Date();
        const previous_month_date = new Date(current_date);
        previous_month_date.setMonth(previous_month_date.getMonth() - 1);
        const month = previous_month_date.toLocaleString('default', { month: 'long' });
        const year = previous_month_date.getFullYear();

        // Create a new workbook
        const workbook = await XlsxPopulate.fromBlankAsync();

        // Get or create the sheet for the current month
        let sheet = workbook.sheet(`${month}_${year}`);
        if (!sheet) {
            sheet = workbook.addSheet(`${month}_${year}`);

            // Add column headers
            fields.forEach((field, index) => {
                sheet.cell(1, index + 1).value(field.name);
            });
        }

        // Add rows from MySQL results
        results.forEach((row, rowIndex) => {
            fields.forEach((field, columnIndex) => {
                sheet.cell(rowIndex + 2, columnIndex + 1).value(row[field.name]);
            });
        });
        // Save Excel file
        // await workbook.toFileAsync(`worksheet_${year}.xlsx`);
        // Save Excel file to Google Drive
        const buffer = await workbook.outputAsync();
        await uploadFileToDrive(buffer, `worksheet_${year}.xlsx`);
        console.log(`Excel file saved to Google Drive`);

        return `worksheet_${year}.xlsx`;
    } catch (error) {
        console.error("Error executing fetchUserDataForExcelQuery:", error);
        throw error;
    }
};