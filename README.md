# Auto Blogger Actions

A fully automated, zero-touch SEO blog generation system powered by GitHub Actions. 

## Features
- Reads topics automatically from `topics.txt`.
- Generates high-quality SEO HTML content via Gemini REST API.
- Generates free AI blog images and Pinterest pins.
- Assembles HTML formatted specifically for Blogger HTML Mode.
- Sends the compiled HTML and images to Telegram.
- Removes processed topics and commits changes back to GitHub.

## Setup
1. Add topics to `topics.txt` (one per line).
2. Go to your GitHub Repository -> Settings -> Secrets and variables -> Actions.
3. Add the following secrets:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `TELEGRAM_BOT_TOKEN`: Your Telegram Bot Token via BotFather.
   - `TELEGRAM_CHAT_ID`: Your Telegram Chat ID.
4. Go to the **Actions** tab and trigger "Blog Automation" manually, or wait for the daily cron schedule.
