const feedbackFormTable = `
CREATE TABLE IF NOT EXISTS feedbackform (
    _id INT AUTO_INCREMENT,
    user_id varchar(255) NOT NULL,
    subject varchar(45) NOT NULL,
    description varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (user_id) REFERENCES users(emp_id)
  ) AUTO_INCREMENT = 1111;`;
  export default feedbackFormTable;
