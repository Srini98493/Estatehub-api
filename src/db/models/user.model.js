const client = require("../../config/postgres"); // Your database connection

// Add safeStringify helper function at the top of the file
const safeStringify = (obj) => {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    },
    2
  );
};

const userModel = {
  insert: async (userData) => {
    console.log("Inserting user data:", JSON.stringify(userData, null, 2));

    const params = [
      userData.name || null,
      userData.username || null,
      userData.password || null,
      userData.areaCode || null,
      userData.contactNo || null,
      userData.email || null,
      userData.socialEmail || null,
      userData.gender || null,
      userData.dob || null,
      userData.location || null,
      userData.city || null,
      userData.state || null,
      userData.country || null,
      userData.profileImagePath || null,
      userData.isNotificationEnabled !== undefined
        ? userData.isNotificationEnabled
        : null,
      userData.userType || null,
      false,
      userData.isLogin !== undefined ? userData.isLogin : false,
      userData.createdBy || null,
      userData.updatedBy || userData.createdBy || null,
    ];

    console.log("Prepared parameters:", JSON.stringify(params, null, 2));

    try {
      const result = await client.query(
        "SELECT assets.t_user_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)",
        params
      );
      console.log("Query result:", result);
      return result;
    } catch (error) {
      console.error("Error inserting user:", error);
      throw error;
    }
  },

  update: async (userId, userData) => {
    console.log("User Data", userData);
    const result = await client.query(
      "SELECT * FROM assets.t_user_update($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)",
      [
        userId,
        userData.fullname,
        userData.username,
        userData.password,
        userData.areacode,
        userData.contactno,
        userData.useremail,
        userData.socialemail,
        userData.gender,
        userData.dob,
        userData.location,
        userData.city,
        userData.state,
        userData.country,
        userData.profileimagepath,
        userData.isnotificationenabled,
        userData.usertype,
        userData.isactive,
        userData.islogin,
        userId,
      ]
    );
    return result;
  },

  getById: async (userId) => {
    try {
      // console.log('Getting user by ID:', userId);
      const result = await client.query(
        "SELECT assets.t_user_get_by_id($1, $2, $3, $4, $5, $6)",
        [userId, null, null, null, null, null]
      );
      // console.log('Raw DB result:', JSON.stringify(result.rows, null, 2));
      return result.rows[0];
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  },

  getAll: async () => {
    const result = await client.query(
      "SELECT assets.t_user_get_by_id($1, $2, $3, $4, $5, $6)",
      [null, null, null, null, null, null]
    );
    return result.rows;
  },

  getByEmail: async (email) => {
    console.log("Fetching user by email:", email);
    try {
      const result = await client.query(
        "SELECT * FROM assets.t_user_get_by_id($1, $2, $3, $4, $5, $6)",
        [null, null, null, null, email, null]
      );
      // console.log('Query result:', safeStringify(result?.rows[0]?.t_user_get_by_id[0]));

      if (!result || !result.rows || result.rows.length === 0) {
        // Return null or an appropriate response indicating no user found
        return null; // or you can throw an error if you prefer
      }

      // Return the first user found
      return result.rows[0]?.t_user_get_by_id?.[0] || null; //
    } catch (error) {
      console.error("Error fetching user by email:", error.message);
      throw error;
    }
  },

  deleteUser: async (userid) => {
    try {
      const result = await client.query(
        "SELECT assets.t_delete_user_data($1)",
        [userid]
      );

      if (!result || !result.rows || result.rows.length === 0) {
        return null;
      }

      return result.rows[0]?.t_delete_user_data;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userModel;
