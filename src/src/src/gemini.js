import axios from 'axios';
import { config } from './config.js';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateBlogArticle(topic) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${config.GEMINI_API_KEY}`;

    const prompt = `
Write a highly optimized SEO blog post about: "${topic}".

STRICT OUTPUT RULES:
- Return ONLY valid HTML. Do not include markdown formatting like \`\`\`html.
- Provide the SEO Meta Description at the very top inside an HTML comment: <!-- META DESCRIPTION: [your description] -->
- The content must start with an <h1> tag for the main title.
- Use <h2> tags for subheadings.
- Include well-structured paragraphs and at least one <ul> bulleted list.
- Put EXACTLY TWO placeholders for images formatted exactly like this: 
  <!-- IMAGE_1_PLACEHOLDER -->
  <!-- IMAGE_2_PLACEHOLDER -->
- Ensure the HTML is clean and directly pasteable into Blogger HTML mode. No <html>, <head>, or <body> tags, just the raw content structure.
`;

    for (let i = 0; i < config.API_RETRY_ATTEMPTS; i++) {
        try {
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4000
                }
            }, { 
                headers: { 'Content-Type': 'application/json' } 
            });

            let htmlContent = response.data.candidates[0].content.parts[0].text;
            
            // Strip any rogue markdown codeblock wrappers if the model ignores the prompt
            htmlContent = htmlContent.replace(/```html/gi, '').replace(/```/gi, '').trim();
            
            return htmlContent;
        } catch (error) {
            console.error(`Gemini API Error (Attempt ${i + 1}):`, error.response?.data || error.message);
            if (i === config.API_RETRY_ATTEMPTS - 1) {
                throw new Error(`Gemini API failed after ${config.API_RETRY_ATTEMPTS} attempts: ${error.message}`);
            }
            await delay(config.API_RETRY_DELAY_MS);
        }
    }
}
