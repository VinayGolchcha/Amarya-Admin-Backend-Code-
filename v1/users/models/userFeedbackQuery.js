import pool from "../../../config/db.js";

export const feedbackFormQuery= async(array)=>{
    let query= `INSERT INTO feedbackform (
        user_id,
        subject,
        description
    )VALUE (?,?,?)`;
    return pool.query(query, array);
}
