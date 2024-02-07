const userLeaveCountTable = `
CREATE TABLE IF NOT EXISTS userLeaveCount (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    leave_type varchar(255) NOT NULL,
    leave_count int NOT NULL,
    leave_taken_count int NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id)
) AUTO_INCREMENT = 1111;
)
`