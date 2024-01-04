import pool from "../../../config/db.js"

export const insertAssetQuery = (array)=> {
    let query = `INSERT INTO assets (
        asset_id,
        asset_type,
        item,
        purchase_date,
        warranty_period,
        price,
        model_number,
        item_description,
        image_url,
        created_at,
        updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?);`
    return pool.query(query, array);
}

export const getLastAssetIdQuery = () =>{
    let query = `SELECT * FROM assets ORDER BY asset_id DESC LIMIT 1`
    return pool.query(query);
}

export const insertUserAssetDataQuery = (array)=> {
    let query = `INSERT INTO userAssets (
        emp_id,
        asset_type,
        item,
        requirement_type,
        primary_purpose
    ) VALUES (?,?,?,?,?);`
    return pool.query(query, array);
}

export const fetchUserAssetsQuery = (array) => {
    let query = `
    SELECT u.username, ua.asset_type, ua.asset_id, ua.item, ua.requirement_type, ua.primary_purpose, ua.status, ua.issued_from, ua.issued_till
    FROM userAssets as ua
    JOIN users as u ON ua.emp_id = u.emp_id
    WHERE ua.emp_id = ?;
    `
    return pool.query(query, array);
}