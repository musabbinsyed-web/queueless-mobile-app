const axios = require('axios');

async function testBooking() {
  try {
    console.log('1. Logging in...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test.user@example.com',
      password: 'password123'
    }).catch(async (e) => {
      // If login fails, try signup
      return await axios.post('http://localhost:5000/api/auth/signup', {
        fullName: 'Test User',
        email: 'test.user@example.com',
        password: 'password123'
      });
    });

    const token = loginRes.data.accessToken;
    console.log('Got token!');

    console.log('\n2. Fetching provider to get a service ID...');
    const providerRes = await axios.get('http://localhost:5000/api/providers/prov-hosp-pmc');
    const serviceId = providerRes.data.services[0].id;
    console.log(`Found service ID: ${serviceId} (${providerRes.data.services[0].name})`);

    console.log('\n3. Checking initial queue...');
    const queueBefore = await axios.get('http://localhost:5000/api/providers/prov-hosp-pmc/queue');
    console.log(queueBefore.data);

    console.log('\n4. Booking a token...');
    const bookingRes = await axios.post(
      'http://localhost:5000/api/bookings',
      { providerId: 'prov-hosp-pmc', serviceId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Booking created!');
    console.log(bookingRes.data.tokenConfirmation);

    console.log('\n5. Checking queue after booking...');
    const queueAfter = await axios.get('http://localhost:5000/api/providers/prov-hosp-pmc/queue');
    console.log(queueAfter.data);

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testBooking();
