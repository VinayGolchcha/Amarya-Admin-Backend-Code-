const temporary_notesTable = `
CREATE TABLE IF NOT EXISTS temporary_notes (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id varchar(255) NOT NULL,
    note varchar(150)
  )`;

// const temporary_notesTable = `
// CREATE TABLE IF NOT EXISTS temporary_notes (
//     _id INT AUTO_INCREMENT PRIMARY KEY,
//     emp_id varchar(255) NOT NULL,
//     note varchar(255)
//   )`;

export default temporary_notesTable;
