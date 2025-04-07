// Test the registration endpoint
import axios from 'axios';

// Generate unique username and email to avoid collisions
const timestamp = new Date().getTime();
const uniqueUsername = `testuser_${timestamp}`;
const uniqueEmail = `test_${timestamp}@example.com`;

async function testRegister() {
  console.log('Starting test...');
  try {
    console.log(`Making request to register with unique username: ${uniqueUsername}`);
    const response = await axios.post('http://localhost:3001/auth/register', {
      username: uniqueUsername,
      email: uniqueEmail,
      password: 'password123',
      full_name: 'Test User'  // Using snake_case to match backend
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      console.error('Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
  }
  console.log('Test completed');
}

testRegister(); 