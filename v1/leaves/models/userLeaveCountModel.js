const userLeaveCountTable = `
CREATE TABLE IF NOT EXISTS userLeaveCounts (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    leave_type_id int NOT NULL,
    leave_type varchar(50) NOT NULL,
    leave_count int NOT NULL,
    leave_taken_count int NOT NULL DEFAULT 0,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (leave_type_id) REFERENCES leaveTypeCounts(_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (emp_id) REFERENCES users(emp_id) ON DELETE CASCADE
) AUTO_INCREMENT = 1111;
`
export default userLeaveCountTable