const worksheetTable = `
CREATE TABLE IF NOT EXISTS worksheets (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    team_id INT NOT NULL,
    category_id INT NOT NULL,
    date date NOT NULL,
    description varchar(255) NOT NULL,
    skill_set_id varchar(255),
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (team_id) REFERENCES teams(_id),
    FOREIGN KEY (category_id) REFERENCES categories(_id)
) AUTO_INCREMENT = 1111`;

export default worksheetTable;