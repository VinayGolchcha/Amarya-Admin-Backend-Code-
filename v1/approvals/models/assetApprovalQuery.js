import pool from "../../../config/db.js"

export const assetApprovalQuery = async (array1, array2, array3) => {
    
    const query1 = `
        UPDATE userAssets 
        SET asset_id = ?, issued_from = ?, status = ? 
        WHERE emp_id = ? AND item = ? AND asset_type = ? AND status = 'pending';
    `;
    
    const query2 = `
        UPDATE approvals
        SET status = ?, approval_date = ?, issued_from = ?, foreign_id = ?
        WHERE emp_id = ? AND item = ? AND asset_type = ?;
    `;
    
    const query3 = `
        UPDATE assets
        SET status = 'assigned'
        WHERE item = ? AND asset_id = ?;
    `;
    
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        await connection.query(query1, array1);
        await connection.query(query2, array2);
        await connection.query(query3, array3);
        
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        console.error("Error executing assetApprovalQuery:", error);
        throw error;
    } finally {
        connection.release();
    }
}

export const assetRejectionQuery = async(array1, array2) => {
    const query1 = `UPDATE userAssets 
    SET status = ? 
    WHERE emp_id = ? AND item = ?;
    `
    const query2 = `UPDATE approvals
    SET status =?
    WHERE emp_id = ?
     AND item = ?`
    pool.query(query1, array1)
    pool.query(query2, array2)
}

export const insertApprovalQuery=(array)=>{
    const query = `INSERT INTO approvals(
        emp_id,
        request_type,
        item,
        request_date,
        subject,
        body,
        asset_type
    ) VALUES (?,?,?,?,?,?,?);`
    return pool.query(query, array)
}

export const deleteAssetQuery = async (array) => {
    const query1 = `
        DELETE FROM approvals 
        WHERE foreign_id = ? AND emp_id = ?;
    `;
    const query2 = `
        DELETE FROM userAssets 
        WHERE asset_id = ? AND emp_id = ?;
    `
    pool.query(query1, array);
    pool.query(query2, array);
};

export const checkIfAlreadyAssigned= async(array)=>{
    const query = `SELECT * 
    FROM userAssets 
    WHERE emp_id = ? 
        AND foreign_id = ? 
        AND status = ? 
        AND LOWER(requirement_type) = LOWER('new item')
    ;`
    try {
        const [results] = await pool.query(query, array);
        return results;
    } catch (error) {
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            // Error due to unknown column 'foreign_id'
            console.error("Error: Unknown column 'foreign_id' in 'where clause'");
            return [[]];
        } else {
            // Other errors
            throw error;
        }
    }
}

export const fetchAssetDataQuery=(array)=>{
    const query = `SELECT * FROM assets WHERE asset_id = ?`
    return pool.query(query, array)
}