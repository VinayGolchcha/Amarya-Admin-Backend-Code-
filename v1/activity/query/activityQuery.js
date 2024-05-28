import pool from "../../../config/db.js"

export const addActivityQuery = (array)=> {
    try{
    let query = `INSERT INTO announcements (
        event_type,
        priority,
        from_date, 
        to_date, 
        title, 
        description
    ) VALUES (?,?,?,?,?,?);`
    return pool.query(query, array);}
    catch(err){
        console.log("Error in executing in the addActivityQuery:" , err);
        throw(err);
    }
}
export const getActivityByIdQuery = (array) => {
    try{
        let query = `SELECT *
        FROM announcements
        WHERE event_type = 'activity' AND _id = ?;`;
        return pool.query(query, array);
    }catch(err){
        console.log("Error in executing in the getActivityByIdQuery:" , err);
        throw(err);
    }
}

export const getLastActivityIdQuery = () =>{
    let query = `SELECT _id FROM announcements ORDER BY _id DESC LIMIT 1`
    return pool.query(query);
}