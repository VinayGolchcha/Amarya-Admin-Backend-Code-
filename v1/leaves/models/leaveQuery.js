import pool from "../../../config/db.js"

export const createHoliday = (array) => {
    let query = `INSERT INTO holidays SET date = ?, holiday = ?`
    return pool.query(query, array);
}

export const updateHolidayQuery = (query, array) => {
    return pool.query(query, array);
}

export const updateLeaveQuery = (query, array) => {
    return pool.query(query, array);
}

export const createLeaveCount = (array) => {
    let query = `INSERT INTO leaveTypeCounts SET leave_type_id = ?, leave_type = ?, leave_count = ?, gender = ?`
    return pool.query(query, array);
}

export const createLeaveType = (array) => {
    let query = `INSERT INTO leaveTypes SET leave_type = ?, description = ?`
    return pool.query(query, array);
}

export const fetchLeavesCountQuery = () => {
    let query = `SELECT leave_type, leave_count, gender FROM leaveTypeCounts`
    return pool.query(query);
}
export const fetchLeavesTypesQuery = () => {
    let query = `SELECT _id, leave_type, description FROM leaveTypes`
    return pool.query(query);
}
export const fetchLeaveTakenOverviewQuery = (array, limit) => {
    let query = `SELECT leave_type, from_date, to_date, subject FROM leaveDatesAndReasons WHERE emp_id = ? ORDER BY created_at DESC LIMIT ${limit};
    `
    return pool.query(query, array);
}

export const insertUserLeaveDataQuery = (array) => {
    let query = `INSERT INTO leaveDatesAndReasons (
        emp_id,
        leave_type,
        from_date,
        to_date,
        subject,
        body
    ) VALUES (?,?,?,?,?,?);`
    return pool.query(query, array);
}

export const insertApprovalForLeaveQuery = (array) => {
    const query = `INSERT INTO approvals(
        emp_id,
        foreign_id,
        request_type,
        item,
        request_date,
        issued_from,
        issued_till,
        subject,
        body
    ) VALUES (?,?,?,?,?,?,?,?,?);`
    return pool.query(query, array)
}

export const getLastLeaveId = () => {
    let query = `SELECT _id from leaveDatesAndReasons ORDER BY _id DESC LIMIT 1`
    return pool.query(query);
}

export const getLeaveTypeCountByAdmin = async (array) => {
    try {
        let query = `SELECT leave_count FROM leaveTypeCounts WHERE leave_type = ?;`
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing getLeaveTypeCountByAdmin:", error);
        throw error;
    }
}

export const getAllUsersLeaveCountQuery = async ()=>{
    try {
        let query = 
        `SELECT emp_id, leave_type, leave_count, leave_taken_count 
        FROM userLeaveCounts
        GROUP BY emp_id, leave_type, leave_count, leave_taken_count;
        `
        return await pool.query(query);
    } catch (error) {
        console.error("Error executing getAllUsersLeaveCountQuery:", error);
        throw error;
    }
}

export const getUserLeaveDataQuery = async(array)=>{
    try {
        let query = `
        SELECT leave_type, leave_count, leave_taken_count 
        FROM
            userLeaveCounts
        WHERE emp_id = ?;
        `
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing getUserLeaveDataQuery:", error);
        throw error;
    }
}