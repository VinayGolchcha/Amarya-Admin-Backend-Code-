import pool from "../../../config/db.js"


export const getUserDataByUsernameQuery = (array)=> {
    let query = `SELECT * FROM users WHERE username = ?`
    return pool.query(query, array);
}

export const userRegistrationQuery = (array)=> {
    let query = `INSERT INTO users (
        emp_id,
        username,
        password,
        first_name,
        last_name,
        email,
        state_name,
        city_name,
        profile_picture, 
        blood_group,
        mobile_number,
        emergency_contact_number,
        emergency_contact_person_info,
        address,
        dob, 
        designation,
        designation_type,
        joining_date,
        experience,
        completed_projects,
        performance,
        teams,
        client_report,
        role,
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    return pool.query(query, array);
}

export const userDetailQuery = (array)=>{
    let query = `SELECT * FROM users WHERE email = ?`
    return pool.query(query, array);
}

export const updateTokenQuery = (array) => {
    let query = `UPDATE users SET jwt_token = ? WHERE emp_id = ?`
    return pool.query(query, array);
}
export const getLastEmployeeIdQuery = () =>{
    let query = `SELECT * FROM users ORDER BY emp_id DESC LIMIT 1`
    return pool.query(query);
}

export const updateUserPasswordQuery = (array) =>{
    let query = `UPDATE users SET password = ? WHERE email = ?`
    return pool.query(query, array);
}