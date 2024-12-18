import pool from "../../../config/db.js"

export const insertUserAttendanceLogsQuery = async (array) => {
    try {
        let query = `
        INSERT INTO userAttendanceLogs ( date, snapshot, user_id) 
        VALUES (?, ?, ?)
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
        (tag, date, snapshot)
        VALUES(?, ?, ?)
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertUnknownUserAttendanceQuery:", error);
        throw error;
    }
}


// export const deletingAttendanceLogEveryHourQuery = async (array) => {
//     try {
//         let query = `
//             WITH RankedLogs AS (
//              SELECT id, 
//             ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) AS row_asc,
//             ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS row_desc
//             FROM userAttendanceLogs WHERE date = CURRENT_DATE())
//             DELETE FROM userAttendanceLogs
//             WHERE id IN (
//                 SELECT id FROM RankedLogs
//                 WHERE row_asc > 5 AND row_desc > 5
//             )
//         `;
//         return pool.query(query, array);
//     } catch (error) {
//         console.error("Error executing deletingAttendanceLogEveryHourQuery:", error);
//         throw error;
//     }
// }

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
        WITH Last5Days AS (
    SELECT 
        DATE_FORMAT(ua.date, '%Y-%m-%d') AS attendance_date,
        SUBSTRING(DAYNAME(ua.date), 1, 3) AS day_name,
        COUNT(*) AS present_count
    FROM 
        userAttendance ua
    LEFT JOIN 
        holidays h ON DATE(ua.date) = h.date
    WHERE 
        ua.status = 'PRESENT'
        AND DAYOFWEEK(ua.date) BETWEEN 2 AND 6
        AND ua.date < CURDATE()
        AND h.date IS NULL
    GROUP BY 
        attendance_date, day_name
    ORDER BY 
        attendance_date DESC
    LIMIT 5
)
SELECT 
    L.attendance_date,
    L.day_name,
    L.present_count,
    CASE WHEN ROW_NUMBER() OVER() = 1 THEN T.start_date ELSE NULL END AS start_date,
    CASE WHEN ROW_NUMBER() OVER() = 1 THEN T.end_date ELSE NULL END AS end_date
FROM 
    Last5Days L
CROSS JOIN (
    SELECT 
        MIN(attendance_date) AS start_date,
        MAX(attendance_date) AS end_date
    FROM 
        Last5Days
) T
ORDER BY 
    L.attendance_date DESC;
;
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
            CONCAT(U.first_name, ' ', U.last_name) AS employeeName,
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
        `;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing fetchUnidentifiedPeopleListQuery:", error);
        throw error;
    }
}

export const deleteUnidentifiedPersonQuery = async (id) => {
    try {
        let query = `
            DELETE FROM unknownUserAttendance
            WHERE id = ${id}
        `;
        return pool.query(query);
    } catch (error) {
        console.error("Error executing deleteUnidentifiedPersonQuery:", error);
        throw error;
    }
}
export const updateUnidentifiedPersonQuery = async (array) => {
    try {
        let query = `
            UPDATE unknownUserAttendance
            SET tag = ?
            WHERE id = ?
        `;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateUnidentifiedPersonQuery:", error);
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
        UPDATE userAttendance SET in_time = ?, in_snapshot = ? WHERE user_id = ? and date = ?`;
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

export const updateOutTimeUserAttenQuery = async (array) => {
    try {
        let query = `
        UPDATE userAttendance SET out_time = ?, out_snapshot = ?  WHERE user_id = ? and date = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateOutTimeUserAttenQuery:", error);
        throw error;
    }
}

export const getUserAttendanceLogByUserIdAndDateForOutTimeQuery = (array) => {
    try {
        let query = `select * From userAttendanceLogs ual where user_id = ? and date = ? order by id desc limit 2`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserAttendanceLogByUserIdAndDateForOutTimeQuery", error);
    }
}


export const fetchAttedancePercentageOfUsersByDateQuery = (array) => {
    try {
        let query = `SELECT 
        COUNT(u._id) AS total_users,
        COUNT(ua.user_id) AS present_users,
        COUNT(u._id) - COUNT(ua.user_id) AS absent_users,
        FORMAT((COUNT(ua.user_id) / COUNT(u._id)) * 100, 2) AS present_percentage,
        FORMAT(((COUNT(u._id) - COUNT(ua.user_id)) / COUNT(u._id)) * 100, 2) AS absent_percentage
        FROM users u LEFT JOIN 
        userAttendance ua ON u._id = ua.user_id AND ua.date IN (?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing fetchAttedancePercentageOfUsersByDateQuery", error);
    }
}

export const fetchMonthlyAllUserAttendanceQuery = (params) => {
    const [startDate, endDate] = params;

    const setStartDate = `SET @start_date = ?;`;
    const setEndDate = `SET @end_date = ?;`;

    const mainQuery = `
      WITH all_days AS (
          SELECT DATE(@start_date + INTERVAL num DAY) AS day
          FROM (
              SELECT @row := @row + 1 AS num
              FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
              CROSS JOIN (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
              CROSS JOIN (SELECT @row := -1) init
          ) numbers
          WHERE DATE(@start_date + INTERVAL num DAY) <= @end_date
      ),
      working_days AS (
          SELECT ad.day,
                 CASE WHEN DAYOFWEEK(ad.day) NOT IN (1, 7) AND h.date IS NULL THEN 1 ELSE 0 END AS is_working_day
          FROM all_days ad
          LEFT JOIN holidays h ON ad.day = h.date
      ),
      attendance_summary AS (
          SELECT u.emp_id,
                 CONCAT(u.first_name, ' ', u.last_name) AS emp_name,
                 COUNT(DISTINCT CASE WHEN ua.status = 'PRESENT' THEN ua.date END) AS no_present_days,
                 (SELECT COUNT(*) FROM leaveDatesAndReasons ldar1 WHERE u.emp_id = ldar1.emp_id AND from_date BETWEEN @start_date AND @end_date AND status = 'approved') AS no_leaves,
                 COUNT(DISTINCT CASE WHEN ua.status = 'ABSENT' AND ua.date BETWEEN @start_date AND @end_date THEN ua.date END) AS no_absent_days,
                 COUNT(DISTINCT CASE WHEN wd.is_working_day = 1 THEN wd.day END) AS total_working_days,
                 COUNT(DISTINCT h.date) AS no_holidays
          FROM users u
          LEFT JOIN userAttendance ua ON u._id = ua.user_id AND ua.date BETWEEN @start_date AND @end_date
          LEFT JOIN leaveDatesAndReasons ldar ON u.emp_id = ldar.emp_id
          LEFT JOIN working_days wd ON wd.day BETWEEN @start_date AND @end_date
          LEFT JOIN holidays h ON h.date BETWEEN @start_date AND @end_date
          GROUP BY u.emp_id
      )
      SELECT emp_id, emp_name, no_present_days, no_leaves,
             ((total_working_days - no_present_days) - no_leaves) AS no_absent_days,
             no_holidays, total_working_days
      FROM attendance_summary;
    `;

    return pool.query(setStartDate, [startDate])
        .then(() => pool.query(setEndDate, [endDate]))
        .then(() => pool.query(mainQuery));
};

export const getDailyUserAttendanceQuery = (params) => {
    const [startDate, endDate, empId] = params;

    const setStartDate = `SET @start_date = ?;`;
    const setEndDate = `SET @end_date = ?;`;
    const setEmpId = `SET @emp_id = ?;`;

    const mainQuery = `
      WITH RECURSIVE calendar AS (
        SELECT @start_date AS date
        UNION ALL
        SELECT DATE_ADD(date, INTERVAL 1 DAY)
        FROM calendar
        WHERE date < @end_date
      )
      SELECT 
          c.date,
          CASE
              WHEN DAYOFWEEK(c.date) = 7 THEN 'Saturday'
              WHEN DAYOFWEEK(c.date) = 1 THEN 'Sunday'
              WHEN h.date IS NOT NULL THEN 'Holiday'
              WHEN l.from_date <= c.date AND l.to_date >= c.date AND l.status = 'approved' AND l.leave_type LIKE '%leave%' THEN 'Leave'
              WHEN l.from_date <= c.date AND l.to_date >= c.date AND l.status = 'approved' AND l.leave_type = 'work from home' THEN 'Work_From_Home'
              WHEN ua.id IS NOT NULL THEN 'Present'
              ELSE 'Absent'
          END AS attendance_status
      FROM calendar c
      LEFT JOIN holidays h ON c.date = h.date
      LEFT JOIN leaveDatesAndReasons l ON l.emp_id COLLATE utf8mb4_0900_ai_ci = @emp_id
          AND l.from_date <= c.date 
          AND l.to_date >= c.date 
          AND l.status = 'approved'
      LEFT JOIN userAttendance ua ON ua.user_id = (
          SELECT _id FROM users WHERE emp_id COLLATE utf8mb4_0900_ai_ci = @emp_id
      ) AND ua.date = c.date
      ORDER BY c.date;
    `;

    return pool.query(setStartDate, [startDate])
        .then(() => pool.query(setEndDate, [endDate]))
        .then(() => pool.query(setEmpId, [empId]))
        .then(() => pool.query(mainQuery));
};

export const getUserAttendanceByDateQuery = (array) => {
    try {
        let query = `select date, u.emp_id, in_time, out_time, in_snapshot, out_snapshot from userAttendance ua 
        inner join users u ON u._id = ua.user_id where date = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserAttendanceByDateQuery", error);
    }
}

export const deletingAttendanceLogEveryHourQuery = async (batchSize = 1000, retries = 5) => {
    try {
        let rowsDeleted;
        do {
            let query = `
                WITH RankedLogs AS (
                    SELECT id, 
                    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) AS row_asc,
                    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS row_desc
                    FROM userAttendanceLogs
                    WHERE date = CURRENT_DATE()
                )
                DELETE FROM userAttendanceLogs
                WHERE id IN (
                    SELECT id FROM RankedLogs
                    WHERE row_asc > 5 AND row_desc > 5
                )
                LIMIT ?
            `;
            const [result] = await pool.query(query, [batchSize]);
            rowsDeleted = result.affectedRows;

            console.log(`${rowsDeleted} rows deleted`);
        } while (rowsDeleted > 0);

    } catch (error) {
    
        if ((error.code === 'ER_LOCK_DEADLOCK' || error.code === 'ETIMEDOUT') && retries > 0) {
            console.warn('Retrying due to deadlock or timeout...', error.code);
            await deletingAttendanceLogEveryHourQuery(batchSize, retries - 1);
        } else {
            console.error("Error executing deletingAttendanceLogEveryHourQuery:", error);
            throw error;
        }
    }
};

export const checkUserByEmpIdQuery = async (array) => {
    try {
        let query = `
        select * From users u where emp_id = ?`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateOutTimeUserAttenQuery:", error);
        throw error;
    }
}