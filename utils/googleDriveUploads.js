import fs from 'fs';
import { google } from 'googleapis';
import { Readable } from 'stream';


// const CREDENTIALS_PATH = 'credentials.json';
const TOKEN_PATH = 'token.json';

let oauth2Client;

export const createOAuth2Client = () =>{
  // const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  // const { client_secret, client_id, redirect_uris } = credentials.installed;
  let client_id = process.env.client_id;
  let client_secret = process.env.CLIENT_SECRET;
  let redirect_uris = process.env.REDIRECT_URL
  oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      const tokenData = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || oauth2Client.credentials.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      };
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData));
      console.log('New tokens saved to', TOKEN_PATH);
    }
  });
};

export const authenticate = async () => {
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
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
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData));
        console.log('Token refreshed and saved to', TOKEN_PATH);
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