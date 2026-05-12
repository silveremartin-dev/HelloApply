import { google, gmail_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs/promises';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials) as OAuth2Client;
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: OAuth2Client) {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

export async function getGmailClient(): Promise<gmail_v1.Gmail> {
  let client = await loadSavedCredentialsIfExist();
  if (!client) {
    // This will require manual intervention or a one-time local run
    throw new Error('Please run the authentication flow locally first to generate token.json');
  }
  return google.gmail({ version: 'v1', auth: client });
}

export async function searchJobEmails(gmail: gmail_v1.Gmail, query: string): Promise<gmail_v1.Schema$Message[]> {
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: query,
  });
  return res.data.messages || [];
}

export async function getEmailContent(gmail: gmail_v1.Gmail, id: string): Promise<string> {
  const res = await gmail.users.messages.get({
    userId: 'me',
    id,
  });
  const part = res.data.payload?.parts?.find(p => p.mimeType === 'text/plain') || res.data.payload;
  if (part?.body?.data) {
    return Buffer.from(part.body.data, 'base64').toString('utf-8');
  }
  return '';
}

export function extractJobUrl(content: string): string | null {
  // Simple regex to find HelloWork or other job board URLs
  const urlRegex = /https?:\/\/(www\.)?(hellowork|linkedin|indeed|pole-emploi)\.com\/[^\s<>"]+/g;
  const matches = content.match(urlRegex);
  return matches ? matches[0] : null;
}
