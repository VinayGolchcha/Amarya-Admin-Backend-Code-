const attendanceSummaryProc = `
CREATE PROCEDURE IF NOT EXISTS attendanceSummaryProc(
    IN start_date DATE,
    IN end_date DATE,
    IN emp_id VARCHAR(50)
)
BEGIN
	
    CREATE TEMPORARY TABLE all_days (
        id INT AUTO_INCREMENT PRIMARY KEY,
        day DATE
    ) AS
    SELECT 
        DATE(start_date + INTERVAL num DAY) AS day
    FROM (
        SELECT @row := @row + 1 AS num
        FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
        CROSS JOIN (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b
        CROSS JOIN (SELECT @row := -1) init
    ) numbers
    WHERE DATE(start_date + INTERVAL num DAY) <= end_date;
   
    CREATE TEMPORARY TABLE working_days (
        id INT AUTO_INCREMENT PRIMARY KEY,
        day DATE,
        is_working_day TINYINT(1)
    ) AS
    SELECT 
        ad.day,
        CASE 
            WHEN DAYOFWEEK(ad.day) NOT IN (1, 7) AND h.date IS NULL THEN 1 
            ELSE 0
        END AS is_working_day
    FROM all_days ad
    LEFT JOIN holidays h ON ad.day = h.date;
   
    CREATE TEMPORARY TABLE attendance_summary (
        id INT AUTO_INCREMENT PRIMARY KEY,
        emp_id VARCHAR(50),
        no_present_days INT,
        no_leaves INT,
        no_absent_days INT,
        total_working_days INT,
        no_holidays INT
    ) AS
    SELECT 
        u.emp_id,
        COUNT(DISTINCT CASE WHEN ua.status = 'PRESENT' THEN ua.date END) AS no_present_days,
        (SELECT COUNT(*) FROM leaveDatesAndReasons ldar1 WHERE u.emp_id = ldar1.emp_id AND ((from_date BETWEEN start_date AND end_date) OR (to_date BETWEEN start_date AND end_date)) AND status = 'approved' AND leave_type != 'work from home') AS no_leaves,
        COUNT(DISTINCT CASE WHEN ua.status = 'ABSENT' AND ua.date BETWEEN start_date AND end_date THEN ua.date END) AS no_absent_days,
        COUNT(DISTINCT CASE WHEN wd.is_working_day = 1 THEN wd.day END) AS total_working_days,
        COUNT(DISTINCT h.date) AS no_holidays,
        (SELECT COUNT(*) From leaveDatesAndReasons ldar where ldar.emp_id = emp_id AND leave_type = 'work from home'
		AND status = 'approved' AND ((from_date BETWEEN start_date AND end_date) OR (to_date BETWEEN start_date AND end_date))) AS work_from_home
    FROM users u
    LEFT JOIN userAttendance ua ON u._id = ua.user_id AND ua.date BETWEEN start_date AND end_date
    LEFT JOIN leaveDatesAndReasons ldar ON u.emp_id = ldar.emp_id
    LEFT JOIN working_days wd ON wd.day BETWEEN start_date AND end_date
    LEFT JOIN holidays h ON h.date BETWEEN start_date AND end_date
    WHERE u.emp_id = emp_id
    GROUP BY u.emp_id;

    SELECT 
        emp_id,
        (no_present_days + work_from_home) as no_present_days,
        no_leaves,
        ((total_working_days - no_present_days) - no_leaves) - work_from_home AS no_absent_days,
        no_holidays,
        total_working_days,
        work_from_home
    FROM attendance_summary;

    DROP TEMPORARY TABLE IF EXISTS all_days;
    DROP TEMPORARY TABLE IF EXISTS working_days;
    DROP TEMPORARY TABLE IF EXISTS attendance_summary;
END
`;

export default attendanceSummaryProc;