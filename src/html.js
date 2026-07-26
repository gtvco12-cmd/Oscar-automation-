import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function buildHtml(rawHtml, images) {
    // Styling ensures images don't break Blogger layouts on mobile devices
    const imgStyle = "max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;";
    
    const img1Tag = `<div style="text-align: center;"><img src="${images.img1.url}" alt="Blog Header Image" style="${imgStyle}" /></div>`;
    const img2Tag = `<div style="text-align: center;"><img src="${images.img2.url}" alt="Blog Supporting Image" style="${imgStyle}" /></div>`;

    let finalHtml = rawHtml;

    if (finalHtml.includes('<!-- IMAGE_1_PLACEHOLDER -->')) {
        finalHtml = finalHtml.replace('<!-- IMAGE_1_PLACEHOLDER -->', img1Tag);
    } else {
        // Fallback: prepend the image just beneath the H1 if placeholder is missing
        finalHtml = finalHtml.replace(/(<\/h1>)/i, `$1\n${img1Tag}`);
    }

    if (finalHtml.includes('<!-- IMAGE_2_PLACEHOLDER -->')) {
        finalHtml = finalHtml.replace('<!-- IMAGE_2_PLACEHOLDER -->', img2Tag);
    } else {
        // Fallback: append image to the end of the content
        finalHtml = finalHtml + '\n' + img2Tag;
    }

    const outputPath = path.join(__dirname, '..', 'blog.html');
    await fs.writeFile(outputPath, finalHtml, 'utf-8');

    return outputPath;
}

