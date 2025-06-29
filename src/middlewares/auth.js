const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
    // console.log('Auth Middleware - verifyCallback:', {
    //     error: err,
    //     user: JSON.stringify(user, null, 2),
    //     info: info
    // });

    if (err || info || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
    // console.log('Auth Middleware - User set in request:', JSON.stringify(req.user, null, 2));
    resolve();
};

const auth = () => async (req, res, next) => {
    // console.log('Auth Middleware - Starting authentication');
    // console.log('Auth Headers:', req.headers.authorization);
    // console.log('Auth Headers All:', req);
    
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
    })
        .then(() => {
            // console.log('Auth Middleware - Authentication successful');
            next();
        })
        .catch((err) => {
            // console.log('Auth Middleware - Authentication failed:', err);
            next(err);
        });
};

module.exports = auth;