const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { userModel } = require('../db/models');

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        // console.log('Passport JWT Strategy - Payload:', payload);
        // console.log('Passport JWT Strategy - Looking for user with ID:', payload.userid);
        
        const user = await userModel.getById(payload.userid);
        // console.log('Passport JWT Strategy - User found:', JSON.stringify(user, null, 2));

        if (!user) {
            // console.log('Passport JWT Strategy - No user found');
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        console.error('Passport JWT Strategy - Error:', error);
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
};