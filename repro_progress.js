const API_URL = 'http://localhost:5000/api';

const runTest = async () => {
    try {
        console.log('1. Registering/Logging in User...');
        const user = {
            name: 'ProgressFailTester',
            email: `progressFail${Date.now()}@test.com`,
            password: 'password123'
        };

        const authRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (!authRes.ok) {
            const errorText = await authRes.text();
            throw new Error(`Auth failed: ${authRes.status} ${errorText}`);
        }

        const authData = await authRes.json();
        const token = authData.token;
        console.log('User registered. Token obtained.');

        console.log('2. Creating Progress Log with MISSING WEIGHT (simulating frontend bug)...');

        const formData = new FormData();
        // simulating: formData.append('weight', formData.weight); where formData.weight is undefined
        formData.append('weight', 'undefined');
        formData.append('measurements', JSON.stringify({
            chest: 0,
            waist: 0,
            hips: 0
        }));
        formData.append('notes', undefined);

        const createRes = await fetch(`${API_URL}/progress`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!createRes.ok) {
            const errorText = await createRes.text();
            console.log(`Expected Failure: ${createRes.status} ${errorText}`);
        } else {
            const createData = await createRes.json();
            console.log('UNEXPECTED SUCCESS:', createData);
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
};

runTest();
