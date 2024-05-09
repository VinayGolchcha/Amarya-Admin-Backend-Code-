const userProjectTable = `
CREATE TABLE IF NOT EXISTS userproject (
    _id int NOT NULL AUTO_INCREMENT,
    project_id int NOT NULL,
    emp_id varchar(255) NOT NULL,
    tech  varchar(255) NOT NULL,
    team_id int NOT NULL,
    start_month varchar(255) NOT NULL,
    end_month varchar(255),
    project_manager varchar(255) NOT NULL,
    status ENUM('in review','in progress','on hold','completed'),
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (project_id) REFERENCES projects(_id)
) AUTO_INCREMENT = 1111`;

export default userProjectTable;
