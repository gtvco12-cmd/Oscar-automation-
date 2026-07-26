import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function downloadImage(url, filename) {
    const outputPath = path.join(__dirname, '..', filename);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
    });
    
    await fs.writeFile(outputPath, response.data);
    return { path: outputPath, url };
}

export async function generateImages(topic) {
    const encodedTopic = encodeURIComponent(topic);

    // Interchangeable Image Provider Layer
    if (config.IMAGE_PROVIDER === 'pollinations') {
        const img1Url = `https://image.pollinations.ai/prompt/High%20quality%20blog%20header%20image%20about%20${encodedTopic}?width=${config.IMAGE_PROMPTS.BLOG_WIDTH}&height=${config.IMAGE_PROMPTS.BLOG_HEIGHT}&nologo=true&seed=101`;
        const img2Url = `https://image.pollinations.ai/prompt/Detailed%20infographic%20or%20editorial%20photo%20about%20${encodedTopic}?width=${config.IMAGE_PROMPTS.BLOG_WIDTH}&height=${config.IMAGE_PROMPTS.BLOG_HEIGHT}&nologo=true&seed=202`;
        const pinUrl = `https://image.pollinations.ai/prompt/Aesthetic%20pinterest%20pin%20design%20for%20${encodedTopic}?width=${config.IMAGE_PROMPTS.PIN_WIDTH}&height=${config.IMAGE_PROMPTS.PIN_HEIGHT}&nologo=true&seed=303`;

        console.log('Downloading Image 1...');
        const img1 = await downloadImage(img1Url, 'image1.jpg');
        
        console.log('Downloading Image 2...');
        const img2 = await downloadImage(img2Url, 'image2.jpg');
        
        console.log('Downloading Pinterest Pin Image...');
        const pin = await downloadImage(pinUrl, 'pin.png');

        return { img1, img2, pin };
    }

    throw new Error(`Unsupported image provider: ${config.IMAGE_PROVIDER}. Update src/config.js to switch providers.`);
}
