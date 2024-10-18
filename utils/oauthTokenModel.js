const oAuthTable = `
CREATE TABLE IF NOT EXISTS oauth_tokens (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    access_token TEXT,
    refresh_token TEXT,
    scope TEXT,
    token_type TEXT,
    expiry_date BIGINT,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) AUTO_INCREMENT = 1111`;

export default oAuthTable