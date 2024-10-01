import pool from "../../../config/db.js"


export const checkRowsLengthForNotificationQuery = (array)=> {
    try {
        let query = `SELECT * FROM approvals WHERE created_at > ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing checkRowsLengthForNotification:", error);
        throw error;
    }
}