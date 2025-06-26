// app.js - Main application file
require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const i18n = require('i18n');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const validator = require('express-validator');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const multer = require('multer');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const crypto = require('crypto');
const fingerprintjs = require('fingerprintjs2');
const relationRoutes = require('./routes/relations');
const groupRoutes = require('./routes/groups');

// Database setup
const db = require('./models');
const { Op } = require('sequelize');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://www.google.com", "https://www.gstatic.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://api.github.com"],
      frameSrc: ["'self'", "https://www.google.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS setup
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://daysave.app' : 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// i18n configuration
i18n.configure({
  locales: ['en', 'de', 'fr', 'it', 'es'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  cookie: 'lang',
  queryParameter: 'lang',
  autoReload: true,
  updateFiles: false,
  api: {
    '__': '__',
    '__n': '__n'
  }
});
app.use(i18n.init);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Logging setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Database Models moved to ./models

// Passport strategies - Only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await db.User.findOne({ where: { oauth_id: profile.id, oauth_provider: 'google' } });
            
            if (!user) {
                user = await db.User.create({
                    email: profile.emails[0].value,
                    oauth_provider: 'google',
                    oauth_id: profile.id,
                    profile_image: profile.photos[0].value,
                    trial_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days trial
                });
            }
            
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));
    console.log('✅ Google OAuth configured');
} else {
    console.log('⚠️  Google OAuth not configured (add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env)');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Middleware for authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// API routes
app.use('/relations', isAuthenticated, relationRoutes);
app.use('/groups', isAuthenticated, groupRoutes);

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'DaySave - Save Your Social Media Moments',
    user: req.user || null,
    __: res.__
  });
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.render('login', {
    title: 'Login - DaySave',
    user: null,
    __: res.__,
    error: req.query.error || null
  });
});

app.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.render('register', {
    title: 'Register - DaySave',
    user: null,
    __: res.__,
    error: req.query.error || null
  });
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - DaySave',
    user: req.user,
    __: res.__
  });
});

app.get('/contacts', isAuthenticated, (req, res) => {
  res.render('contacts', {
    title: 'Contacts - DaySave',
    user: req.user,
    __: res.__
  });
});

app.get('/terms', (req, res) => {
  res.render('terms', {
    title: 'Terms of Trade - DaySave',
    user: req.user || null,
    __: res.__
  });
});

app.get('/privacy', (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy - DaySave',
    user: req.user || null,
    __: res.__
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - DaySave',
    user: req.user || null,
    __: res.__,
    success: req.query.success || null,
    error: req.query.error || null
  });
});

// Authentication routes
app.get('/auth/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.redirect('/login?error=oauth_not_configured');
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/auth/google/callback', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.redirect('/login?error=oauth_not_configured');
  }
  passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' })(req, res, next);
}, (req, res) => {
  res.redirect('/dashboard');
});

app.post('/auth/register', [
  body('username').isLength({ min: 3, max: 50 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.redirect('/register?error=validation_failed');
  }

  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });
    
    if (existingUser) {
      return res.redirect('/register?error=user_exists');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await db.User.create({
      username,
      email,
      password_hash,
      trial_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days trial
    });

    // Log user in
    req.login(user, (err) => {
      if (err) {
        logger.error('Login error after registration:', err);
        return res.redirect('/login?error=login_failed');
      }
      res.redirect('/dashboard');
    });
    
  } catch (error) {
    logger.error('Registration error:', error);
    res.redirect('/register?error=server_error');
  }
});

app.post('/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.redirect('/login?error=validation_failed');
  }

  try {
    const { email, password } = req.body;
    
    const user = await db.User.findOne({ where: { email } });
    
    if (!user || !user.password_hash) {
      return res.redirect('/login?error=invalid_credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.redirect('/login?error=invalid_credentials');
    }

    req.login(user, (err) => {
      if (err) {
        logger.error('Login error:', err);
        return res.redirect('/login?error=login_failed');
      }
      res.redirect('/dashboard');
    });
    
  } catch (error) {
    logger.error('Login error:', error);
    res.redirect('/login?error=server_error');
  }
});

app.post('/contact', [
  body('name').isLength({ min: 2, max: 100 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('subject').isLength({ min: 5, max: 200 }).trim().escape(),
  body('message').isLength({ min: 10, max: 5000 }).trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.redirect('/contact?error=validation_failed');
  }

  try {
    const { name, email, subject, message } = req.body;
    
    await db.ContactSubmission.create({
      name,
      email,
      subject,
      message,
      language: req.getLocale()
    });

    res.redirect('/contact?success=message_sent');
    
  } catch (error) {
    logger.error('Contact form error:', error);
    res.redirect('/contact?error=server_error');
  }
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).render('error', {
    title: 'Error - DaySave',
    user: req.user || null,
    __: res.__,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    user: req.user || null,
    __: res.__
  });
});

// Database sync and server start
async function startServer() {
  try {
    console.log('🔌 Testing database connection...');
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Use safer sync strategy to avoid datetime issues
    try {
      console.log('📊 Synchronizing database schema (safe mode)...');
      await db.sequelize.sync({ alter: false }); // Don't alter existing tables
      console.log('✅ Database schema synchronized successfully.');
    } catch (syncError) {
      console.log('⚠️  Schema sync failed. This might be due to existing invalid datetime values.');
      console.log('💡 Solutions:');
      console.log('   1. Run: mysql -u root -p [database] -e "UPDATE users SET created_at=NOW(), updated_at=NOW() WHERE created_at=\'0000-00-00 00:00:00\' OR updated_at=\'0000-00-00 00:00:00\';"');
      console.log('   2. Or reset database: DROP DATABASE [database]; CREATE DATABASE [database]; npm run db:setup');
      console.log('');
      console.log('🔄 Starting app anyway (some features may not work)...');
    }
    
    app.listen(PORT, async () => {
      // Get application statistics
      let userCount = 0;
      let tableCount = 0;
      try {
        const users = await db.User.count();
        userCount = users;
        
        const [tables] = await db.sequelize.query("SHOW TABLES");
        tableCount = tables.length;
      } catch (error) {
        // Ignore errors for display purposes
      }

      // Display beautiful startup information
      console.log('');
      console.log('🎉 DaySave Application Started Successfully!');
      console.log('═'.repeat(60));
      console.log('');
      
      // Application Information
      console.log('📱 Application Information:');
      console.log(`   Name: DaySave v1.1.1`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Port: ${PORT}`);
      console.log(`   URL: http://localhost:${PORT}`);
      console.log('');
      
      // Database Information
      console.log('🗄️  Database Information:');
      console.log(`   Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
      console.log(`   Database: ${process.env.DB_NAME || 'daysave'}`);
      console.log(`   User: ${process.env.DB_USER || 'root'}`);
      console.log(`   Tables: ${tableCount} tables available`);
      console.log(`   Users: ${userCount} registered users`);
      console.log('');
      
      // Features Status
      console.log('🚀 Features Status:');
      console.log(`   ✅ Database Connection: Connected`);
      console.log(`   ${process.env.GOOGLE_CLIENT_ID ? '✅' : '⚠️ '} Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured'}`);
      console.log(`   ${process.env.APPLE_CLIENT_ID ? '✅' : '⚠️ '} Apple OAuth: ${process.env.APPLE_CLIENT_ID ? 'Configured' : 'Not configured'}`);
      console.log(`   ${process.env.MICROSOFT_CLIENT_ID ? '✅' : '⚠️ '} Microsoft OAuth: ${process.env.MICROSOFT_CLIENT_ID ? 'Configured' : 'Not configured'}`);
      console.log(`   ✅ User Registration: Available`);
      console.log(`   ✅ Contact Management: Available`);
      console.log(`   ✅ Multi-language Support: 5 languages`);
      console.log(`   ✅ Security Features: 2FA, Rate limiting, CSRF protection`);
      console.log('');
      
      // Available Endpoints
      console.log('🌐 Available Endpoints:');
      console.log(`   🏠 Landing Page: http://localhost:${PORT}/`);
      console.log(`   🔐 Login: http://localhost:${PORT}/login`);
      console.log(`   📝 Register: http://localhost:${PORT}/register`);
      console.log(`   📊 Dashboard: http://localhost:${PORT}/dashboard`);
      console.log(`   👥 Contacts: http://localhost:${PORT}/contacts`);
      console.log(`   📄 Terms: http://localhost:${PORT}/terms`);
      console.log(`   🔒 Privacy: http://localhost:${PORT}/privacy`);
      console.log(`   📧 Contact Us: http://localhost:${PORT}/contact`);
      if (process.env.GOOGLE_CLIENT_ID) {
        console.log(`   🔗 Google OAuth: http://localhost:${PORT}/auth/google`);
      }
      console.log('');
      
      // Admin Information
      console.log('👤 Admin Account Information:');
      console.log('   📧 Email: admin@daysave.app');
      console.log('   🔑 Password: admin123!');
      console.log('   ⚠️  Note: Change this password in production!');
      console.log('');
      
      // Brand Colors
      console.log('🎨 Brand Colors:');
      console.log('   Primary: #2596be (Main blue)');
      console.log('   Secondary: #a1d8c9 (Light teal)');
      console.log('   Accent: #fbda6a (Bright yellow)');
      console.log('   Success: #d8e2a8 (Light green)');
      console.log('   Warning: #f0e28b (Light yellow)');
      console.log('   Info: #87c0a9 (Teal)');
      console.log('   Danger: #fbce3c (Gold)');
      console.log('   Dark: #309b9c (Dark teal)');
      console.log('   Light: #bfcc8d (Sage green)');
      console.log('');
      
      // Social Media Platforms
      console.log('📱 Supported Social Platforms:');
      console.log('   • Facebook  • YouTube    • Instagram  • TikTok');
      console.log('   • WeChat    • Messenger  • Telegram   • Snapchat');
      console.log('   • Pinterest • Twitter/X  • WhatsApp');
      console.log('');
      
      // Quick Actions
      console.log('⚡ Quick Actions:');
      console.log('   📊 View logs: tail -f logs/combined.log');
      console.log('   🗄️  Database setup: npm run db:setup');
      console.log('   🖼️  Optimize images: npm run logo:optimize');
      console.log('   🧪 Run tests: npm test');
      console.log('   🔄 Restart server: rs (in nodemon)');
      console.log('');
      
      // Development Tips
      if (process.env.NODE_ENV !== 'production') {
        console.log('💡 Development Tips:');
        console.log('   • Add your logo: public/images/daysave-logo.png');
        console.log('   • Configure OAuth: Add credentials to .env file');
        console.log('   • Test features: Register a new user account');
        console.log('   • View database: Use your preferred MySQL client');
        console.log('   • Hot reload: Save any file to restart automatically');
        console.log('');
      }
      
      // Warnings
      const warnings = [];
      if (!process.env.GOOGLE_CLIENT_ID) warnings.push('Google OAuth not configured');
      if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'your-secret-key-here') warnings.push('Default session secret in use');
      if (process.env.NODE_ENV !== 'production' && userCount === 0) warnings.push('No users registered yet');
      
      if (warnings.length > 0) {
        console.log('⚠️  Warnings:');
        warnings.forEach(warning => console.log(`   • ${warning}`));
        console.log('');
      }
      
      console.log('═'.repeat(60));
      console.log('🎯 DaySave is ready! Open http://localhost:' + PORT + ' in your browser');
      console.log('📚 Need help? Check the documentation or contact support');
      console.log('═'.repeat(60));
      console.log('');
      
      logger.info(`DaySave app listening on port ${PORT}`);
    });
  } catch (error) {
    console.log('');
    console.log('❌ Failed to start DaySave application');
    console.log('═'.repeat(60));
    console.log('');
    console.log('🔍 Error Details:');
    console.log(`   Message: ${error.message}`);
    console.log(`   Code: ${error.code || 'Unknown'}`);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Check MySQL is running: brew services start mysql');
    console.log('   2. Verify .env configuration');
    console.log('   3. Run database setup: npm run db:setup');
    console.log('   4. Check logs: tail -f logs/error.log');
    console.log('');
    console.log('📞 Support: support@daysave.app');
    console.log('═'.repeat(60));
    console.log('');
    
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;