const userTable = `
CREATE TABLE IF NOT EXISTS users (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    state_name varchar(255) NOT NULL,
    city_name varchar(255) NOT NULL,
    profile_picture VARCHAR(255) NOT NULL,
    blood_group varchar(255) NOT NULL,
    mobile_number VARCHAR(15),
    emergency_contact_number VARCHAR(15),
    emergency_contact_person_info VARCHAR(255),
    address varchar(255) NOT NULL,
    dob date NOT NULL,
    designation varchar(255) NOT NULL,
    designation_type varchar(50) NOT NULL,
    joining_date date NOT NULL,
    experience int NOT NULL,
    completed_projects int NOT NULL,
    performance int NOT NULL,
    teams int NOT NULL,
    client_report int NOT NULL,
    jwt_token varchar(255) NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    PRIMARY KEY (_id),
    UNIQUE KEY email (email)
) AUTO_INCREMENT = 1111`;

export default userTable;