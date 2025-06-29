const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  emailService,
  tokenService,
} = require("../services");
const { verifyToken } = require("../utils/auth");
const ApiError = require("../utils/ApiError");
const { generateOtp } = require("../utils/Utils");
const { sendEmail } = require("../services/emailService");
const {
  createForgotPasswordEmailTemplate,
} = require("../templates/ForgotPasswordEmail");
const otpService = require("../services/otp.service");
const config = require("../config/config");



const register = catchAsync(async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(httpStatus.CREATED).send({ ...user });
  } catch (error) {
    console.error("Error in register controller:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
});

const socialLogin = catchAsync(async (req, res) => {
  const user = await userService.createSocialUser(req.body);
  res.status(httpStatus.CREATED).send({ ...user });
});

const login = catchAsync(async (req, res) => {
  // Validate required fields
  if (!req.body.email || !req.body.password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Email and password are required"
    );
  }

  try {
    const user = await authService.loginUserWithEmailAndPassword(
      req.body.email,
      req.body.password
    );
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
});

const forgotPassword = catchAsync(async (req, res) => {
  // Generate a reset password token
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );

  // Get the userId from the database
  const userData = await userService.getUserByEmail(req.body.email);
  const userId = userData.userid;

  // Generate a 6-digit OTP
  const otp = otpService.generateOTP();
  // Save the OTP to the database
  await otpService.saveOTP(userId, otp);

  // Send both the reset password token and OTP via email
  await sendEmail({
    to: req.body.email,
    subject: "Reset Password",
    html: createForgotPasswordEmailTemplate(resetPasswordToken, otp, config),
  });

  res.send({ success: true });
});

const resetPassword = catchAsync(async (req, res) => {
  const { token, otp, newPassword } = req.body; // Get token, otp, and newPassword from request body
  const { userid } = await verifyToken(token); // Decode the token to get userId

  console.log("User ID", userid, "OTP", otp);

  // Verify the OTP with userId
  const isOtpValid = await userService.verifyOtpWithUserId(userid, otp);
  if (!isOtpValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
  }

  // Update the user's password
  req.body.id = userid; // Set userId in request body
  req.body.password = newPassword; // Set new password
  const userData = await userService.updateUser(req); // Call updateUser function

  console.log("User Data", userData);

  res.send({ success: true, message: "Password updated successfully" });
});

const verifyEmail = catchAsync(async (req, res) => {
  const result = await userService.verifyEmail(req.body.email, req.body.otp);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Email verification successful" });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  socialLogin,
};
