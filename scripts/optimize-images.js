const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeLogos() {
    const logoPath = path.join(__dirname, '../public/images/daysave-logo.png');
    
    if (!fs.existsSync(logoPath)) {
        console.log('⚠️  Logo file not found. Please add daysave-logo.png to public/images/');
        return;
    }
    
    console.log('🖼️  Optimizing logo images...');
    
    // Create different sizes
    await sharp(logoPath)
        .resize(16, 16)
        .png()
        .toFile(path.join(__dirname, '../public/images/favicon-16x16.png'));
    
    await sharp(logoPath)
        .resize(32, 32)
        .png()
        .toFile(path.join(__dirname, '../public/images/favicon-32x32.png'));
    
    await sharp(logoPath)
        .resize(64, 64)
        .png()
        .toFile(path.join(__dirname, '../public/images/daysave-logo-small.png'));
    
    await sharp(logoPath)
        .resize(180, 180)
        .png()
        .toFile(path.join(__dirname, '../public/images/apple-touch-icon.png'));
    
    // Create favicon.ico
    await sharp(logoPath)
        .resize(32, 32)
        .png()
        .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('✅ Logo optimization complete!');
}

optimizeLogos().catch(console.error);
