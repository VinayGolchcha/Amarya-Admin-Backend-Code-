import pool from "../../../config/db.js"

export const insertUserProjectQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userProjects(
            project_id,
            emp_id,
            tech,
            team_id,
            start_month,
            end_month,
            project_manager
        )VALUES (?,?,?,?,?,?,?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserProjectQuery:", error);
        throw error;
    }
}

export const checkUserProjectExists = async(array)=>{
    try {
        let query = ` SELECT * FROM userProjects WHERE project_id = ? AND emp_id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing checkUserProjectExists:", error);
        throw error;
    }
}
export const getUserJoiningDate = async(array)=>{
    try {
        let query = ` SELECT joining_date FROM users WHERE emp_id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserJoiningDate:", error);
        throw error;
    }
}

export const getUserProjectQuery = async (array) => {
    try {
        let query = 
        `
        SELECT up.*, p.project AS project_name
        FROM userProjects up
        LEFT JOIN projects p ON up.project_id = p._id
        WHERE up.emp_id = ?
        AND CONCAT(SUBSTRING(up.start_month, 4, 2), SUBSTRING(up.start_month, 1, 2)) <= DATE_FORMAT(CURDATE(), '%y%m')
        AND CONCAT(SUBSTRING(up.end_month, 4, 2), SUBSTRING(up.end_month, 1, 2)) > DATE_FORMAT(CURDATE(), '%y%m')
        ORDER BY CONCAT(SUBSTRING(up.start_month, 4, 2), SUBSTRING(up.start_month, 1, 2)) DESC;
        `
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing getUserProjectQuery:", error);
        throw error;
    }
}

export const checkProjectIdQuery = async (array) => {
    try {
        let query = `SELECT * FROM userProjects WHERE emp_id = ?`
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

export const getUserProjectTimelineQuery = async (array) => {
    try {
        let query = `SELECT userProjects._id, userProjects.emp_id, userProjects.start_month, userProjects.end_month, projects.project, projects.client_name, teams.team
                    FROM userProjects
                    JOIN projects ON userProjects.project_id = projects._id
                    LEFT JOIN teams ON userProjects.team_id = teams._id
                    WHERE emp_id = ? `
        return pool.query(query,array);
    } catch (error) {
        console.error("Error executing getUserProjectQuery:", error);
        throw error;
    }
}