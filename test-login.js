const axios = require('axios');

async function testLogin() {
    console.log('🔍 Testing Login Authentication\n');
    
    try {
        // Test with the credentials from the screenshot
        console.log('1. Testing login with yash@gmail.com / password...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'yash@gmail.com',
            password: '12345678'  // The password we discovered earlier
        });
        
        console.log('✅ Login successful!');
        console.log('   User:', response.data.user.firstName, response.data.user.lastName);
        console.log('   Role:', response.data.user.role);
        console.log('   Token received:', response.data.token ? 'Yes' : 'No');
        
    } catch (error) {
        console.log('❌ Login failed:', error.response?.status, error.response?.data);
        
        // Try to get more details about the error
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        } else {
            console.log('   Error:', error.message);
        }
    }
}

testLogin();