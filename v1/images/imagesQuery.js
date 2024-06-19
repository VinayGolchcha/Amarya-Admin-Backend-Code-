import pool from "../../config/db.js";

export const insertActivityImageQuery= (array)=> {
    try{
    let query = `INSERT INTO images (
        type,
        image_url,
        public_id,
        activity_id,
        original_filename
    ) VALUES (?,?,?,?,?);`
    return pool.query(query, array);}
    catch(error){
        console.error("Error in executing in the insertActivityImageQuery:" , error);
        throw(error);
    }
}

export const deleteImageQuery = (array)=> {
    try{
    let query = `DELETE FROM images WHERE public_id = ?`
    return pool.query(query, array);}
    catch(error){
        console.error("Error in executing in the deleteImageFromDatabase:" , error);
        throw(error);
    }
}

export const fetchImagesForActivityQuery = (array)=> {
    try{
    let query = `SELECT public_id FROM images WHERE activity_id = ?`
    return pool.query(query, array);}
    catch(error){
        console.error("Error in executing in the fetchImagesForActivity:" , error);
        throw(error);
    }
}

export const fetchImagesBasedOnIdForActivityQuery = (array)=> {
    try{
    let query = `SELECT public_id, image_url, original_filename FROM images WHERE activity_id = ? AND type = 'activity'`
    return pool.query(query, array);}
    catch(error){
        console.error("Error in executing in the fetchImagesBasedOnId:" , error);
        throw(error);
    }
}

export const insertEmpImageQuery= (array)=> {
    try{
    let query = `INSERT INTO images (
        type,
        image_url,
        public_id,
        emp_id,
        original_filename
    ) VALUES (?,?,?,?,?);`
    return pool.query(query, array);}
    catch(error){
        console.error("Error in executing in the insertEmpImageQuery:" , error);
        throw(error);
    }
}

export const insertAssetImageQuery= (array)=> {
    try{
    let query = `INSERT INTO images (
        type,
        image_url,
        public_id,
        asset_id,
        original_filename
    ) VALUES (?,?,?,?,?);`
    return pool.query(query, array);}
    catch(error){
        console.error("Error in executing in the insertAssetImageQuery:" , error);
        throw(error);
    }
}

export const fetchImagesForAssetQuery = (array)=> {
    try{
    let query = `SELECT public_id FROM images WHERE asset_id = ?`
    return pool.query(query, array);}
    catch(error){
        console.error("Error in executing in the fetchImagesForAssetQuery:" , error);
        throw(error);
    }
}

export const fetchImagesForDashboardQuery = ()=> {
    try{
    let query = `SELECT public_id, image_url, original_filename FROM images WHERE type = 'dashboard'`
    return pool.query(query);}
    catch(error){
        console.error("Error in executing in the fetchImagesForDashboardQuery:" , error);
        throw(error);
    }
}