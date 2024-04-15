import pool from "../../../config/db.js"

export const insertTeamToUser = async (array) => {
    try {
        let query = `SELECT INTO userTeams (
            user_id,
            team_id
        ) VALUES (?,?);`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertTeamToUser:", error);
        throw error;
    }
}
