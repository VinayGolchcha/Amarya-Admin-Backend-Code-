import pool from "../../../config/db.js";

export const addPolicyQuery = (array) => {
    let query = `
    insert into policies (
        policy_type,
        image_data  
    ) VALUES (? , ?);`;
    return pool.query(query,array);

}

export const deletePolicyQuery = (array) => {
    let query = `
    delete from policies where _id = ?;
    `;
    return pool.query(query,array);
}
export const fetchPolicyQuery = () => {
    let query = ` SELECT
    policy_type,
    image_data
    FROM
    policies;`;
    return pool.query(query);
}
export const updatePolicyQuery = (query, array) => {
    return pool.query(query, array);
  };