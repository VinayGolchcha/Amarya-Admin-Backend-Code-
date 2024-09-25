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
        console.error("Error executing insertUnknownUserAttendanceQuery:", error);
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
export const getWeeklyPresentCountQuery = async () => {
    try {
        let query = `
        SELECT 
            DATE_FORMAT(date, '%Y-%m-%d') AS attendance_date,
            DAYNAME(date) AS day_name,
            COUNT(*) AS present_count
        FROM 
            userAttendance
        WHERE 
            YEARWEEK(date, 1) BETWEEN YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
                                AND YEARWEEK(CURDATE(), 1)
            AND status = 'PRESENT'
            AND DAYOFWEEK(date) BETWEEN 2 AND 6
        GROUP BY 
            attendance_date, day_name
        ORDER BY 
            attendance_date;
        `;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing getWeeklyPresentCountQuery:", error);
        throw error;
    }
}

export const fetchUserPresentAttendanceQuery = async (skip) => {
    try {
        let query = `
        SELECT
            UA.id AS id,
            U.emp_id AS emp_id,
            U.username AS username,
            UA.status AS status,
            UA.in_time AS in_time,
            UA.out_time AS out_time,
            UA.in_snapshot AS in_snapshot,
            UA.out_snapshot AS out_snapshot
        FROM
            userAttendance as UA
        JOIN users AS U ON UA.user_id = U._id
        WHERE
            date = DATE_FORMAT(CURDATE() - INTERVAL 1 DAY, '%Y-%m-%d')
        ORDER BY date DESC
        LIMIT 10 OFFSET ${skip}
        `;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchUserPresentAttendanceQuery:", error);
        throw error;
    }
}
export const fetchUnidentifiedPeopleListQuery = async (skip) => {
    try {
        let query = `
        SELECT 
            * 
        FROM unknownUserAttendance
        ORDER BY date DESC
        LIMIT 10 OFFSET ${skip}
        `;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchUnidentifiedPeopleListQuery:", error);
        throw error;
    }
}
