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

export const fetchAnnouncementsQuery = (array)=> {
    let query = `
                SELECT
                a._id,
                a.title,
                a.description,
                a.priority,
                a.is_new,
                DATE_FORMAT(a.from_date, '%Y-%m-%d') AS from_date,
                DATE_FORMAT(a.to_date, '%Y-%m-%d') AS to_date,
                a.created_at
            FROM
                announcements AS a
            LEFT JOIN 
                readAnnouncements AS ra 
            ON 
                a._id = ra.announcement_id AND ra.emp_id = ?
            WHERE 
                a.event_type = 'announcement' 
                AND a.is_new = 1
                AND ra.announcement_id IS NULL
            ORDER BY
                a.created_at DESC
            LIMIT 5;
    `
    return pool.query(query, array);
}

export const deleteAnnouncementQuery = (array)=> {
    let query = `DELETE FROM announcements WHERE _id = ?`
    return pool.query(query, array);
}

export const updateAnnouncementQuery = (query, array)=> {
    return pool.query(query, array);
}

export const fetchActivityQuery = (array) => {
    let query = `SELECT
    *
    FROM
    announcements WHERE event_type = ?`;
    return pool.query(query, array);
};
  
export const deleteActivityQuery = (array) => {
    let query = `DELETE FROM announcements WHERE _id = ?`;
    return pool.query(query, array);
}
  
export const fetchAnnouncementByIdQuery = (array)=> {
    let query = `
                SELECT
                    _id,
                    title,
                    description,
                    priority,
                    is_new,
                    DATE_FORMAT(from_date, '%Y-%m-%d') AS from_date,
                    DATE_FORMAT(to_date, '%Y-%m-%d') AS to_date,
                    created_at
                FROM
                    announcements
                WHERE event_type = 'announcement' AND _id = ?
                ORDER BY
                    created_at DESC;
    `
    return pool.query(query, array);
}

export const updateAnnouncementReadStatusQuery = (array)=> {
    if (array.length !== 2) {
        throw new Error("Array must contain exactly two elements: [announcement_id, emp_id]");
    }

    const query = `
        INSERT INTO readAnnouncements (announcement_id, emp_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE 
            emp_id = VALUES(emp_id);
    `;

    // Execute the query with the provided array
    return pool.query(query, array)
}