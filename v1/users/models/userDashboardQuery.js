import pool from "../../../config/db.js";

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

  
export const userDashboardProfileQuery= async (array) =>{
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

/*export const dashboardImageQuery= async () =>{
        let query = `INSERT INTO imageurl(
        image_url,
        public_id
        )VALUE(?,?)`;
        return await pool.query(query);
    };*/
    
export const fetchUserProjectQuery= async (array) =>{
    try {
        let query = `SELECT
        p._id,
        u.completed_projects,
        p.project,
        (case
            when p.end_month = "january" then 1
            when p.end_month = "february" then 2
            when p.end_month = "march" then 3
            when p.end_month = "april" then 4
            when p.end_month = "may" then 5
            when p.end_month = "june" then 6
            when p.end_month = "july" then 7
            when p.end_month = "august" then 8
            when p.end_month = "september" then 9
            when p.end_month = "october" then 10
            when p.end_month = "november" then 11
            when p.end_month = "december" then 12
            else null
        end -
        case
            when p.start_month = "january" then 1
            when p.start_month = "february" then 2
            when p.start_month = "march" then 3
            when p.start_month = "april" then 4
            when p.start_month = "may" then 5
            when p.start_month = "june" then 6
            when p.start_month = "july" then 7
            when p.start_month = "august" then 8
            when p.start_month = "september" then 9
            when p.start_month = "october" then 10
            when p.start_month = "november" then 11
            when p.start_month = "december" then 12
            else null
        end) as project_duration,
        u2.tech,
        u2.project_manager 
    from
        users u
    join userproject u2 on
        u.emp_id = u2.emp_id
    join projects p on
        p._id = u2.project_id
        WHERE u2.emp_id = ?`;
        return await pool.query(query, array);
    } catch (error) {
        console.error("Error executing  getUserProjectQuery", error);
        throw error;
    }
}
