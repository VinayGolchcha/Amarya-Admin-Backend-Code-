import pool from "../../../config/db.js"

export const insertUserAttendanceLogsQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userAttendanceLogs (status, date, snapshot, user_id) 
        VALUES (?, ?, ?, ?)
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


export const getUserAttendanceByUserIdAndDateQuery = (array) => {
    try {
        let query = `SELECT * FROM userAttendance WHERE date = ? AND user_id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserAttendanceByUserIdAndDateQuery:", error);
        throw error;
    }
}

export const getUserByUserNameQuery = (array) => {
    try {
        let query = `select * From users where username = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserByUserNameQuery", error);
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
        console.error("Error executing updateOutTime:", error);
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
        console.error("Error executing checkUserTimeFromLogs:", error);
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

export const insertUnknownUserAttendanceQuery = async (array) => {
    try {
        let query = `
        INSERT INTO unknownUserAttendance
        (status, date, snapshot)
        VALUES(?, ?, ?)
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUnknownUserAttendanceQuery:", error);
        throw error;
    }
}


export const deletingAttendanceLogEveryHourQuery = async (array) => {
    try {
        let query = `
            WITH RankedLogs AS (
             SELECT id, 
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) AS row_asc,
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS row_desc
            FROM userAttendanceLogs)
            DELETE FROM userAttendanceLogs
            WHERE id IN (
                SELECT id FROM RankedLogs
                WHERE row_asc > 5 AND row_desc > 5
            )
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing deletingAttendanceLogEveryHourQuery:", error);
        throw error;
    }
}

export const getUserAttendanceSummaryQuery = async (array) => {
    try {
        const [startDate, endDate, empId] = array;
        let query = `CALL attendanceSummaryProc('${startDate}', '${endDate}', '${empId}')`;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getUserAttendanceSummaryQuery:", error);
        throw error;
    }
}

export const getUnknownUserAttendanceQuery = async (array) => {
    try {
        let query = `
        select * from unknownUserAttendance uua where uua.id = ? and uua.date = ? `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUnknownUserAttendanceQuery:", error);
        throw error;
    }
}

export const updateInTimeUserAttenQuery = async (array) => {
    try {
        let query = `
        UPDATE userAttendance SET in_time = ? WHERE user_id = ? and date = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateInTimeUserAttenQuery:", error);
        throw error;
    }
}

export const updateUserAttendanceQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userAttendance (status, date, in_time, in_snapshot, user_id) 
        VALUES (?, ?, ?, ?, ?)
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUserAttendanceQuery:", error);
        throw error;
    }
}

export const getUserByEmpIdQuery = (array) => {
    try {
        let query = `select * From users where emp_id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserByEmpIdQuery", error);
    }
}

export const getUserAttendanceLogByUserIdAndDateForInTimeQuery = (array) => {
    try {
        let query = `select * From userAttendanceLogs ual where user_id = ? and date = ? order by id asc limit 2`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserAttendanceLogByUserIdAndDateForInTimeQuery", error);
    }
}

export const updateUnknownAttendance = (array) => {
    try {
        let query = `UPDATE amaryadashboard.unknownUserAttendance SET  emp_id = ? WHERE id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUnknownAttendance", error);
    }
}