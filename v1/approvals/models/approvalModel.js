const approvalTable = `
CREATE TABLE IF NOT EXISTS approvals (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    foreign_id varchar(255),
    
    approval_date date,
    issued_from date,
    issued_till date,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id)
) AUTO_INCREMENT = 1111;
`

export default approvalTable