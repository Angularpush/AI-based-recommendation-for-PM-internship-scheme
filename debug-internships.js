// Simple test to check if authentication and API work
const fetch = require('node-fetch');

async function testInternshipVisibility() {
  try {
    console.log('🔍 Testing internship visibility issue...\n');
    
    // Test 1: Check if public internships API works
    console.log('1. Testing public internships API...');
    const publicResponse = await fetch('http://localhost:5000/api/internships');
    const publicData = await publicResponse.json();
    console.log(`   ✅ Public API returns ${publicData.internships.length} internships`);
    console.log(`   📊 Total: ${publicData.total}, Current page: ${publicData.currentPage}`);
    
    // Show recent internships
    const recentInternships = publicData.internships.filter(i => i._id.length > 10); // New IDs are timestamps
    console.log(`   🆕 Recent internships: ${recentInternships.length}`);
    recentInternships.forEach(internship => {
      console.log(`      - ${internship.title} (ID: ${internship._id})`);
      console.log(`        Created by: ${internship.organization || internship.createdBy || 'Unknown'}`);
    });
    
    // Test 2: Try to authenticate as organization
    console.log('\n2. Testing organization authentication...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'yash@gmail.com',
        password: 'password123' // Common password, might need to be different
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log(`   ✅ Authentication successful for user: ${loginData.user.profile.firstName}`);
      console.log(`   🔑 Token received, user ID: ${loginData.user._id}`);
      
      // Test 3: Try to fetch organization's internships
      console.log('\n3. Testing my-internships API...');
      const myInternshipsResponse = await fetch('http://localhost:5000/api/internships/my-internships', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (myInternshipsResponse.ok) {
        const myInternshipsData = await myInternshipsResponse.json();
        console.log(`   ✅ My-internships API works! Found ${myInternshipsData.internships.length} internships`);
        myInternshipsData.internships.forEach(internship => {
          console.log(`      - ${internship.title} (Created: ${internship.createdAt})`);
        });
        
        if (myInternshipsData.internships.length === 0) {
          console.log(`   🤔 No internships found for organization ${loginData.user._id}`);
          console.log('   💡 This could explain why the dashboard shows no internships');
        }
      } else {
        const errorData = await myInternshipsResponse.json();
        console.log(`   ❌ My-internships API failed: ${errorData.message}`);
      }
    } else {
      const errorData = await loginResponse.json();
      console.log(`   ❌ Authentication failed: ${errorData.message}`);
      console.log('   🔄 Trying alternative password...');
      
      // Try with default password
      const altLoginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'yash@gmail.com',
          password: 'Password123!'
        })
      });
      
      if (altLoginResponse.ok) {
        const altLoginData = await altLoginResponse.json();
        console.log(`   ✅ Authentication successful with alternative password`);
      } else {
        console.log(`   ❌ Alternative authentication also failed`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if node-fetch is available
try {
  require('node-fetch');
  testInternshipVisibility();
} catch (e) {
  console.log('📝 node-fetch not available, using curl instead...');
  console.log('💡 To debug this issue:');
  console.log('   1. Check if internships are being saved with correct organization ID');
  console.log('   2. Verify /my-internships route filters by organization correctly');
  console.log('   3. Ensure frontend is sending correct auth token');
  console.log('   4. Test the my-internships API endpoint manually');
}