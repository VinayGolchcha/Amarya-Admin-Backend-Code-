import { validationResult } from "express-validator";
import pool from "../../../config/db.js";
import { errorResponse } from "../../../utils/response.js";

export const handleAddStickeyNotes = async (req, res) => {
  try {
    // const { note } = req.body;
    
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
        return errorResponse(res, errors.array(), "")
    }
    const { note, emp_id } = req.body;
    // Insert note into the database
    const result = await pool.query(
      "INSERT INTO temporary_notes (note , emp_id) VALUES (? , ?)",
      [note, emp_id]
    );
    return res.status(200).json({ message: "Note stored successfully" });
  } catch (err) {
    console.error("Error storing note:", err);
    return res.status(500).json({ error: "Error storing note" });
  }
};

export const handleGetStickyNotes = async (req, res, next) => {
  // Retrieve all notes from the database
  try {
    let [result] = await pool.query("SELECT * FROM temporary_notes");
    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving notes" });
    next(error);
  }
};

export const handleDeleteStickyNotes = async (req, res, next) => {
  const { _id } = req.body;
  // Log request body and _id type
  try {
    // Verify if _id is a valid string
    if (typeof _id === "string") {
      return res.status(400).json({ error: "Invalid _id format" });
    }

    const sql = "DELETE FROM temporary_notes WHERE _id = ?";
    let [result] = await pool.query(sql, [_id]);
    console.log(result); // Log query result

    // Check if any rows were affected by the delete operation
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No record found with the provided _id" });
    }

    return res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error); // Log error
    return res.status(500).json({ error: "Internal server error" });
  }
};
