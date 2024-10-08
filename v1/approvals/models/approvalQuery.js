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

export const updateApprovalLeaveDataQuery = (array)=> {
    try {
        let query = `UPDATE approvals SET item = ? WHERE foreign_id = ? AND emp_id = ?`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateApprovalLeaveDataQuery:", error);
        throw error;
    }
}