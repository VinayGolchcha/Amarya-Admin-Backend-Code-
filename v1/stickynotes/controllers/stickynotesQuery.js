import pool from "../../../config/db.js";
export const addStickeyNotesQuery = (array) => {
    try{
        let query = `INSERT INTO temporary_notes (note , emp_id) VALUES (? , ?);`;
        return  pool.query(
            query,
            array
          );
    }catch(err){
        console.log("Error in executing in the addStickeyNotesQuery:" , err);
        throw err;
    }
}

export const getAllStickeyNotesQuery = () => {
    try {
        let query = `SELECT * FROM temporary_notes`
        return pool.query(query);
    }catch(err){
        console.log("Error in executing in the getAllStickeyNotesQuery:" , err);
        throw err;
    }
}
export const deleteStickyNotesQuery = (array) => {
    try{
        const sql = "DELETE FROM temporary_notes WHERE _id = ?";
        return pool.query(sql, array);
    }catch(err){
        console.log("Error in executing in the deleteStickyNotesQuery:" , err);
        throw err;
    }
    
}