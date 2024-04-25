import pool from "../../../config/db.js"

export const getCategoryTotalPointsQuery = async () => {
    try {
        let query = `SELECT SUM(points) AS total_points FROM categories;`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getCategoryTotalPoints:", error);
        throw error;
    }
}

export const getAllEmployeesQuery = () => {
    try {
        let query = `SELECT emp_id FROM users`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getAllEmployees:", error);
        throw error;
    }
}

export const getUserPointsQuery = (array) => {
    try {
        let query = `SELECT w.emp_id,
            SUM(c.points) AS total_earned_points
            FROM worksheets w
            JOIN categories c ON w.category_id = c._id
            WHERE MONTH(w.date) = ?
            GROUP BY w.emp_id;`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getAllEmployees:", error);
        throw error;
    }
}

export const updateUserPerformanceQuery = (array) =>{
    try {
        let query = `UPDATE users SET performance = ? WHERE emp_id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserPerformanceQuery:", error);
        throw error;
    }
}