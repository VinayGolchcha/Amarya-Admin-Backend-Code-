import pool from "../../../config/db.js"

export const insertUserAttendanceLogsQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userAttendanceLogs (status, date, snapshot, user_id, is_indentify) 
        VALUES (?, ?, ?, ?, ?)
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserAttendanceQuery:", error);
        throw error;
    }
}

export const insertUserAttendanceQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userAttendance (status, date, in_time, out_time, in_snapshot, user_id, out_snapshot) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserAttendanceQuery:", error);
        throw error;
    }
}


export const checkUserAttendanceQuery = (array) => {
    try {
        let query = `SELECT * FROM userAttendance WHERE date = ? AND user_id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing checkUserAttendanceQuery:", error);
        throw error;
    }
}

export const getUserByClassNameQuery = (array) => {
    try {
        let query = `select * From users where username = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserByClassNameQuery", error);
    }


}

export const updateOutTime = async (array) => {
    try {
        let query = `
            UPDATE userAttendance
            SET out_time=NOW(), out_snapshot= ? where id=?
            `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUserAttendanceQuery:", error);
        throw error;
    }
}

export const checkUserAttendanceLogsQuery = (array) => {
    try {
        let query = `SELECT * FROM userAttendanceLogs WHERE date = ? AND user_id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing checkUserAttendanceLogsQuery:", error);
        throw error;
    }
}


export const checkUserTimeFromLogs = (array) => {
    try {
        let query = `SELECT ua.user_id, 
                    ua.date AS date, 
                    MIN(ua.created_at) AS in_time, 
                    MAX(ua.created_at) AS out_time,
                    (SELECT snapshot FROM userAttendanceLogs WHERE user_id = ua.user_id AND created_at = MIN(ua.created_at)) AS in_snapshot,
                    (SELECT snapshot FROM userAttendanceLogs WHERE user_id = ua.user_id AND created_at = MAX(ua.created_at)) AS out_snapshot
                    FROM 
                    userAttendanceLogs ua WHERE DATE(created_at) = ?
                    GROUP BY ua.user_id, DATE(ua.created_at), ua.date`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing checkUserAttendanceLogsQuery:", error);
        throw error;
    }
}

export const deleteAttendanceLogsQuery = (array) => {
    try {
        let query = `DELETE FROM userAttendanceLogs WHERE date < ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing deleteAttendanceLogsQuery:", error);
        throw error;
    }
}



