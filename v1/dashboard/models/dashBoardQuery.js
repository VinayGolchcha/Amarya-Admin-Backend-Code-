import pool from "../../../config/db.js"

export const fetchAnnouncementsQuery = ()=> {
    let query = `
        SELECT
        title,
        description,
        priority,
        DATE_FORMAT(from_date, '%Y-%m-%d') AS from_date,
        DATE_FORMAT(to_date, '%Y-%m-%d') AS to_date
    FROM
        announcements
    ORDER BY
        created_at DESC;
    `

    return pool.query(query);
}

export const fetchActivityQuery = () => {
    let query = `SELECT
    title,
    description,
    priority,
    is_new,
    DATE_FORMAT(from_date, '%Y-%m-%d') AS from_date,
    DATE_FORMAT(to_date, '%Y-%m-%d') AS to_date,
    created_at
    FROM
    announcements WHERE event_type = 'activity'
    ORDER BY
    created_at DESC;`
    return pool.query(query);
  };

  
export const getUserProfileQuery= async (array) =>{
    try {
        let query = `SELECT 
        emp_id,
        mobile_number,
        dob,
        email
        FROM users 
        WHERE emp_id = ?`
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing  getUserDataQuery", error);
        throw error;
    }
}
export const feedbackFormQuery= async(array)=>{
    let query= `INSERT INTO feedbackform (
        user_id,
        subject,
        description
    )VALUE (?,?,?);`
    return pool.query(query, array);
}


