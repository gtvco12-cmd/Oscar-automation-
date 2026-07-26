import process from 'process';

export const config = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    
    // Abstracted image provider for easy swapping.
    // 'pollinations' is 100% free, requires no auth, and fits automation perfectly.
    IMAGE_PROVIDER: 'pollinations', 
    
    API_RETRY_ATTEMPTS: 3,
    API_RETRY_DELAY_MS: 5000,
    
    IMAGE_PROMPTS: {
        BLOG_WIDTH: 800,
        BLOG_HEIGHT: 400,
        PIN_WIDTH: 1000,
        PIN_HEIGHT: 1500
    }
};

