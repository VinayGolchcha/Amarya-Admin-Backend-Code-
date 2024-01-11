import pool from "../../../config/db.js"

export const insertTrainingDataQuery = (array) =>{
    let query = `INSERT INTO trainings (
        training_id,
        course_name,
        course_description,
        roadmap_url,
        details
    ) VALUES (?,?,?,?,?);`
    return pool.query(query, array);
}

export const getLastTrainingIdQuery = () =>{
    let query = `SELECT * FROM trainings ORDER BY training_id DESC LIMIT 1`
    return pool.query(query);
}

export const addUserTrainingInfoQuery = (array) =>{
    let query = `INSERT INTO usertrainings (
        emp_id,
        training_id,
        course_name,
        course_description,
        details,
        roadmap_url,
        progress_status
    ) VALUES (?,?,?,?,?,?,?)`
    return pool.query(query, array);
};

export const getTrainingDataQuery = (array)=>{
    let query = `SELECT trainings.course_name, trainings.course_description, trainings.details, trainings.roadmap_url FROM trainings WHERE training_id = ?`
    return pool.query(query, array);
};


export const displayDataForTrainingCardsQuery = ()=> {
    let query = `SELECT  trainings.training_id, trainings.course_name, trainings.course_description, trainings.roadmap_url FROM trainings`
    return pool.query(query);
};

export const displayTrainingsForUserQuery = (array)=> {
    let query = `SELECT  usertrainings.training_id, usertrainings.course_name, usertrainings.course_description, usertrainings.status, usertrainings.progress_status FROM usertrainings WHERE emp_id = ?`
    return pool.query(query, array);
};

export const deleteUserTrainingDataQuery = (array)=>{
    let query = `DELETE FROM usertrainings WHERE emp_id = ? AND training_id = ?`;
    return pool.query(query, array);
}

export const getUserDataForTrainingQuery = (array)=>{
    let query = `SELECT * FROM usertrainings WHERE emp_id = ? AND training_id =?`
    return pool.query(query, array);
}

export const deleteTrainingDataQuery = (array)=>{
    let query = `DELETE FROM trainings WHERE training_id = ?`;
    return pool.query(query, array);
}
