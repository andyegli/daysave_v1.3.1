// test-db-connection.js - Test database connection using your .env settings
require('dotenv').config();

const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
    console.log('🔍 Testing DaySave Database Connection');
    console.log('═══════════════════════════════════════');
    
    // Read configuration from environment
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        charset: 'utf8mb4'
    };
    
    const dbName = process.env.DB_NAME || 'daysave';
    
    console.log('📋 Database Configuration:');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Port: ${dbConfig.port}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Password: ${dbConfig.password ? '***set***' : '***empty***'}`);
    console.log(`   Database: ${dbName}`);
    console.log('');
    
    let connection;
    
    try {
        console.log('🔌 Step 1: Testing basic MySQL connection...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ MySQL server connection successful!');
        
        console.log('🔍 Step 2: Checking MySQL server info...');
        const [versionResult] = await connection.execute('SELECT VERSION() as version');
        console.log(`✅ MySQL Version: ${versionResult[0].version}`);
        
        console.log('📊 Step 3: Checking available databases...');
        const [databases] = await connection.execute('SHOW DATABASES');
        const dbList = databases.map(db => db.Database);
        console.log(`✅ Available databases: ${dbList.join(', ')}`);
        
        console.log(`🎯 Step 4: Checking if '${dbName}' database exists...`);
        if (dbList.includes(dbName)) {
            console.log(`✅ Database '${dbName}' exists!`);
            
            // Connect to specific database
            await connection.end();
            connection = await mysql.createConnection({
                ...dbConfig,
                database: dbName
            });
            
            console.log('📋 Step 5: Checking tables in database...');
            const [tables] = await connection.execute('SHOW TABLES');
            if (tables.length > 0) {
                console.log(`✅ Found ${tables.length} tables:`);
                tables.forEach(table => {
                    const tableName = Object.values(table)[0];
                    console.log(`   - ${tableName}`);
                });
            } else {
                console.log('⚠️  Database exists but has no tables');
                console.log('💡 Run: npm run db:setup');
            }
        } else {
            console.log(`❌ Database '${dbName}' does not exist`);
            console.log('💡 Run: npm run db:setup (this will create the database)');
        }
        
        console.log('');
        console.log('🎉 Connection test completed successfully!');
        console.log('✅ Your DaySave app should be able to connect to the database');
        
    } catch (error) {
        console.log('');
        console.log('❌ Connection test failed:');
        console.log(`   Error: ${error.message}`);
        console.log(`   Code: ${error.code}`);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('');
            console.log('💡 MySQL server is not running or not accessible on this host/port');
            console.log('🔧 Solutions:');
            console.log('   1. Start MySQL server:');
            console.log(`      - macOS: brew services start mysql`);
            console.log(`      - Ubuntu: sudo service mysql start`);
            console.log(`      - Docker: docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p ${dbConfig.port}:3306 -d mysql:8.0`);
            console.log('');
            console.log('   2. Check if MySQL is listening on the correct port:');
            console.log(`      lsof -i :${dbConfig.port}`);
            console.log('');
            console.log('   3. Verify your .env configuration');
            
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('');
            console.log('💡 Access denied - incorrect username/password');
            console.log('🔧 Solutions:');
            console.log('   1. Check DB_USER and DB_PASSWORD in .env file');
            console.log('   2. Test manual connection:');
            console.log(`      mysql -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} -p`);
            console.log('   3. Reset MySQL root password if needed');
            
        } else if (error.code === 'ENOTFOUND') {
            console.log('');
            console.log('💡 Host not found - check DB_HOST in .env file');
            console.log(`   Current host: ${dbConfig.host}`);
            
        } else {
            console.log('');
            console.log('💡 Unexpected error - check your MySQL installation and configuration');
        }
        
        process.exit(1);
        
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Also export for use in other files
module.exports = { testDatabaseConnection };

// Run test if this file is executed directly
if (require.main === module) {
    testDatabaseConnection();
}