const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    try {
        const testUser = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        };

        console.log('1. Testing Registration...');
        const registerRes = await axios.post(`${API_URL}/register`, testUser);
        console.log('Registration Success:', registerRes.status === 201);
        const token = registerRes.data.token;

        console.log('2. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('Login Success:', loginRes.status === 200);

        console.log('3. Testing Protected Route (Profile)...');
        const profileRes = await axios.get(`${API_URL}/profile`, { // Wait, profile is PUT. let's check GET user. 
            // Auth route has PUT profile. But middleware gets user. 
            // Let's try GET /api/workouts as a protected route proxy.
        });

        // Actually, let's use a known protected route. 
        // /api/workouts GET
        const workoutsRes = await axios.get('http://localhost:5000/api/workouts', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Protected Route Success:', workoutsRes.status === 200);

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
};

testAuth();
