import pool from "../../../config/db.js"

export const insertUserProjectQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userproject(
            project_id,
            emp_id,
            tech,
            team_id,
            start_month,
            end_month,
            project_manager,
            status
        )VALUES (?,?,?,?,?,?,?,?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserProjectQuery:", error);
        throw error;
    }
}


export const getUserProjectQuery = async () => {
    try {
        let query = `SELECT
         _id,
        project_id,
        emp_id,
        tech,
        team_id,
        start_month,
        end_month,
        project_manager,
        status FROM userproject`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getUserProjectQuery:", error);
        throw error;
    }
}