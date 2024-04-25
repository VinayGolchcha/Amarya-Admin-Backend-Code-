import pool from "../../../config/db.js"

export const getCategoryTotalPoints = async () => {
    try {
        let query = `SELECT SUM(points) AS total_points FROM categories;`
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getCategoryTotalPoints:", error);
        throw error;
    }
}