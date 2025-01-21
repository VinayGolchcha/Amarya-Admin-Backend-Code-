const embeddingTable = `
CREATE TABLE IF NOT EXISTS "embeddings" (
  "_id" int NOT NULL AUTO_INCREMENT,
  "embedding" TEXT NOT NULL,
  "updated_at" datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("_id")
)AUTO_INCREMENT = 1111`;

export default embeddingTable;
