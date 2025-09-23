// Simple test to check authentication and API with default accounts
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

async function testWithDefaultAccounts() {
  console.log('🔍 Testing with default organization accounts\n');
  
  try {
    // Test with default organization accounts (they might have simple passwords)
    const testAccounts = [
      { email: 'hr@techcorp.com', passwords: ['password', 'techcorp123', 'password123'] },
      { email: 'careers@innovationlabs.com', passwords: ['password', 'innovation123', 'password123'] },
      { email: 'jobs@digitaldynamics.com', passwords: ['password', 'digital123', 'password123'] }
    ];
    
    for (const account of testAccounts) {
      console.log(`Testing account: ${account.email}`);
      
      for (const password of account.passwords) {
        const loginResult = await makeRequest({
          hostname: 'localhost',
          port: 5000,
          path: '/api/auth/login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }, JSON.stringify({
          email: account.email,
          password: password
        }));
        
        if (loginResult.status === 200) {
          console.log(`   ✅ Login successful with ${account.email} / ${password}`);
          console.log(`   👤 User ID: ${loginResult.data.user._id}`);
          console.log(`   👤 Role: ${loginResult.data.user.role}`);
          
          // Test my-internships
          const myInternshipsResult = await makeRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/internships/my-internships',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${loginResult.data.token}`
            }
          });
          
          if (myInternshipsResult.status === 200) {
            console.log(`   📊 My-internships: ${myInternshipsResult.data.internships.length} found`);
            myInternshipsResult.data.internships.forEach(internship => {
              console.log(`      - ${internship.title}`);
            });
          } else {
            console.log(`   ❌ My-internships failed: ${myInternshipsResult.status}`);
          }
          
          return; // Stop after first successful login
        }
      }
    }
    
    console.log('❌ No default accounts worked, checking if our fixed data helps...');
    
    // Test the public API again to see if organization fields are now present
    console.log('\n🔍 Testing updated internships data...');
    const publicResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/internships',
      method: 'GET'
    });
    
    if (publicResult.status === 200) {
      const recentInternships = publicResult.data.internships.filter(i => i._id.length > 10);
      console.log(`   🆕 Recent internships: ${recentInternships.length}`);
      recentInternships.forEach(internship => {
        console.log(`      - ${internship.title}`);
        console.log(`        Organization: ${internship.organization || internship.createdBy || 'STILL NOT SET'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWithDefaultAccounts();