// Test the complete flow with successful authentication
const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testCompleteFlow() {
  console.log('🔍 Testing Complete Authentication and API Flow\n');
  
  try {
    // Step 1: Login
    console.log('1. Authenticating...');
    const loginResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify({
      email: 'yash@gmail.com',
      password: '12345678'
    }));
    
    if (loginResult.status !== 200) {
      console.log('❌ Authentication failed:', loginResult.data);
      return;
    }
    
    console.log('   ✅ Authentication successful');
    console.log('   📊 User data:', JSON.stringify(loginResult.data.user, null, 2));
    console.log('   🔑 Token length:', loginResult.data.token.length);
    
    const user = loginResult.data.user;
    const token = loginResult.data.token;
    
    // Step 2: Test different API endpoints
    console.log('\n2. Testing API endpoints...');
    
    // Test 2a: Try the problematic my-internships endpoint
    console.log('\n   2a. Testing /api/internships/my-internships...');
    const myInternshipsResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/internships/my-internships',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`      Status: ${myInternshipsResult.status}`);
    console.log(`      Response: ${JSON.stringify(myInternshipsResult.data)}`);
    
    // Test 2b: Test public internships to verify our fixes
    console.log('\n   2b. Testing public internships...');
    const publicResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/internships',
      method: 'GET'
    });
    
    if (publicResult.status === 200) {
      console.log(`      ✅ Public internships: ${publicResult.data.internships.length} found`);
      
      // Find internships that should belong to this user
      const userInternships = publicResult.data.internships.filter(internship => 
        internship.organization === user._id || 
        internship.createdBy === user._id ||
        internship.organization === user.id ||
        internship.createdBy === user.id
      );
      
      console.log(`      🎯 Internships for user ${user._id || user.id}: ${userInternships.length}`);
      userInternships.forEach(internship => {
        console.log(`         - ${internship.title} (ID: ${internship._id})`);
        console.log(`           Organization: ${internship.organization}`);
        console.log(`           CreatedBy: ${internship.createdBy}`);
      });
      
      if (userInternships.length > 0) {
        console.log('\n   🎯 SOLUTION IDENTIFIED:');
        console.log('      • Internships exist and are properly associated');
        console.log('      • Authentication works');
        console.log('      • Issue is with the /my-internships route');
        console.log('      • Need to fix the route ordering or implementation');
      }
    }
    
    // Test 2c: Try alternative endpoints
    console.log('\n   2c. Testing alternative approaches...');
    
    // Try with query parameter
    const queryResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/internships?organization=' + (user._id || user.id),
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`      Query approach status: ${queryResult.status}`);
    if (queryResult.status === 200) {
      console.log(`      Query results: ${queryResult.data.internships.length} internships`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompleteFlow();