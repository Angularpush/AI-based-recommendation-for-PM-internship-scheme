const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testRoutes() {
    console.log('🔍 Testing API Routes\n');

    try {
        // Test 1: Health check
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:5000/health');
        console.log('✅ Health check passed:', healthResponse.data);

        // Test 2: Login
        console.log('\n2. Testing login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'yash@gmail.com',
            password: '12345678'
        });
        console.log('✅ Login successful');
        const token = loginResponse.data.token;
        const userRole = loginResponse.data.user.role;
        console.log('   User role:', userRole);

        // Test 3: Check my-internships route
        console.log('\n3. Testing /my-internships route...');
        try {
            const myInternshipsResponse = await axios.get(`${BASE_URL}/internships/my-internships`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ My internships route working:', myInternshipsResponse.data);
        } catch (error) {
            console.log('❌ My internships route failed:', error.response?.status, error.response?.data);
        }

        // Test 4: Check all internships (public route)
        console.log('\n4. Testing /internships route...');
        const allInternshipsResponse = await axios.get(`${BASE_URL}/internships`);
        console.log('✅ All internships:', allInternshipsResponse.data.length, 'internships found');

        // Test 5: Try to create an internship
        console.log('\n5. Testing internship creation...');
        try {
            const createResponse = await axios.post(`${BASE_URL}/internships`, {
                title: 'Test Internship',
                description: 'Test Description',
                requirements: ['Test Skill'],
                duration: '3 months',
                stipend: 15000,
                location: 'Test City'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Internship creation successful:', createResponse.data);
        } catch (error) {
            console.log('❌ Internship creation failed:', error.response?.status, error.response?.data);
        }

    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
}

testRoutes();