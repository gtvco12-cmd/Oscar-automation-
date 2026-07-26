import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { config } from './config.js';

const TELEGRAM_API = `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}`;

export async function sendNotification(message) {
    try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: config.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error('Failed to send Telegram message:', error.response?.data || error.message);
    }
}

export async function sendFile(filePath, caption = '') {
    try {
        const form = new FormData();
        form.append('chat_id', config.TELEGRAM_CHAT_ID);
        form.append('document', fs.createReadStream(filePath));
        
        if (caption) {
            form.append('caption', caption);
        }

        await axios.post(`${TELEGRAM_API}/sendDocument`, form, {
            headers: form.getHeaders()
        });
        console.log(`Successfully sent ${filePath} to Telegram.`);
    } catch (error) {
        console.error(`Failed to send file ${filePath}:`, error.response?.data || error.message);
        throw error;
    }
}

