import pool from "../../config/db.js"
import moment from "moment";

export const incrementId = async(id)=>{

    if (typeof id !== 'string' || !/^[A-Za-z]+(\d+)$/.test(id)) {
        throw new Error('Invalid input format');
    }
    
    const [, prefix, number] = id.match(/^([A-Za-z]+)(\d+)$/);
    const incrementedNumber = String(Number(number) + 1).padStart(number.length, '0');
    return `${prefix}${incrementedNumber}`;
      
}

export const createDynamicUpdateQuery = async(table, condition, req_data)=>{

    let updateQuery = 'UPDATE ' + table + ' SET ';
    let updateValues = [];

    Object.keys(req_data).forEach((key, index, array) => {
    updateQuery += `${key} = ?`;
    updateValues.push(req_data[key]);

    if (index < array.length - 1) {
        updateQuery += ', ';
    }
    });

    updateQuery += ' WHERE ';

    Object.keys(condition).forEach((key, index, array) => {
    updateQuery += `${key} = ?`;
    updateValues.push(condition[key]);

    if (index < array.length - 1) {
        updateQuery += ' AND ';
    }
    });
    return {updateQuery, updateValues};
}

export const getWorkingDaysCountPreviousMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // Current month index (0-based)

    // Get the first day of the previous month
    const firstDayOfPreviousMonth = new Date(year, month - 1, 1);

    // Get the last day of the previous month
    const lastDayOfPreviousMonth = new Date(year, month, 0);

    let count = 0;

    // Iterate through the days of the previous month
    for (let day = firstDayOfPreviousMonth.getDate(); day <= lastDayOfPreviousMonth.getDate(); day++) {
        const currentDate = new Date(year, month - 1, day);
        const currentDayOfWeek = currentDate.getDay(); // Day of the week index (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        
        // Check if the current day is a weekday (Monday to Friday)
        if (currentDayOfWeek >= 1 && currentDayOfWeek <= 5) {
            count++;
        }
    }

    return count;
}

export const getTokenSessionById = async(emp_id)=>{
        let query = `SELECT jwt_token FROM users WHERE emp_id = ?`
        return pool.query(query,[emp_id])
}

export const calculateTotalExperienceInFloat = async (dateOfJoining, previousExperienceFloat) => {
    const currentDate = moment();
    const joiningDate = moment(dateOfJoining);

    const currentJobExperience = moment.duration(currentDate.diff(joiningDate));
    const currentJobYears = currentJobExperience.years();
    const currentJobMonths = currentJobExperience.months();

    const previousYears = Math.floor(previousExperienceFloat);
    const previousMonths = Math.round((previousExperienceFloat - previousYears) * 12);

    let totalYears = currentJobYears + previousYears;
    let totalMonths = currentJobMonths + previousMonths;

    if (totalMonths >= 12) {
        totalYears += Math.floor(totalMonths / 12);
        totalMonths = totalMonths % 12;
    }

    const totalExperienceInFloat = totalYears + (totalMonths / 12);

    return parseFloat(totalExperienceInFloat.toFixed(2));
}


export const getWorkingDaysCount = async (array) => {
    const [year, month, emp_id] = array;
    let query = `WITH all_days AS (
        SELECT 
            DATE_ADD(DATE(CONCAT(${year}, '-', ${month}, '-01')), INTERVAL daynum DAY) AS date
        FROM (
            SELECT 
                t.n + (10 * t2.n) AS daynum
            FROM
                (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t
                CROSS JOIN 
                (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) t2
        ) AS numbers
        WHERE DATE_ADD(DATE(CONCAT(${year}, '-', ${month}, '-01')), INTERVAL daynum DAY) 
            <= LAST_DAY(DATE(CONCAT(${year}, '-', ${month}, '-01')))
    ),
    working_days AS (
        SELECT 
            date
        FROM 
            all_days
        WHERE DAYOFWEEK(date) NOT IN (1, 7)
    ),
    holidays_in_month AS (
        SELECT 
            date
        FROM 
            holidays
        WHERE 
            MONTH(date) = ${month}
            AND YEAR(date) = ${year}
    ),
    leaves_for_emp AS (
        SELECT 
            DATE_ADD(ld.from_date, INTERVAL n DAY) AS date
        FROM leaveDatesAndReasons ld
        JOIN (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t
        WHERE 
            ld.emp_id = '${emp_id}'
            AND ld.leave_type != 'Leave without pay'
            AND ld.status = 'approved'
            AND MONTH(ld.from_date) = ${month}
            AND YEAR(ld.from_date) = ${year}
            AND DATE_ADD(ld.from_date, INTERVAL n DAY) <= ld.to_date
    ),
    all_excluded_days AS (
        SELECT date FROM holidays_in_month
        UNION
        SELECT date FROM leaves_for_emp
    )
    SELECT 
        COUNT(wd.date) AS working_days_count
    FROM 
        working_days wd
    LEFT JOIN all_excluded_days ed ON wd.date = ed.date
    WHERE 
        ed.date IS NULL
`
    return pool.query(query)
}

export const calculateEmpWorkingDaysForEachMonth = async (year, emp_id) => {
    const monthArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const workingDays = {};

    // Using Promise.all to execute queries concurrently
    await Promise.all(
        monthArray.map(async (month) => {
            const [data] = await getWorkingDaysCount([year, month, emp_id]);
            workingDays[month] = Number(data[0].working_days_count); // Ensure it's stored as a number
        })
    );

    return workingDays;
};