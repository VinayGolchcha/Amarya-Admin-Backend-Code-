const policiesTable = `
CREATE TABLE IF NOT EXISTS policies (
    _id int NOT NULL AUTO_INCREMENT,
    policy_type varchar(20) NOT NULL,
    image_data LONGBLOB,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
 ) AUTO_INCREMENT = 1111`;

export default policiesTable;