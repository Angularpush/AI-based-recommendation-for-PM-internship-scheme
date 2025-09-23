const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testOrganizationAuth() {
  console.log('🔍 Testing Organization Authentication and API Access\n');

  try {
    // 1. Login as organization user
    console.log('1. Authenticating as organization user...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'yash@gmail.com',
      password: '12345678'
    });

    console.log('✅ Login successful!');
    console.log('User data:', JSON.stringify(loginResponse.data.user, null, 2));
    console.log('Token exists:', !!loginResponse.data.token);

    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n2. Testing /my-internships endpoint...');
    
    try {
      const myInternshipsResponse = await axios.get(`${API_BASE_URL}/internships/my-internships`, { headers });
      console.log('✅ /my-internships successful!');
      console.log('Response:', JSON.stringify(myInternshipsResponse.data, null, 2));
    } catch (error) {
      console.log('❌ /my-internships failed:', error.response?.status, error.response?.statusText);
      console.log('Error details:', error.response?.data);
    }

    console.log('\n3. Testing /applications/organization endpoint...');
    
    try {
      const orgAppsResponse = await axios.get(`${API_BASE_URL}/applications/organization`, { headers });
      console.log('✅ /applications/organization successful!');
      console.log('Response:', JSON.stringify(orgAppsResponse.data, null, 2));
    } catch (error) {
      console.log('❌ /applications/organization failed:', error.response?.status, error.response?.statusText);
      console.log('Error details:', error.response?.data);
    }

    console.log('\n4. Testing internship creation...');
    
    const testInternship = {
      title: "Test Data Science Internship",
      description: "A test internship for debugging",
      sector: "technology",
      location: {
        city: "Mumbai",
        state: "Maharashtra"
      },
      requirements: {
        educationLevel: "bachelor",
        skills: ["Python", "Data Analysis"]
      },
      stipend: {
        amount: 25000,
        currency: "INR"
      },
      duration: "3-months",
      positions: {
        total: 5,
        available: 5
      },
      applicationDeadline: "2025-12-31T23:59:59.000Z",
      startDate: "2026-01-15T00:00:00.000Z"
    };

    try {
      const createResponse = await axios.post(`${API_BASE_URL}/internships`, testInternship, { headers });
      console.log('✅ Internship creation successful!');
      console.log('Created internship:', JSON.stringify(createResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Internship creation failed:', error.response?.status, error.response?.statusText);
      console.log('Error details:', error.response?.data);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testOrganizationAuth();