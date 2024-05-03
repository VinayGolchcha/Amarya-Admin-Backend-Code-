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


export const getUserProjectQuery = async (array) => {
    try {
        let query = `SELECT * FROM userproject WHERE project_id = ? `
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing getUserProjectQuery:", error);
        throw error;
    }
}
export const checkProjectIdQuery = async (array) => {
    try {
        let query = `SELECT * FROM userproject WHERE emp_id = ?`
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing checkSameTeamNameQuery:", error);
        throw error;
    }
}
export const userUpdateProjectQuery = async (query,array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateProjectWorksheetQuery:", error);
        throw error;
    }
}

