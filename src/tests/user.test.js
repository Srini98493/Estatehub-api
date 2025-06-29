const request = require('supertest');
const baseURL = 'http://localhost:3000';

describe('User API Tests', () => {
    // Add beforeAll to verify server is running
    beforeAll(async () => {
        // Check if server is running
        try {
            await request(baseURL).get('/health');
        } catch (error) {
            throw new Error('API server must be running before tests are executed');
        }
    });

    const testUser = {
        name: "Test User",
        username: "testuser123",
        password: "Test@123",
        email: "test@example.com",
        contactNo: "1234567890",
        userType: "USER",
        createdBy: 1
    };

    // Test Registration
    describe('POST /v1/user/createUser', () => {
        test('Should register new user and send OTP', async () => {
            const res = await request(baseURL)
                .post('/v1/user/createUser')
                .send(testUser);

            console.log('Registration Response:', res.body);
            
            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                success: true,
                message: 'OTP has been sent to your email'
            });
        });
    });

    // Test OTP Verification
    describe('POST /v1/user/verify-email', () => {
        test('Should verify valid OTP', async () => {
            const verificationData = {
                email: testUser.email,
                otp: "123456"
            };

            const res = await request(baseURL)
                .post('/v1/user/verify-email')
                .send(verificationData);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: 'OTP verification successful'
            });
        });
    });

    // Health check test
    describe('GET /health', () => {
        test('Server is running', async () => {
            const res = await request(baseURL).get('/health');
            expect(res.status).toBe(200);
        });
    });
}); 