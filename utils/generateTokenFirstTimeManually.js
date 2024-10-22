import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

const TOKEN_PATH = 'token.json';

function createOAuth2Client() {
    let client_id = process.env.CLIENT_ID;
    let client_secret = process.env.CLIENT_SECRET;
    let redirect_uris = process.env.REDIRECT_URL
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);
  return oauth2Client;
}
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
  console.log('Authorize this app by visiting this URL:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token', err);
        return;
      }
      oAuth2Client.setCredentials(token);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('Token stored to', TOKEN_PATH);
      callback(oAuth2Client);
    });
  });
}

function authorize(callback) {
  const oAuth2Client = createOAuth2Client();

  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  } else {
    getNewToken(oAuth2Client, callback);
  }
}

authorize((auth) => {
  console.log('Successfully authenticated!');
});
