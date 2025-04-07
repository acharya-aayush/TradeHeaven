import axios from 'axios';

async function testLogin() {
  try {
    console.log('Testing login with admin credentials...');
    const response = await axios.post('http://localhost:3001/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('Login failed!');
    if (error.response) {
      console.error('Response error:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      console.error('No response received. Server might be down.');
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

testLogin(); 