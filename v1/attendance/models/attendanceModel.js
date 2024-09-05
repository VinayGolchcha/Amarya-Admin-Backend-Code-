const attendanceTable = `
CREATE TABLE IF NOT EXISTS "userAttendance" (
  "id" int NOT NULL AUTO_INCREMENT,
  "status" enum('PRESENT','ABSENT') DEFAULT NULL,
  "date" date DEFAULT NULL,
  "updated_at" datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  "in_time" datetime DEFAULT NULL,
  "out_time" datetime DEFAULT NULL,
  "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
  "snapshot" blob,
  "user_id" int DEFAULT NULL,
  PRIMARY KEY ("id"),
  KEY "userAttendance_users_FK" ("user_id"),
  CONSTRAINT "userAttendance_users_FK" FOREIGN KEY ("user_id") REFERENCES "users" ("_id") ON DELETE RESTRICT
)`;

export default attendanceTable;