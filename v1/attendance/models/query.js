import pool from "../../../config/db.js"

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
