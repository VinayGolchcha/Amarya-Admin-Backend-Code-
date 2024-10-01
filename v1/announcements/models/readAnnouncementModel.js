const readAnnouncementTable = `
CREATE TABLE IF NOT EXISTS readAnnouncements (
    _id int NOT NULL AUTO_INCREMENT,
    announcement_id INT NOT NULL,
    emp_id varchar(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id),
    FOREIGN KEY (emp_id) REFERENCES users(emp_id) ON DELETE CASCADE,
    FOREIGN KEY (announcement_id) REFERENCES announcements(_id) ON DELETE CASCADE
) AUTO_INCREMENT = 1111`;


export default readAnnouncementTable
