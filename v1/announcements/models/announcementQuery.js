import pool from "../../../config/db.js"

export const addAnnouncementQuery = (array)=> {
    let query = `INSERT INTO announcements (
        event_type,
        priority,
        from_date, 
        to_date, 
        title, 
        description
    ) VALUES (?,?,?,?,?,?);`
    return pool.query(query, array);
}

export const fetchAnnouncementsQuery = ()=> {
    let query = `SELECT announcements.title, announcements.description, announcements.from_date, announcements.to_date, announcements.priority FROM announcements`
    return pool.query(query);
}

export const deleteAnnouncementQuery = (array)=> {
    let query = `DELETE FROM announcements WHERE _id = ?`
    return pool.query(query, array);
}

export const updateAnnouncementQuery = (query, array)=> {
    return pool.query(query, array);
}