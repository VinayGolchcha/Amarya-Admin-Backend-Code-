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
        created_at,
        updated_at
    ) VALUES (?,?,?,?,?,?,?,?);`
    return pool.query(query, array);
}

export const userDetailQuery = (array)=>{
    let query = `SELECT * FROM users WHERE username = ? AND email = ?`
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