import pool from "../../../config/db.js"
import XlsxPopulate from "xlsx-populate"
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

export const fetchUserDataForExcelQuery = async () => {
    try {
        const query = `
            SELECT *
            FROM worksheets
            WHERE date BETWEEN DATE_FORMAT(CURRENT_DATE() - INTERVAL 1 MONTH, '%Y-%m-01') AND LAST_DAY(CURRENT_DATE() - INTERVAL 1 MONTH);
        `;
        
        // Query MySQL to get data
        const [results, fields] = await pool.query(query);
        // Create a new Excel workbook
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0);

        // Add column headers
        fields.forEach((field, index) => {
            sheet.cell(1, index + 1).value(field.name);
        });

        // Add rows from MySQL results
        results.forEach((row, rowIndex) => {
            fields.forEach((field, columnIndex) => {
                sheet.cell(rowIndex + 2, columnIndex + 1).value(row[field.name]);
            });
        });

        // Save Excel file
        const filePath = 'data.xlsx'; // Change this to your desired file path
        console.log(`Excel file saved to ${filePath}`);
        await workbook.toFileAsync(filePath);
        return filePath
    } catch (error) {
        console.error("Error executing fetchUserDataForExcelQuery:", error);
        throw error;
    }
};