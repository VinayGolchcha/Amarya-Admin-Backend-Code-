import pool from "../../../config/db.js"

export const insertSkillSetQuery = async (array) => {
    try {
        let query = `INSERT INTO skillSets (skill) VALUES (?)`;
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing insertSkillSetQuery:", error);
        throw error;
    }
}
export const updateSkillSetQuery = async (query, array) => {
    try {
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateSkillSetQuery:", error);
        throw error;
    }
}

export const getAllSkillSetQuery = async (array) => {
    try {
        let query = `SELECT * FROM skillSets`
        return pool.query(query, array);
    } catch (error) {
        console.error("Error executing updateSkillSetQuery:", error);
        throw error;
    }
}

export const deleteSkillSetQuery = async(array) => {
    try {
        let query = `DELETE FROM skillSets WHERE _id = ?`
        return pool.query(query,array)
    } catch (error) {
        console.error("Error executing deleteSkillSetQuery:", error);
        throw error;
    }
}