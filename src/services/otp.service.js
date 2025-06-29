const client = require('../config/postgres');

const otpService = {
    generateOTP: () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    saveOTP: async (userId, otp) => {
        try {
            const expiryDate = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes from now
            
            const query = `
                INSERT INTO assets.t_user_otp (userid, otp, expiresdate)
                VALUES ($1, $2, $3)
                RETURNING otpid
            `;
            
            const result = await client.query(query, [userId, otp, expiryDate]);
            return result.rows[0];
        } catch (error) {
            console.error('Error saving OTP:', error);
            throw error;
        }
    }
};

module.exports = otpService; 