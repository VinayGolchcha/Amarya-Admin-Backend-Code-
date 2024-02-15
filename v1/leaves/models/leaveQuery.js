import pool from "../../../config/db.js"

export const createHoliday = (array) => {
    let query = `INSERT INTO holidays SET date = ?, holiday = ?`
    return pool.query(query, array);
}