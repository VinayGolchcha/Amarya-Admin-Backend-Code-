const unknownUserAttendanceTable = `
CREATE TABLE IF NOT EXISTS "unknownUserAttendance" (
  "id" int NOT NULL AUTO_INCREMENT,
  "status" enum('PRESENT','ABSENT') DEFAULT NULL,
  "date" date DEFAULT NULL,
  "updated_at" datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
  "snapshot" mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY ("id")
) AUTO_INCREMENT =1111`;

export default unknownUserAttendanceTable;