import pool from "../../../config/db.js"

export const addActivityQuery = (array)=> {
    let query = `INSERT INTO announcements (
        event_type,
        priority,
        from_date, 
        to_date, 
        title, 
        description,
        image_data 
    ) VALUES (?,?,?,?,?,?,?);`
    return pool.query(query, array);
}