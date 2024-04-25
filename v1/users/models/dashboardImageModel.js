const imageTable=`
CREATE TABLE IF NOT EXISTS imageurl(
    _id int NOT NULL AUTO_INCREMENT,
    image_url varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
)AUTO_INCREMENT = 1111`;

export default imageTable;