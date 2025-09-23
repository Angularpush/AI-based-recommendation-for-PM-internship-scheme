const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing internship API...');
    
    // Test basic API health
    const healthResponse = await axios.get('http://localhost:3000/api/test');
    console.log('Health check:', healthResponse.data);
    
    // Test internships endpoint
    const internshipsResponse = await axios.get('http://localhost:3000/api/internships');
    console.log('Internships endpoint response:');
    console.log('- Total internships:', internshipsResponse.data.total);
    console.log('- Internships returned:', internshipsResponse.data.internships.length);
    console.log('- First few internships:');
    internshipsResponse.data.internships.slice(0, 3).forEach((internship, index) => {
      console.log(`  ${index + 1}. ${internship.title} (${internship._id})`);
    });
    
    // Test specific user's internships (this will need a token, but let's see the error)
    try {
      const myInternshipsResponse = await axios.get('http://localhost:3000/api/internships/my-internships');
      console.log('My internships:', myInternshipsResponse.data);
    } catch (error) {
      console.log('My internships error (expected without auth):', error.response?.data?.message || error.message);
    }
    
  } catch (error) {
    console.error('API test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();