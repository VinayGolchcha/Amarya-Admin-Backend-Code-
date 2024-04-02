import pool from "../../../config/db.js"

export const getAllProjectQuery = async () => {
    try {
        let query = `SELECT * FROM projects`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getAllProjectQuery:", error);
        throw error;
    }
}

export const insertProjectQuery = async (array) => {
    try {
        let query = `INSERT INTO projects (project, category_id, client_name, project_status, project_lead, start_month, end_month) VALUES (?,?,?,?,?,?,?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertProjectQuery:", error);
        throw error;
    }
}

export const updateProjectWorksheetQuery = async (query,array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateProjectWorksheetQuery:", error);
        throw error;
    }
}

export const deleteProjectQuery = async (array) => {
    try {
        let query = `DELETE FROM projects WHERE _id = ?`;
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing deleteProjectQuery:", error);
        throw error;
    }
}