const approvalTable = `
CREATE TABLE IF NOT EXISTS approvals (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    asset_id varchar(255),
    request_type varchar(255) NOT NULL,
    item varchar(255) NOT NULL,
    subject varchar(255) NOT NULL,
    body varchar(255) NOT NULL,
    request_date date,
    issued_from date,
    issued_till date,
    status ENUM('rejected', 'approved', 'pending') DEFAULT 'pending' NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id)
) AUTO_INCREMENT = 1111;
`

export default approvalTable