const userPerformanceTable = `
CREATE TABLE IF NOT EXISTS userPerformance (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    jan int DEFAULT NULL,
    feb int DEFAULT NULL,
    mar int DEFAULT NULL,
    apr int DEFAULT NULL,
    may int DEFAULT NULL,
    jun int DEFAULT NULL,
    jul int DEFAULT NULL,
    aug int DEFAULT NULL,
    sep int DEFAULT NULL,
    oct int DEFAULT NULL,
    nov int DEFAULT NULL,
    decm int DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    UNIQUE (emp_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id)
) AUTO_INCREMENT = 1111`;

export default userPerformanceTable;