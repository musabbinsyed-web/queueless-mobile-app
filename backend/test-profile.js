const axios = require('axios');

async function testProfileAndBookings() {
  try {
    console.log('1. Logging in...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test.user@example.com',
      password: 'password123'
    });
    const token = loginRes.data.accessToken;
    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
    console.log('Got token!');

    console.log('\n2. Fetching User Profile Stats...');
    const profileRes = await axios.get('http://localhost:5000/api/profile', axiosConfig);
    console.log('Profile Stats:', profileRes.data.stats);

    console.log('\n3. Fetching User Bookings...');
    const bookingsRes = await axios.get('http://localhost:5000/api/bookings', axiosConfig);
    console.log(`Found ${bookingsRes.data.length} bookings.`);
    if (bookingsRes.data.length > 0) {
      console.log('Most recent booking:');
      const b = bookingsRes.data[0];
      console.log(`- Service: ${b.serviceName} at ${b.providerName}`);
      console.log(`- Token: ${b.tokenNumber} (Status: ${b.status})`);
      console.log(`- Reference: ${b.referenceCode}`);
    } else {
      console.log('No bookings found.');
    }

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testProfileAndBookings();
