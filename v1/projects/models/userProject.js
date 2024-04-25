const userProjectTable = `
CREATE TABLE IF NOT EXISTS projects (
    _id int NOT NULL AUTO_INCREMENT,
    project_id varchar(255) NOT NULL,
    emp_id varchar(255) NOT NULL,
    tech  varchar(255) NOT NULL,
    start_month varchar(255) NOT NULL,
    end_month varchar(255),
    project_manager varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
) AUTO_INCREMENT = 1111`;

export default userProjectTable;
