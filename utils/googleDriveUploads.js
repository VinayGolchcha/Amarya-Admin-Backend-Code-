import { google } from 'googleapis';
import { Readable } from 'stream';
import pool from "../config/db.js"


// const CREDENTIALS_PATH = 'credentials.json';
const TOKEN_PATH = 'token.json';

let oauth2Client;
async function saveTokenToDB(token) {
  const query = 'INSERT INTO oauth_tokens (access_token, refresh_token, scope, token_type, expiry_date) VALUES (?, ?, ?, ?, ?)';
  const values = [token.access_token, token.refresh_token, token.scope, token.token_type, token.expiry_date];
  await pool.query(query, values);
}

async function fetchTokenFromDB() {
  const [rows] = await pool.query('SELECT access_token, refresh_token, scope, token_type, expiry_date FROM oauth_tokens ORDER BY _id DESC LIMIT 1');
  return rows[0];
}

export const createOAuth2Client = async () =>{
  // const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  // const { client_secret, client_id, redirect_uris } = credentials.installed;
  let client_id = process.env.CLIENT_ID;
  let client_secret = process.env.CLIENT_SECRET;
  let redirect_uris = process.env.REDIRECT_URL
  oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);

  oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      const tokenData = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || oauth2Client.credentials.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      };
      // fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData));
      saveTokenToDB(tokenData)
      console.log('New tokens saved to DB');
    }
  });
};

export const authenticate = async () => {
  const token = await fetchTokenFromDB();
  if (token) {
    oauth2Client.setCredentials(token); 
    if (Date.now() >= token.expiry_date) {
      try {
        await oauth2Client.refreshAccessToken();
        const newToken = oauth2Client.credentials;
        const tokenData = {
          access_token: newToken.access_token,
          refresh_token: newToken.refresh_token || token.refresh_token,
          scope: newToken.scope,
          token_type: newToken.token_type,
          expiry_date: newToken.expiry_date,
        };
        await saveTokenToDB(tokenData)
        console.log('Token refreshed and saved to DB');
      } catch (err) {
        console.error('Error refreshing access token:', err);
      }
    }
  } else {
    console.error('No token found. Please run the authorization flow first.');
  }
};


const bufferToStream = (buffer)=> {
    const readable = new Readable();
    readable._read = () => {};  
    readable.push(buffer);
    readable.push(null);
    return readable;
  }
  
  export const uploadFileToDrive = async(file)=> {
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const folder = "1pFh3MmndAWQK7301BMz6YAVBFbIGTLQ2";
    const fileMetadata = { 
      name: file.originalname,
      parents: [folder],
    };
    
    const media = { 
      mimeType: file.mimetype, 
      body: bufferToStream(file.buffer),
    };
  
    try {
      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
      });
      
      const webViewLink = response.data.webViewLink;
      return webViewLink
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }