const feedbackFormTable=`
CREATE TABLE IF NOT EXISTS feedbackform(
    _id int NOT NULL AUTO_INCREMENT,
    subject varchar(45) NOT NULL,
    description varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id)
)AUTO_INCREMENT = 1111
`;
export default feedbackFormTable;
