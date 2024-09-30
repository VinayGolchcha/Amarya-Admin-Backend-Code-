const attendanceLogsTable = `
CREATE TABLE IF NOT EXISTS "userAttendanceLogs" (
  "id" int NOT NULL AUTO_INCREMENT,
  "status" enum('PRESENT','ABSENT') DEFAULT NULL,
  "date" date DEFAULT NULL,
  "updated_at" datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
  "user_id" int DEFAULT NULL,
  "snapshot" mediumtext,
  "is_indentify" bool DEFAULT NULL,
  PRIMARY KEY ("id"),
  KEY "userAttendanceLog_users_FK" ("user_id"),
  CONSTRAINT "userAttendanceLog_users_FK" FOREIGN KEY ("user_id") REFERENCES "users" ("_id") ON DELETE RESTRICT
) AUTO_INCREMENT = 1111`;

export default attendanceLogsTable;