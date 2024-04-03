import pool from "../../../config/db.js"

export const insertUserWorksheetQuery = async (array) => {
    try {
        let query = `INSERT INTO worksheets (emp_id, team_id, category_id, skill_set, description, date) VALUES (?, ?, ?, ?, ?, ?)`;
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