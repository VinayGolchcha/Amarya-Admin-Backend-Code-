const devicesTable = `
CREATE TABLE IF NOT EXISTS "cameraDevices" (
  "id" int NOT NULL AUTO_INCREMENT,
  "device_url" varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  "status" enum('ACTIVE, INACTIVE') DEFAULT NULL,
  "updated_at" datetime NOT NULL,
  "created_at" datetime NOT NULL,
  PRIMARY KEY ("id")
)`;

export default devicesTable;








