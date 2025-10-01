const mysql = require('mysql2/promise');

console.log('=== Node.js Database Connection Tests ===');

async function testAiCallerDatabase() {
    console.log('\n1. Testing ai-caller database:');
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Antu@2252',
            database: 'ai-caller'
        });
        
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM admin_users');
        console.log('✅ ai-caller database connected successfully! Admin users count:', rows[0].count);
        await connection.end();
    } catch (error) {
        console.log('❌ ai-caller database connection failed:', error.message);
    }
}

async function testOorjaWheelDatabase() {
    console.log('\n2. Testing oorja_wheel database:');
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Antu@2252',
            database: 'oorja_wheel'
        });
        
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log('✅ oorja_wheel database connected successfully! Users count:', rows[0].count);
        await connection.end();
    } catch (error) {
        console.log('❌ oorja_wheel database connection failed:', error.message);
    }
}

async function testCodecafeAdminDatabase() {
    console.log('\n3. Testing codecafe_admin database:');
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'codecafe_admin',
            password: 'RadheRadhe@1431',
            database: 'codecafe_admin'
        });
        
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log('✅ codecafe_admin database connected successfully! Users count:', rows[0].count);
        await connection.end();
    } catch (error) {
        console.log('❌ codecafe_admin database connection failed:', error.message);
    }
}

async function runAllTests() {
    await testAiCallerDatabase();
    await testOorjaWheelDatabase();
    await testCodecafeAdminDatabase();
    console.log('\n=== Test Complete ===');
}

runAllTests().catch(console.error);
