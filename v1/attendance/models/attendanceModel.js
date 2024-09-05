const attendanceTable = `
CREATE TABLE IF NOT EXISTS "userAttendance" (
  "id" int NOT NULL AUTO_INCREMENT,
  "status" enum('PRESENT','ABSENT') DEFAULT NULL,
  "date" date DEFAULT NULL,
  "updated_at" datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  "in_time" datetime DEFAULT NULL,
  "out_time" datetime DEFAULT NULL,
  "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
  "in_snapshot" mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  "user_id" int DEFAULT NULL,
  "out_snapshot" mediumtext,
  PRIMARY KEY ("id"),
  KEY "userAttendance_users_FK" ("user_id"),
  CONSTRAINT "userAttendance_users_FK" FOREIGN KEY ("user_id") REFERENCES "users" ("_id") ON DELETE RESTRICT
) AUTO_INCREMENT = 1111`;

export default attendanceTable;