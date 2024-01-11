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
export const getAssetDataQuery = (array) =>{
    let query = `SELECT * FROM assets WHERE asset_id = ?`
    return pool.query(query, array);
}

export const insertUserAssetDataQuery = (array)=> {
    let query = `INSERT INTO userAssets (
        emp_id,
        asset_type,
        item,
        requirement_type,
        primary_purpose,
        item_details
    ) VALUES (?,?,?,?,?,?);`
    return pool.query(query, array);
}

export const fetchUserAssetsQuery = (array) => {
    let query = `
    SELECT CONCAT(u.first_name, ' ', u.last_name) AS name,u.emp_id, ua.asset_type, ua.asset_id, ua.item, ua.requirement_type, ua.primary_purpose,
    ua.status, ua.issued_from, ua.issued_till, a.warranty_period
    FROM userAssets as ua
    JOIN users as u ON ua.emp_id = u.emp_id
    JOIN assets as a ON ua.asset_id = a.asset_id
    WHERE ua.emp_id = ?;`
    return pool.query(query, array);
}
export const fetchAssetsQuery = (array) => {
    let query = `
    SELECT CONCAT(u.first_name, ' ', u.last_name) AS assignee, a.asset_id, a.purchase_date, a.image_url, a.item, a.item_description, ua.issued_from, ua.issued_till, a.warranty_period
    FROM assets as a
    JOIN userAssets as ua ON a.asset_id = ua.asset_id
    JOIN users as u ON u.emp_id = ua.emp_id
    `
    return pool.query(query, array);
}


export const deleteAssetQuery = async (array) => {
    const query = `
        DELETE FROM assets 
        WHERE asset_id = ?;
    `;
    return pool.query(query, array);
};