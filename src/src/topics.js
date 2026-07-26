import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOPICS_FILE = path.join(__dirname, '..', 'topics.txt');

export async function getFirstTopic() {
    try {
        const data = await fs.readFile(TOPICS_FILE, 'utf-8');
        const topics = data.split('\n').map(t => t.trim()).filter(t => t.length > 0);
        
        if (topics.length === 0) {
            return null;
        }
        return topics[0];
    } catch (error) {
        console.error('Error reading topics.txt:', error.message);
        throw error;
    }
}

export async function removeFirstTopic() {
    try {
        const data = await fs.readFile(TOPICS_FILE, 'utf-8');
        const topics = data.split('\n').map(t => t.trim()).filter(t => t.length > 0);
        
        if (topics.length > 0) {
            topics.shift();
            await fs.writeFile(TOPICS_FILE, topics.join('\n') + '\n', 'utf-8');
        }
    } catch (error) {
        console.error('Error updating topics.txt:', error.message);
        throw error;
    }
}

