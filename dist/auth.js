import fs from 'fs/promises';
import path from 'path';
import os from 'os';
export async function getAccessToken() {
    const homeDir = os.homedir();
    const credsPath = path.join(homeDir, '.gemini', 'oauth_creds.json');
    try {
        const data = await fs.readFile(credsPath, 'utf-8');
        const creds = JSON.parse(data);
        if (!creds.access_token) {
            throw new Error('No access_token found in oauth_creds.json');
        }
        return creds.access_token;
    }
    catch (error) {
        console.error('Failed to read OAuth credentials:', error);
        throw new Error('Could not find valid Google Login credentials. Please run "gemini auth login" or ensure you are logged in with Google.');
    }
}
