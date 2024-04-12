const userTable = `
CREATE TABLE IF NOT EXISTS users (
    _id int NOT NULL AUTO_INCREMENT,
    emp_id varchar(255) NOT NULL UNIQUE,
    username varchar(50) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    state_name varchar(255),
    city_name varchar(255),
    profile_picture VARCHAR(255),
    blood_group varchar(255),
    mobile_number VARCHAR(15),
    emergency_contact_number VARCHAR(15),
    emergency_contact_person_info VARCHAR(255),
    address varchar(255),
    dob date,
    designation varchar(255),
    designation_type varchar(50) ,
    joining_date date ,
    experience float,
    completed_projects int ,
    performance float ,
    teams int ,
    otp int DEFAULT NULL,
    client_report int ,
    jwt_token varchar(255) ,
    role ENUM ('admin', 'user') DEFAULT 'user',
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    UNIQUE KEY email (email)
) AUTO_INCREMENT = 1111`;

export default userTable;