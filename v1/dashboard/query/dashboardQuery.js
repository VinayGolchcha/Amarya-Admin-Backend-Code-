import pool from "../../../config/db.js";

export const fetchEmployeeCountQuery = () => {
    try{
        let sql = `
    SELECT t.team, COUNT(u._id) AS employee_count
    FROM teams t
    LEFT JOIN users u ON t._id = u.teams
    GROUP BY t.team
  `;
    return pool.query(sql);
    }catch(err){
        console.log(err);
        
    }
}