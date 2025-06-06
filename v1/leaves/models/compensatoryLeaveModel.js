const compensatoryLeaveCountTable = `
CREATE TABLE IF NOT EXISTS compensatoryLeaveCounts (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL UNIQUE,
    leave_type varchar(50) DEFAULT 'Compensatory Leave',
    leave_count int DEFAULT 0,
    leave_taken_count int NOT NULL DEFAULT 0,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id) ON DELETE CASCADE
) AUTO_INCREMENT = 1111;
`
export default compensatoryLeaveCountTable