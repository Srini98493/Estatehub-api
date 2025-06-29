const { log } = require("winston");
const client = require("../../config/postgres");

const propertyModel = {
  insert: async (propertyData) => {
    try {
      const propertyResult = await client.query(
        "SELECT assets.t_property_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)",
        [
          propertyData.userId,
          propertyData.propertyCategory,
          propertyData.propertyType,
          propertyData.propertyTitle,
          propertyData.propertyDescription,
          propertyData.address,
          propertyData.location,
          propertyData.landmark,
          propertyData.pinCode,
          propertyData.city,
          propertyData.state,
          propertyData.country,
          propertyData.latitude,
          propertyData.longitude,
          propertyData.availableDate,
          propertyData.expiryDate,
          propertyData.bedRooms,
          propertyData.bathRooms,
          propertyData.amenities,
          propertyData.propertyArea,
          propertyData.currencyType,
          propertyData.price,
          propertyData.status,
          propertyData.isActive,
          propertyData.isApproved,
          propertyData.isArchived,
          propertyData.createdBy,
          propertyData.updatedBy,
        ]
      );

      // console.log("Property Result:", {
      //   fullResult: propertyResult.rows[0],
      //   id: propertyResult.rows[0]?.t_property_insert,
      //   rowCount: propertyResult.rowCount,
      //   command: propertyResult.command,
      // });

      const propertyId = propertyResult.rows[0];
      console.log("Property inserted successfully with ID:", propertyId);

      if (!propertyId) {
        console.error("Property insertion failed or returned no ID");
        throw new Error("Failed to get property ID after insertion");
      }

      // Only process images if they exist
      if (propertyData.propertyImages && propertyData.propertyImages.length > 0) {
        const imageInsertPromises = propertyData.propertyImages.map((imageUrl) =>
          client.query("SELECT assets.t_property_images_insert($1, $2, $3, $4)", [
            propertyId,
            imageUrl,
            propertyData.createdBy,
            propertyData.updatedBy,
          ])
        );

        await Promise.all(imageInsertPromises);
      }

      return propertyResult.rows[0];
    } catch (error) {
      console.error("Error inserting property:", error);
      throw error;
    }
  },

  getAll: async () => {
    const result = await client.query(
      "SELECT * FROM assets.t_property_get_all()"
    );
    return result.rows;
  },

  getById: async (id) => {
    const result = await client.query(
      "SELECT * FROM assets.t_propertydetails_get_by_id($1)",
      [id]
    );
    return result.rows[0];
  },

  update: async (id, updateData) => {
    try {
      const result = await client.query(
        "SELECT assets.t_property_update($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)",
        [
          id,
          updateData.userId,
          updateData.propertyCategory,
          updateData.propertyType,
          updateData.propertyTitle,
          updateData.propertyDescription,
          updateData.address,
          updateData.location,
          updateData.landmark,
          updateData.pinCode,
          updateData.city,
          updateData.state,
          updateData.country,
          updateData.latitude,
          updateData.longitude,
          updateData.availableDate,
          updateData.expiryDate,
          updateData.bedRooms,
          updateData.bathRooms,
          updateData.amenities,
          updateData.propertyArea,
          updateData.currencyType,
          updateData.price,
          updateData.status,
          updateData.isactive,
          updateData.isapproved,
          updateData.isarchived,
          updateData.updatedBy,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  delete: async (id, userId) => {
    try {
      await client.query("SELECT assets.t_properties_delete($1, $2)", [userId, id]);
      return true; // Return true if deletion is successful
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error; // Rethrow the error for handling in the service
    }
  },

  getPropertyDetails: async (id, userId = null) => {
    console.log("Log From get details by userid", id, userId);

    const result = await client.query(
      "SELECT * FROM assets.t_propertydetails_get_by_id($1, $2, $3)",
      [id, userId, null]
    );
    return result.rows[0];
  },

  getPropertyDetailsWithUser: async (id, userId = null) => {
    const result = await client.query(
      "SELECT * FROM assets.t_propertydetails_get_by_id($1, $2)",
      [id, userId]
    );
    return result.rows[0];
  },

  getAllWithFilters: async (filters, options) => {
    const result = await client.query(
      "SELECT * FROM assets.t_property_get_all($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        options.page,
        options.limit,
        options.sortBy,
        options.sortOrder,
        filters.propertyCategory,
        filters.propertyType,
        filters.city,
        filters.minPrice,
        filters.maxPrice,
      ]
    );

    // Calculate total pages and format response
    const totalCount =
      result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / options.limit);

    return {
      properties: result.rows,
      pagination: {
        page: options.page,
        limit: options.limit,
        totalPages,
        totalResults: totalCount,
      },
    };
  },

  approveProperty: async (propertyId, userId, action) => {
    try {
      const result = await client.query(
        "SELECT assets.t_property_request_action($1, $2, $3)",
        [propertyId, userId, action]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error approving property:", error);
      throw error;
    }
  },

  searchByCriteria: async (criteria) => {
    try {
      const result = await client.query(
        `SELECT * FROM assets.t_searchcriteria(
                    _propcat := $1,
                    _proptype := $2,
                    _loc := $3,
                    _pin := $4,
                    _city := $5,
                    _state := $6,
                    _usrid := $7,
                    _minprice := $8,
                    _maxprice := $9,
                    _minarea := $10,
                    _maxarea := $11,
                    _minbdrom := $12,
                    _maxbdrom := $13,
                    _status := $14,
                    _isactv := $15
                )`,
        [
          criteria.propertyCategory || null,
          criteria.propertyType || null,
          criteria.location || null,
          criteria.pinCode || null,
          criteria.city || null,
          criteria.state || null,
          criteria.userId || null,
          criteria.minPrice || null,
          criteria.maxPrice || null,
          criteria.minArea || null,
          criteria.maxArea || null,
          criteria.minBedrooms || null,
          criteria.maxBedrooms || null,
          criteria.status || null,
          criteria.isActive || null,
        ]
      );

      console.log("Search result count:", result.rows.length);
      return result.rows;
    } catch (error) {
      console.error("Error in property search:", error);
      throw error;
    }
  },

  insertFavorite: async (favoriteData) => {
    try {
      const result = await client.query(
        "SELECT assets.t_favorites_insert($1, $2, $3, $4, $5, $6)",
        [
          favoriteData.userId,
          favoriteData.propertyId,
          favoriteData.rating,
          favoriteData.comment || "",
          favoriteData.createdBy,
          favoriteData.updatedBy,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  },

  updateFavorite: async (updateData) => {
    try {
      const result = await client.query(
        "SELECT assets.t_favorites_update($1, $2, $3, $4, $5, $6)",
        [
          updateData.favoriteId,
          updateData.userId,
          updateData.propertyId,
          updateData.rating,
          updateData.comment || "",
          updateData.updatedBy,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating favorite:", error);
      throw error;
    }
  },

  getFavorites: async (userId) => {
    try {
      const result = await client.query(
        "SELECT * FROM assets.t_favorites_get_all_by_userid($1)",
        [userId]
      );

      console.log("Favorites result", result.rows[0]?.t_favorites_get_all_by_userid);


      return {
        status: true,
        message: "Favorites retrieved successfully",
        data: result.rows[0]?.t_favorites_get_all_by_userid || [],
      };
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  },

  getRecentViewedWithFavoriteCount: async (limit) => {
    try {
      const result = await client.query(
        "SELECT * FROM assets.t_properties_get_recent_viewed_favourcnt($1)",
        [limit]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error getting recent viewed properties:", error);
      throw error;
    }
  },

  insertBooking: async (bookingData) => {
    try {
      const result = await client.query(
        "SELECT assets.t_propertybooking_insert($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          bookingData.userId,
          bookingData.propertyId,
          bookingData.isBooked,
          bookingData.isCancelled,
          bookingData.reasonForCancellation || "",
          bookingData.bookedDate,
          bookingData.cancelledDate || null,
          bookingData.createdBy,
          bookingData.updatedBy,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error inserting property booking:", error);
      throw error;
    }
  },

  updateBooking: async (updateData) => {
    console.log("updateData", updateData);
    try {
      const result = await client.query(
        "SELECT assets.t_propertybooking_update($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          updateData.bookingId,
          updateData.userId,
          updateData.propertyId,
          updateData.isBooked,
          updateData.isCancelled,
          updateData.reasonForCancellation || "",
          updateData.bookedDate,
          updateData.cancelledDate || null,
          updateData.updatedBy,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating property booking:", error);
      throw error;
    }
  },

  getBookingsByUserId: async (userId) => {
    try {
      const result = await client.query(
        "SELECT assets.t_propertybooking_get_by_id($1, $2, $3)",
        [userId, null, null]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error getting booking details:", error);
      throw error;
    }
  },

  insertPropertyWithAttachments: async (propertyData, attachments) => {
    try {
      // console.log("Starting property insertion with attachments");
      // console.log("Property Data:", JSON.stringify(propertyData, null, 2));
      // console.log("Attachments:", JSON.stringify(attachments, null, 2));

      await client.query("BEGIN");
      console.log("Transaction begun");

      // Insert property first
      const propertyResult = await client.query(
        "SELECT assets.t_property_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) as id",
        [
          propertyData.userId,
          propertyData.propertyCategory,
          propertyData.propertyType,
          propertyData.propertyTitle,
          propertyData.propertyDescription,
          propertyData.address,
          propertyData.location,
          propertyData.landmark,
          propertyData.pinCode,
          propertyData.city,
          propertyData.state,
          propertyData.country,
          propertyData.latitude,
          propertyData.longitude,
          propertyData.availableDate,
          propertyData.expiryDate,
          propertyData.bedRooms,
          propertyData.bathRooms,
          propertyData.amenities,
          propertyData.propertyArea,
          propertyData.currencyType,
          propertyData.price,
          propertyData.status,
          propertyData.isActive,
          propertyData.isApproved,
          propertyData.isArchived,
          propertyData.createdBy,
          propertyData.updatedBy,
        ]
      );

      // console.log("Property Result:", {
      //   fullResult: propertyResult,
      //   id: propertyResult.rows[0]?.id,
      //   rowCount: propertyResult.rowCount,
      //   command: propertyResult.command,
      // });

      const propertyId = propertyResult.rows[0]?.id?.propertyid;
      console.log("Property inserted successfully with ID:", propertyId);

      if (!propertyId) {
        console.error("Property insertion failed or returned no ID");
        throw new Error("Failed to get property ID after insertion");
      }

      // Insert attachments with type and primary flag logic
      if (!Array.isArray(attachments)) {
        console.log("No attachments provided or invalid attachments format");
        attachments = [];
      }

      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        console.log("Processing attachment:", i + 1, "of", attachments.length);

        // Handle string URLs directly
        const attachmentUrl =
          typeof attachment === "string" ? attachment : attachment?.url;

        if (!attachmentUrl || typeof attachmentUrl !== "string") {
          console.log("Skipping attachment with invalid URL:", attachment);
          continue;
        }

        // Determine attachment type (1 for image, 2 for video)
        const attachmentType = attachmentUrl
          .toLowerCase()
          .match(/\.(jpg|jpeg|png|gif|webp)$/i)
          ? 1
          : 2;
        // Set isPrimary to true only for the first image
        const isPrimary = attachmentType === 1 && i === 0;

        await client.query(
          "SELECT assets.t_propertyattachment_insert($1, $2, $3, $4, $5, $6, $7)",
          [
            propertyId,
            propertyData.propertyTitle,
            attachmentUrl,
            attachmentType,
            isPrimary,
            propertyData.createdBy,
            propertyData.updatedBy,
          ]
        );
        console.log("Attachment inserted successfully");
      }

      await client.query("COMMIT");
      console.log("Transaction committed successfully");
      return propertyResult.rows[0];
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        details: error.detail,
      });

      await client.query("ROLLBACK");
      console.error("Transaction rolled back due to error");
      throw error;
    }
  },

  // updatePropertyAttachment: async (attachmentData) => {
  //   try {
  //     // Check if there are multiple attachments and set the first image as primary
  //     if (Array.isArray(attachmentData.attachments) && attachmentData.attachments.length > 0) {
  //       // Iterate over the attachments and update them
  //       for (let i = 0; i < attachmentData.attachments.length; i++) {
  //         const attachment = attachmentData.attachments[i];
  //         const attachmentUrl = attachment.url;
  //         const isPrimary = attachmentUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i) && i === 0; // Set primary if it's the first image

  //         // Perform update for each attachment
  //         await client.query(
  //           "SELECT assets.t_propertyattachment_update($1, $2, $3, $4, $5, $6)",
  //           [
  //             attachment.attachmentId,
  //             attachment.propertyId,
  //             attachment.name,
  //             attachmentUrl,
  //             attachment.type,
  //             isPrimary, // Set isPrimary flag
  //           ]
  //         );
  //         console.log("Attachment updated successfully:", attachment.attachmentId);
  //       }
  //     } else {
  //       // If it's not an array or no attachments, update a single attachment
  //       const { attachmentId, propertyId, name, url, type } = attachmentData;
  //       const isPrimary = url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i) && true; // Mark it primary if it's an image

  //       await client.query(
  //         "SELECT assets.t_propertyattachment_update($1, $2, $3, $4, $5, $6)",
  //         [
  //           attachmentId,
  //           propertyId,
  //           name,
  //           url,
  //           type,
  //           isPrimary, // Set isPrimary flag
  //         ]
  //       );
  //       console.log("Single attachment updated successfully:", attachmentId);
  //     }

  //     return { message: "Attachments updated successfully" };
  //   } catch (error) {
  //     console.error("Error updating property attachment:", error);
  //     throw error;
  //   }
  // },

  updatePropertyAttachment: async (attachmentData) => {
    try {
      const result = await client.query(
        "SELECT assets.t_propertyattachment_update($1, $2, $3, $4, $5, $6)",
        [
          attachmentData.attachmentId,
          attachmentData.propertyId,
          attachmentData.name,
          attachmentData.url,
          attachmentData.type,
          attachmentData.isPrimary,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating property attachment:", error);
      throw error;
    }
  },

  getPropertyAttachments: async (propertyId) => {
    try {
      const result = await client.query(
        "SELECT * FROM assets.t_propertyattachment_get_by_property($1)",
        [propertyId]
      );
      return result.rows;
    } catch (error) {
      console.error("Error getting property attachments:", error);
      throw error;
    }
  },

  deleteFavorite: async (userId, favoriteId) => {
    try {
      // Call the PostgreSQL function to delete the favorite
      await client.query("SELECT assets.t_favorites_delete($1, $2)", [userId, favoriteId]);
      return true; // Return true if deletion is successful
    } catch (error) {
      console.error("Error deleting favorite:", error);
      throw error; // Rethrow the error for handling in the service
    }
  },

  deleteAttachment: async (attachmentId) => {
    try {
      const result = await client.query(
        "SELECT assets.t_propertyattachment_delete($1)",
        [attachmentId]
      );
      return result.rows[0].t_propertyattachment_delete;
    } catch (error) {
      console.error("Error deleting property attachment:", error);
      throw error;
    }
  },

  insertAttachment: async (attachmentData) => {
    console.log("Attachment Data", attachmentData?.name, attachmentData?.url, attachmentData?.type, attachmentData?.isPrimary, attachmentData?.createdBy, attachmentData?.updatedBy);
    try {
      const result = await client.query(
        "SELECT assets.t_propertyattachment_insert($1, $2, $3, $4, $5, $6, $7)",
        [attachmentData.propertyId, attachmentData.name, attachmentData.url, attachmentData.type, attachmentData.isPrimary, attachmentData.createdBy, attachmentData.updatedBy]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error inserting property attachment:", error);
      throw error;
    }
  },

  getDownloadReport: async () => {
    try {
      const query = 'SELECT * FROM assets.t_get_real_estate_report()';  // Adjust the query if needed
      const result = await client.query(query);  // client.query or your db client

      if (!result || !result.rows || result.rows.length === 0) {
        console.warn('No result or rows from t_get_real_estate_report()');
        return null;  // No data, return null
      }

      console.log('[INFO] Successfully fetched property report data from DB.');
      return result.rows;  // Return all rows if multiple rows are expected
      // Or, if only one row is expected, return result.rows[0]
    } catch (error) {
      console.error('[ERROR] Error fetching property report:', error);
      throw new Error('Database query failed');
    }
  }

};


module.exports = propertyModel;
