const unknownUserAttendanceTable = `
CREATE TABLE IF NOT EXISTS "unknownUserAttendance" (
  "id" int NOT NULL AUTO_INCREMENT,
  "date" date DEFAULT NULL,
  "updated_at" datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
  "snapshot" mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  "emp_id" varchar(100) DEFAULT NULL,
  PRIMARY KEY ("id"),
  KEY "unknownUserAttendance_users_FK" ("emp_id"),
  CONSTRAINT "unknownUserAttendance_users_FK" FOREIGN KEY ("emp_id") REFERENCES "users" ("emp_id")
) AUTO_INCREMENT =1111`;

export default unknownUserAttendanceTable;