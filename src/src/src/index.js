import { getFirstTopic, removeFirstTopic } from './topics.js';
import { generateBlogArticle } from './gemini.js';
import { generateImages } from './images.js';
import { buildHtml } from './html.js';
import { sendNotification, sendFile } from './telegram.js';

async function main() {
    let currentTopic = null;
    
    try {
        console.log('Starting Blog Automation Workflow...');
        currentTopic = await getFirstTopic();

        if (!currentTopic) {
            console.log('No topics found in topics.txt. Exiting gracefully.');
            await sendNotification('⚠️ <b>Blog Automation</b>\nNo more topics left in <code>topics.txt</code>. Please top up your list!');
            return;
        }

        console.log(`Processing Topic: "${currentTopic}"`);
        await sendNotification(`🔄 <b>Blog Automation Started</b>\nGenerating content for: <i>${currentTopic}</i>`);

        console.log('Generating content via Gemini REST API...');
        const rawHtml = await generateBlogArticle(currentTopic);

        console.log('Generating AI images...');
        const images = await generateImages(currentTopic);

        console.log('Assembling final Blogger HTML...');
        const blogHtmlPath = await buildHtml(rawHtml, images);

        console.log('Dispatching assets to Telegram...');
        await sendFile(blogHtmlPath, `📄 Ready to paste HTML: ${currentTopic}`);
        await sendFile(images.img1.path, `🖼️ Blog Image 1`);
        await sendFile(images.img2.path, `🖼️ Blog Image 2`);
        await sendFile(images.pin.path, `📌 Pinterest Pin`);

        console.log('Cleaning up processed topic...');
        await removeFirstTopic();

        await sendNotification(`✅ <b>Success!</b>\nAll assets for <i>${currentTopic}</i> have been generated and delivered.`);
        console.log('Workflow completed successfully.');

    } catch (error) {
        console.error('Workflow failed:', error);
        const errorMsg = `❌ <b>Blog Automation Failed</b>\nTopic: <i>${currentTopic || 'Unknown'}</i>\nError: <code>${error.message}</code>`;
        
        await sendNotification(errorMsg);
        
        // Throw an explicit exit code so GitHub Actions marks the run as failed
        process.exit(1);
    }
}

main();

