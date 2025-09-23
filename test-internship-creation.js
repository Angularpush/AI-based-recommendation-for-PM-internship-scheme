// Test the internship visibility issue with simple HTTP requests
const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
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

async function testInternshipVisibility() {
  console.log('🔍 Testing Internship Visibility Issue\n');
  
  try {
    // Test 1: Check public internships API
    console.log('1. Testing public internships endpoint...');
    const publicResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/internships',
      method: 'GET'
    });
    
    if (publicResult.status === 200) {
      console.log(`   ✅ Public API works: ${publicResult.data.internships.length} internships found`);
      console.log(`   📊 Total internships in system: ${publicResult.data.total}`);
      
      // Show some recent internships
      const recentInternships = publicResult.data.internships.filter(i => i._id.length > 10);
      console.log(`   🆕 Recent internships: ${recentInternships.length}`);
      recentInternships.forEach(internship => {
        console.log(`      - ${internship.title}`);
        console.log(`        ID: ${internship._id}`);
        console.log(`        Organization: ${internship.organization || internship.createdBy || 'NOT SET'}`);
        console.log(`        Status: ${internship.status}`);
      });
    } else {
      console.log(`   ❌ Public API failed: ${publicResult.status}`);
      console.log(`      Response: ${JSON.stringify(publicResult.data)}`);
    }
    
    // Test 2: Try authentication with different passwords
    console.log('\n2. Testing authentication...');
    const passwords = ['password123', 'Password123!', '123456', 'password', 'yash123'];
    let loginData = null;
    
    for (const password of passwords) {
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
        password: password
      }));
      
      if (loginResult.status === 200) {
        console.log(`   ✅ Login successful with password: ${password}`);
        console.log(`   👤 User ID: ${loginResult.data.user._id}`);
        console.log(`   👤 Role: ${loginResult.data.user.role}`);
        loginData = loginResult.data;
        break;
      } else {
        console.log(`   ❌ Failed with password: ${password}`);
      }
    }
    
    if (loginData) {
      // Test 3: Check my-internships with auth
      console.log('\n3. Testing my-internships with authentication...');
      const myInternshipsResult = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: '/api/internships/my-internships',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (myInternshipsResult.status === 200) {
        console.log(`   ✅ My-internships API works: ${myInternshipsResult.data.internships.length} found`);
        if (myInternshipsResult.data.internships.length === 0) {
          console.log(`   ⚠️  NO INTERNSHIPS found for organization ${loginData.user._id}`);
          console.log(`   🔍 This explains why the dashboard is empty!`);
        } else {
          myInternshipsResult.data.internships.forEach(internship => {
            console.log(`      - ${internship.title} (${internship._id})`);
          });
        }
      } else {
        console.log(`   ❌ My-internships failed: ${myInternshipsResult.status}`);
        console.log(`      Response: ${JSON.stringify(myInternshipsResult.data)}`);
      }
    } else {
      console.log('   ❌ Could not authenticate with any password');
    }
    
    console.log('\n📝 Summary of Issues Found:');
    console.log('   • Check if internships have correct organization field');
    console.log('   • Verify authentication is working');
    console.log('   • Ensure my-internships route filters correctly');
    console.log('   • Frontend might need to refresh or restart');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testInternshipVisibility();