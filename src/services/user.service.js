const httpStatus = require("http-status");
const { userModel } = require("../db/models");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const otpService = require("./otp.service");
const { sendEmail } = require("./emailService");
const createOTPEmailTemplate = require("../templates/otpEmail");
const client = require("../config/postgres");
const { log } = require("winston");
const logger = require("../config/logger");

const userService = {
  createUser: async (userBody) => {
    try {
      // Check if the email already exists in the database
      const existingUserResult = await userModel.getByEmail(userBody.email);

      console.log("existingUserResult", existingUserResult);
      const existingUser = existingUserResult && existingUserResult;

      if (existingUser) {
        // If the user exists but is not active, resend the OTP
        if (!existingUser.isactive) {
          // Generate a new OTP
          const otp = otpService.generateOTP();
          await otpService.saveOTP(existingUser.userid, otp);

          console.log("userBody", userBody);

          // Send the OTP to the user's email
          await sendEmail({
            to: userBody.email,
            subject: "Verify Your Email - Estate Hub",
            html: createOTPEmailTemplate(otp),
          });

          return {
            success: true,
            message:
              "Account already exists but not verified. A new verification code has been sent to your email.",
          };
        }

        // If the user exists and is active, throw an error
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
      }

      // If the user doesn't exist, proceed with user creation
      if (userBody.password) {
        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userBody.password, salt);
        userBody.password = hashedPassword;
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");
      }

      // Create the user in the database
      const userResult = await userModel.insert(userBody);
      const userData = userResult.rows[0].t_user_insert;
      console.log("userData", userData, "userResult", userResult);

      if (userData?.status_code === -1) {
        // Throw an error with the message from userData
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          userData?.message || "User creation failed"
        );
      }

      // Generate and save OTP for the new user
      const otp = otpService.generateOTP();
      await otpService.saveOTP(userData?.user_id, otp);

      // Send OTP email to the new user
      await sendEmail({
        to: userBody.email,
        subject: "Verify Your Email - Estate Hub",
        html: createOTPEmailTemplate(otp),
      });

      return {
        success: true,
        message:
          "Account created successfully. Please check your email for verification code.",
      };
    } catch (error) {
      // Log the error and rethrow it
      logger.error("User creation error:", error);
      throw error;
    }
  },

  createSocialUser: async (userBody) => {
    try {
      // Check if the email already exists in the database
      const existingUserResult = await userModel.getByEmail(userBody.email);

      if (existingUserResult) {
        // Remove password from user data before returning
        const { password: _, ...userDataWithoutPassword } = existingUserResult;

        return userDataWithoutPassword;
      }

      // If the user doesn't exist, proceed with user creation
      const userResult = await userModel.insert(userBody);
      const userData = userResult.rows[0].t_user_insert;
      console.log("userData", userData, "userResult", userResult);

      const { password: _, ...userDataWithoutPassword } = userData;

      return userDataWithoutPassword;
    } catch (error) {
      // Log the error and rethrow it
      logger.error("User creation error:", error);
      throw error;
    }
  },

  getUsers: async (req) => {
    // Fetch all users from the database
    const users = await userModel.getAll();
    return users;
  },

  getUserById: async (userId) => {
    // Fetch the user from the database using their ID
    const user = await userModel.getById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
  },

  updateUser: async (req) => {
    const { id, password } = req.body; // Destructure userId and password from req.body

    // Log the user ID and password for debugging
    console.log("User ID", id, "Password", password);

    // Get existing user details
    const existingUser = await userModel.getById(id); // Call getUserById to retrieve user details
    const userData = existingUser?.t_user_get_by_id?.[0];

    // Log existing user details for debugging
    console.log("Existing user", existingUser?.t_user_get_by_id?.[0]);

    // Prepare the update object
    const userUpdateData = {
      ...userData, // Include existing user details
      password: undefined, // Exclude the current password from the update
      updatedBy: id, // Assuming you have the logged-in user's ID in req.user
    };

    // Hash the new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      userUpdateData.password = await bcrypt.hash(password, salt); // Hash the new password
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");
    }

    // Update the user in the database
    const user = await userModel.update(id, userUpdateData); // Pass userId and update data to userModel

    return user;
  },

  getUserByEmail: async (email) => {
    // Fetch the user from the database using their email
    const user = await userModel.getByEmail(email);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
  },

  verifyEmail: async (email, otp) => {
    try {
      // Fetch the user by email
      const userResult = await userModel.getByEmail(email);
      console.log("userResult", userResult);
      if (!userResult) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      }

      const userId = userResult.userid;

      // Log the user ID for debugging
      console.log("User ID", userId);

      // Query to check the OTP validity
      const query = `
        SELECT * FROM assets.t_user_otp 
        WHERE userid = $1 AND otp = $2 AND isverified = FALSE 
        AND expiresdate > NOW()
        ORDER BY otpid DESC LIMIT 1
      `;

      const otpResult = await client.query(query, [userId, otp]);

      // Log the OTP result for debugging
      console.log("OTP result", otpResult);

      if (!otpResult.rows[0]) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
      }

      // Update user's email verification status
      await client.query(
        "UPDATE assets.t_user SET isactive = TRUE WHERE userid = $1",
        [userId]
      );

      return true; // Just return true, no data
    } catch (error) {
      // Log the error and rethrow it
      console.error("Email verification error:", error);
      throw error;
    }
  },

  verifyOtpWithUserId: async (userId, otp) => {
    try {
      // Call the existing PostgreSQL function to get the OTP details
      const query = `
        SELECT * FROM assets.t_user_otp_get_by_id($1, $2)
      `;

      const otpResult = await client.query(query, [userId, otp]);

      // Log the OTP result for debugging
      console.log(
        "OTP result",
        otpResult.rows[0],
        "User ID",
        userId,
        "OTP",
        otp
      );

      if (!otpResult.rows[0]?.t_user_otp_get_by_id) {
        return false; // OTP is invalid or expired
      }

      // Mark OTP as verified
      await client.query("SELECT * FROM assets.t_user_otp_update($1, $2, $3)", [
        userId,
        otp,
        false,
      ]);

      return true; // OTP verification successful
    } catch (error) {
      // Log the error and rethrow it
      console.error("OTP verification error:", error);
      throw error;
    }
  },

  deleteUserData: async (userId) => {
    try {
      const result = await userModel.deleteUser(userId);
      return {
        success: true,
        message: 'User data deleted successfully',
        data: result
      };
    } catch (error) {
      throw new Error(`Error deleting user data: ${error.message}`);
    }
  },
};

module.exports = userService;
