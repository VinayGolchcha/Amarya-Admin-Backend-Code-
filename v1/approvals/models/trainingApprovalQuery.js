import pool from "../../../config/db.js"

export const insertApprovalForTrainingQuery=(array)=>{
    const query = `INSERT INTO approvals(
        emp_id,
        foreign_id,
        request_type,
        item,
        request_date,
        subject,
        body
    ) VALUES (?,?,?,?,?,?,?);`
    return pool.query(query, array)
}
