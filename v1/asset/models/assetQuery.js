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