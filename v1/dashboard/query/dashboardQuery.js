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
        console.log("Error in executing the fetchEmployeeCountQuery : " , err);
        throw(err)
    }
}

export const fetchTeamPerformanceQuery = () => {
    try{
        let query = `SELECT 
        teams,
        SUM(performance) AS total_performance,
        (SUM(performance) / (SELECT SUM(performance) FROM users)) * 100 AS teams_performance 
    FROM 
        users 
    GROUP BY 
        teams;
    `;
    return pool.query(query);
    }catch(err){
        console.log("Error in executing the fetchTeamPerformanceQuery : " , err );
        throw(err)

    }
}