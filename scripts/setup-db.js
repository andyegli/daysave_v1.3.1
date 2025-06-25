// scripts/setup-db.js
// Database initialization script for DaySave

const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3303,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    charset: 'utf8mb4'
};

const dbName = process.env.DB_NAME || 'daysave';

async function setupDatabase() {
    let connection;
    
    try {
        console.log('🔌 Connecting to MySQL server...');
        console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
        
        connection = await mysql.createConnection(dbConfig);
        
        console.log('✅ Connected to MySQL server');
        console.log('📊 Setting up DaySave database...');
        
        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log(`✅ Database '${dbName}' created/verified`);
        
        // Close current connection and reconnect to specific database
        await connection.end();
        
        // Reconnect with the specific database
        console.log(`🔄 Reconnecting to database '${dbName}'...`);
        connection = await mysql.createConnection({
            ...dbConfig,
            database: dbName
        });
        console.log('✅ Connected to DaySave database');
        
        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id CHAR(36) NOT NULL PRIMARY KEY,
                username VARCHAR(50) UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255),
                country VARCHAR(10),
                device_fingerprint TEXT,
                subscription_status ENUM('trial', 'basic', 'pro', 'expired') DEFAULT 'trial',
                language VARCHAR(5) DEFAULT 'en',
                email_verified BOOLEAN DEFAULT FALSE,
                two_factor_secret VARCHAR(255),
                two_factor_enabled BOOLEAN DEFAULT FALSE,
                profile_image VARCHAR(500),
                oauth_provider VARCHAR(50),
                oauth_id VARCHAR(255),
                trial_expires_at DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_oauth (oauth_provider, oauth_id),
                INDEX idx_subscription (subscription_status)
            );
        `);
        console.log('✅ Users table created');

        // Create social_accounts table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS social_accounts (
                id CHAR(36) NOT NULL PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                platform ENUM('facebook', 'youtube', 'instagram', 'tiktok', 'wechat', 'messenger', 'telegram', 'snapchat', 'pinterest', 'twitter', 'whatsapp') NOT NULL,
                handle VARCHAR(100) NOT NULL,
                access_token TEXT,
                refresh_token TEXT,
                expires_at DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_platform (user_id, platform),
                UNIQUE KEY unique_user_platform_handle (user_id, platform, handle)
            );
        `);
        console.log('✅ Social accounts table created');

        // Create contacts table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS contacts (
                id CHAR(36) NOT NULL PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100),
                nickname VARCHAR(100),
                organization VARCHAR(200),
                job_title VARCHAR(200),
                phones JSON,
                emails JSON,
                addresses JSON,
                social_profiles JSON,
                instant_messages JSON,
                urls JSON,
                dates JSON,
                notes TEXT,
                profile_image VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_name (first_name, last_name),
                INDEX idx_organization (organization),
                FULLTEXT idx_search (first_name, last_name, nickname, organization, job_title, notes)
            );
        `);
        console.log('✅ Contacts table created');

        // Create contact_groups table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS contact_groups (
                id CHAR(36) NOT NULL PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                name VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                UNIQUE KEY unique_user_group (user_id, name)
            );
        `);
        console.log('✅ Contact groups table created');

        // Create contact_group_members table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS contact_group_members (
                id CHAR(36) NOT NULL PRIMARY KEY,
                contact_id CHAR(36) NOT NULL,
                group_id CHAR(36) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
                FOREIGN KEY (group_id) REFERENCES contact_groups(id) ON DELETE CASCADE,
                UNIQUE KEY unique_contact_group (contact_id, group_id)
            );
        `);
        console.log('✅ Contact group members table created');

        // Create relationships table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS relationships (
                id CHAR(36) NOT NULL PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                contact_id_1 CHAR(36) NOT NULL,
                contact_id_2 CHAR(36) NOT NULL,
                relationship_type VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (contact_id_1) REFERENCES contacts(id) ON DELETE CASCADE,
                FOREIGN KEY (contact_id_2) REFERENCES contacts(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_contact_1 (contact_id_1),
                INDEX idx_contact_2 (contact_id_2),
                INDEX idx_relationship (relationship_type)
            );
        `);
        console.log('✅ Relationships table created');

        // Create urls table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS urls (
                id CHAR(36) NOT NULL PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                social_account_id CHAR(36),
                url TEXT NOT NULL,
                title VARCHAR(500),
                description TEXT,
                thumbnail VARCHAR(500),
                metadata JSON,
                transcription TEXT,
                summary TEXT,
                sentiment VARCHAR(20),
                auto_tags JSON,
                user_tags JSON,
                user_comments TEXT,
                category VARCHAR(100),
                location VARCHAR(200),
                processed_at DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (social_account_id) REFERENCES social_accounts(id) ON DELETE SET NULL,
                INDEX idx_user_id (user_id),
                INDEX idx_social_account (social_account_id),
                INDEX idx_category (category),
                INDEX idx_created_at (created_at),
                FULLTEXT idx_content_search (title, description, transcription, summary, user_comments)
            );
        `);
        console.log('✅ URLs table created');

        // Create files table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS files (
                id CHAR(36) NOT NULL PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                filename VARCHAR(255) NOT NULL,
                original_filename VARCHAR(255) NOT NULL,
                file_path VARCHAR(500) NOT NULL,
                file_size INTEGER NOT NULL,
                mime_type VARCHAR(100) NOT NULL,
                metadata JSON,
                transcription TEXT,
                summary TEXT,
                sentiment VARCHAR(20),
                auto_tags JSON,
                user_tags JSON,
                user_comments TEXT,
                category VARCHAR(100),
                location VARCHAR(200),
                processed_at DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_filename (filename),
                INDEX idx_category (category),
                INDEX idx_created_at (created_at),
                FULLTEXT idx_content_search (original_filename, transcription, summary, user_comments)
            );
        `);
        console.log('✅ Files table created');

        // Create url_groups table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS url_groups (
                id CHAR(36) NOT NULL PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                name VARCHAR(50) NOT NULL,
                description TEXT,
                parent_group_id CHAR(36),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (parent_group_id) REFERENCES url_groups(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_parent (parent_group_id),
                UNIQUE KEY unique_user_group (user_id, name)
            );
        `);
        console.log('✅ URL groups table created');

        // Create share_logs table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS share_logs (
                id CHAR(36) NOT NULL PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                url_id CHAR(36),
                file_id CHAR(36),
                contact_id CHAR(36),
                group_id CHAR(36),
                share_method ENUM('email', 'sms', 'in_app') NOT NULL,
                language VARCHAR(5) DEFAULT 'en',
                message TEXT,
                status ENUM('pending', 'sent', 'delivered', 'failed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE,
                FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
                FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
                FOREIGN KEY (group_id) REFERENCES contact_groups(id) ON DELETE SET NULL,
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at),
                INDEX idx_status (status)
            );
        `);
        console.log('✅ Share logs table created');

        // Create login_attempts table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS login_attempts (
                id CHAR(36) NOT NULL PRIMARY KEY,
                user_id CHAR(36),
                email VARCHAR(255),
                ip_address VARCHAR(45),
                device_fingerprint TEXT,
                attempt_count INTEGER DEFAULT 1,
                last_attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                locked_until DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_email (email),
                INDEX idx_ip (ip_address),
                INDEX idx_locked_until (locked_until)
            );
        `);
        console.log('✅ Login attempts table created');

        // Create contact_submissions table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id CHAR(36) NOT NULL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                language VARCHAR(5) DEFAULT 'en',
                status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_status (status),
                INDEX idx_created_at (created_at)
            );
        `);
        console.log('✅ Contact submissions table created');

        // Create admin_settings table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS admin_settings (
                id CHAR(36) NOT NULL PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                setting_key VARCHAR(100) NOT NULL,
                setting_value JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                UNIQUE KEY unique_user_setting (user_id, setting_key)
            );
        `);
        console.log('✅ Admin settings table created');

        // Create sessions table for express-session
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS sessions (
                session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
                expires INT(11) UNSIGNED NOT NULL,
                data MEDIUMTEXT COLLATE utf8mb4_bin,
                PRIMARY KEY (session_id)
            );
        `);
        console.log('✅ Sessions table created');

        // Create default admin user for development
        const adminId = uuidv4();
        const adminPassword = "Admin123!";
        const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
        const trialExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

        try {
            await connection.execute(`
                INSERT INTO users (
                    id,
                    username,
                    email,
                    password_hash,
                    subscription_status,
                    email_verified,
                    trial_expires_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                adminId,
                'admin',
                'admin@daysave.app',
                adminPasswordHash,
                'pro',
                true,
                trialExpiresAt
            ]);
            console.log('✅ Default admin user created');
            console.log('📧 Admin Email: admin@daysave.app');
            console.log('🔑 Admin Password: Admin123!');
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.log('ℹ️  Default admin user already exists');
            } else {
                throw error;
            }
        }

        // Create development test users if DEV_MODE is enabled
        if (process.env.DEV_MODE === 'true') {
            const testUsers = [
                {
                    username: 'testuser1',
                    email: process.env.DEV_USER_EMAIL || 'user@example.com',
                    subscription: 'trial'
                },
                {
                    username: 'admin2',
                    email: process.env.DEV_ADMIN_EMAIL_2 || 'admin2@example.com',
                    subscription: 'pro'
                }
            ];

            for (const user of testUsers) {
                try {
                    const userId = uuidv4();
                    const passwordHash = await bcrypt.hash('password123!', 12);
                    
                    await connection.execute(`
                        INSERT INTO users (
                            id,
                            username,
                            email,
                            password_hash,
                            subscription_status,
                            email_verified,
                            trial_expires_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    `, [
                        userId,
                        user.username,
                        user.email,
                        passwordHash,
                        user.subscription,
                        true,
                        trialExpiresAt
                    ]);
                    console.log(`✅ Test user created: ${user.email}`);
                } catch (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        console.log(`ℹ️  Test user already exists: ${user.email}`);
                    } else {
                        throw error;
                    }
                }
            }
        }

        console.log('');
        console.log('🎉 Database setup completed successfully!');
        console.log('');
        console.log('📊 Database Information:');
        console.log(`   Database: ${dbName}`);
        console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`   Tables: 12 tables created`);
        console.log('');
        console.log('👤 Default Admin Account:');
        console.log('   Email: admin@daysave.app');
        console.log('   Password: admin123!');
        console.log('   Note: Change this password in production!');
        console.log('');
        console.log('🚀 You can now start your DaySave application:');
        console.log('   npm run dev');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('');
            console.log('💡 Access denied. Please check:');
            console.log('1. Database credentials in .env file');
            console.log('2. MySQL user permissions');
            console.log('3. Make sure MySQL server is running');
            console.log('');
            console.log('🔧 To fix database credentials:');
            console.log('   Edit .env file:');
            console.log('   DB_HOST=localhost');
            console.log('   DB_USER=root');
            console.log('   DB_PASSWORD=your_mysql_password');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('');
            console.log('💡 MySQL server is not running. Please start MySQL:');
            console.log('   macOS (Homebrew): brew services start mysql');
            console.log('   macOS (MAMP): Start MAMP application');
            console.log('   Ubuntu/Debian: sudo service mysql start');
            console.log('   Windows: net start mysql');
            console.log('   Docker: docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -d mysql:8.0');
        } else if (error.code === 'ENOTFOUND') {
            console.log('');
            console.log('💡 Cannot find MySQL host. Please check:');
            console.log('1. DB_HOST in .env file (usually "localhost")');
            console.log('2. MySQL server is installed and running');
        } else if (error.code === 'ER_UNSUPPORTED_PS') {
            console.log('');
            console.log('💡 MySQL prepared statement error. This has been fixed in the updated script.');
            console.log('Please run the script again.');
        } else {
            console.log('');
            console.log('💡 General troubleshooting:');
            console.log('1. Verify MySQL is installed and running');
            console.log('2. Check your .env database configuration');
            console.log('3. Ensure the MySQL user has CREATE DATABASE permissions');
            console.log('');
            console.log('🔍 Error details:');
            console.log(`   Code: ${error.code}`);
            console.log(`   Message: ${error.message}`);
        }
        
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the setup
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase };
