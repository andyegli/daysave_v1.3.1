#!/bin/bash
# DaySave Project Setup Script

echo "🚀 Setting up DaySave project structure..."

# Create main project directory
#mkdir -p daysave-app
#cd daysave-app

# Create directory structure
mkdir -p {public/{images,css,js},logs,scripts,config,tests,docs}

echo "📁 Created project directory structure"

# Create subdirectories
mkdir -p public/images/{logos,icons,mockups,social}
mkdir -p views/{partials,layouts}
mkdir -p config/{database,oauth,apis}

echo "📂 Created subdirectories"

# Create package.json
cat > package.json << 'EOF'
{
  "name": "daysave-app",
  "version": "1.1.1",
  "description": "DaySave - Save Your Social Media Moments",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "db:setup": "node scripts/setup-db.js",
    "db:migrate": "npx sequelize-cli db:migrate",
    "db:seed": "npx sequelize-cli db:seed:all",
    "build": "npm run lint && npm test",
    "deploy": "gcloud app deploy",
    "logo:optimize": "node scripts/optimize-images.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "express-rate-limit": "^6.7.0",
    "express-validator": "^6.15.0",
    "ejs": "^3.1.9",
    "sequelize": "^6.32.1",
    "mysql2": "^3.5.2",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.1",
    "passport": "^0.6.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-microsoft": "^1.0.0",
    "passport-apple": "^2.0.2",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "i18n": "^0.15.1",
    "winston": "^3.9.0",
    "nodemailer": "^6.9.3",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.0",
    "speakeasy": "^2.0.0",
    "dotenv": "^16.1.4"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0",
    "eslint": "^8.43.0",
    "sharp": "^0.32.1"
  }
}
EOF

echo "📦 Created package.json"

# Create .env.example
cat > .env.example << 'EOF'
# DaySave Application Environment Variables

# Application Settings
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-super-secret-session-key-here

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=daysave
DB_USER=root
DB_PASSWORD=your-database-password

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=com.daysave.app
MICROSOFT_CLIENT_ID=your-microsoft-client-id

# Brand Colors (for reference)
BRAND_PRIMARY=#2596be
BRAND_SECONDARY=#a1d8c9
BRAND_ACCENT=#fbda6a
BRAND_SUCCESS=#d8e2a8
BRAND_WARNING=#f0e28b
BRAND_INFO=#87c0a9
BRAND_DANGER=#fbce3c
BRAND_DARK=#309b9c
BRAND_LIGHT=#bfcc8d
EOF

echo "🔧 Created .env.example"

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Uploads and temporary files
uploads/
temp/
tmp/

# Google Cloud
gcloud/
.gcloudignore

# Database
*.sqlite
*.db

# SSL certificates
*.pem
*.key
*.crt
EOF

echo "📄 Created .gitignore"

# Create README.md
cat > README.md << 'EOF'
# DaySave - Save Your Social Media Moments

<div align="center">
  <img src="public/images/daysave-logo.png" alt="DaySave Logo" width="120" height="120">
  <h3>Organize, analyze, and share content from 11 social platforms</h3>
</div>

## 🎨 Brand Colors

- **Primary Blue**: `#2596be` - Main brand color
- **Light Teal**: `#a1d8c9` - Secondary brand color  
- **Bright Yellow**: `#fbda6a` - Accent color
- **Light Green**: `#d8e2a8` - Success color
- **Light Yellow**: `#f0e28b` - Warning color
- **Teal**: `#87c0a9` - Info color
- **Gold**: `#fbce3c` - Danger/highlight color
- **Dark Teal**: `#309b9c` - Dark variant
- **Sage Green**: `#bfcc8d` - Light variant

## 🚀 Features

- **11 Social Platforms**: Facebook, YouTube, Instagram, TikTok, WeChat, Messenger, Telegram, Snapchat, Pinterest, Twitter/X, WhatsApp
- **AI-Powered Analysis**: Content summarization, sentiment analysis, auto-tagging
- **Smart Contacts**: Apple iPhone-compatible contact management with relationships
- **Multilingual Support**: English, German, French, Italian, Spanish
- **Enterprise Security**: 2FA, encryption, device fingerprinting
- **Modern UI**: Bootstrap 5 with custom gradient styling

## 🛠 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Setup Database
```bash
npm run db:setup
```

### 4. Add Logo Files
Save your logo as `public/images/daysave-logo.png` (recommended: 512x512px)

### 5. Start Development Server
```bash
npm run dev
```

## 📁 Project Structure

```
daysave-app/
├── app.js                 # Main application file
├── package.json
├── .env.example
├── views/                 # EJS templates
│   ├── index.ejs         # Landing page
│   ├── login.ejs         # Login page
│   ├── register.ejs      # Registration page
│   ├── dashboard.ejs     # User dashboard
│   ├── contacts.ejs      # Contacts management
│   ├── terms.ejs         # Terms of trade
│   ├── privacy.ejs       # Privacy policy
│   └── contact.ejs       # Contact form
├── public/               # Static assets
│   ├── images/          # Logo and images
│   ├── css/             # Custom stylesheets
│   └── js/              # Client-side JavaScript
├── locales/             # Translation files
│   ├── en.json          # English translations
│   ├── de.json          # German translations
│   └── ...
├── config/              # Configuration files
├── scripts/             # Utility scripts
└── logs/                # Application logs
```

## 🎨 Logo Usage

### Navbar Brand
```html
<a class="navbar-brand" href="/">
    <img src="/images/daysave-logo.png" alt="DaySave" width="32" height="32" class="me-2">
    DaySave
</a>
```

### Hero Section
```html
<div class="text-center">
    <img src="/images/daysave-logo.png" alt="DaySave" width="80" height="80" class="mb-3">
    <h1>DaySave</h1>
</div>
```

## 🌈 CSS Custom Properties

```css
:root {
    --primary-color: #2596be;
    --secondary-color: #a1d8c9;
    --accent-color: #fbda6a;
    --success-color: #d8e2a8;
    --warning-color: #f0e28b;
    --info-color: #87c0a9;
    --danger-color: #fbce3c;
    --dark-color: #309b9c;
    --light-color: #bfcc8d;
    
    --gradient-hero: linear-gradient(135deg, #fbda6a, #a1d8c9, #2596be);
    --gradient-primary: linear-gradient(135deg, #2596be, #309b9c);
}
```

## 🔧 Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run db:setup` - Initialize database
- `npm run deploy` - Deploy to Google Cloud

## 🚀 Deployment

### Google Cloud App Engine
```bash
gcloud app deploy
```

### Docker
```bash
docker build -t daysave-app .
docker run -p 3000:3000 daysave-app
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- Email: support@daysave.app
- Documentation: [docs.daysave.app](https://docs.daysave.app)
- Issues: [GitHub Issues](https://github.com/daysave/daysave-app/issues)

---

<div align="center">
  Made with ❤️ by the DaySave Team
</div>
EOF

echo "📖 Created README.md"

# Create logo optimization script
cat > scripts/optimize-images.js << 'EOF'
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
EOF

echo "🖼️  Created logo optimization script"

# Create setup completion message
cat << 'EOF'

🎉 DaySave project setup complete!

Next steps:
1. Add your logo image to public/images/daysave-logo.png
2. Run: npm install
3. Copy .env.example to .env and configure
4. Run: npm run logo:optimize (after adding logo)
5. Run: npm run db:setup
6. Run: npm run dev

Your DaySave app will be available at http://localhost:3000

The app uses your beautiful logo with the gradient color scheme:
- Primary: #2596be (blue)
- Secondary: #a1d8c9 (teal)  
- Accent: #fbda6a (yellow)
- And 6 additional complementary colors

Happy coding! 🚀
EOF
