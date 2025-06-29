const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { propertyService, userService } = require("../services");
const ApiError = require("../utils/ApiError");
const storageService = require("../services/storage.service");
const { sendEmail } = require("../services/emailService");
const config = require("../config/config");
const {
  createPropertyReviewEmailTemplate,
} = require("../templates/propertyreview");
const createPropertyApprovalEmail = require("../templates/propertyapproval");
const createPropertyBookingEmail = require("../templates/propertybooking");

const createProperty = catchAsync(async (req, res) => {
  console.log("Create Property Request:", {
    files: req.processedFiles,
    body: req.body,
  });

  const userId = req.user.t_user_get_by_id[0]?.userid;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User ID not found");
  }

  let imageUrls = [];
  // Upload the processed files if they exist
  if (req.processedFiles && req.processedFiles.length > 0) {
    imageUrls = await storageService.uploadMultipleFiles(req.processedFiles);
    console.log("Uploaded image URLs:", imageUrls);
  }

  // Parse numeric fields
  const propertyData = {
    ...req.body,
    amenities:
      typeof req.body.amenities === "string"
        ? JSON.parse(req.body.amenities)
        : req.body.amenities,
    price: parseFloat(req.body.price) || 0,
    bedRooms: parseInt(req.body.bedRooms) || 0,
    bathRooms: parseInt(req.body.bathRooms) || 0,
    propertyCategory: parseInt(req.body.propertyCategory) || 0,
    propertyType: parseInt(req.body.propertyType) || 0,
    userId: parseInt(req.body.userId) || userId,
    createdBy: userId,
    updatedBy: userId,
  };

  const property = await propertyService.createPropertyWithAttachments(
    propertyData,
    imageUrls
  );

  console.log("Property", property);

  if (property) {
    try {
      sendEmail({
        from: null,
        to: config.adminEmail,
        subject: "Property Created",
        text: "Property Created Successfully",
        html: createPropertyReviewEmailTemplate(property?.id, config),
      });
    } catch (error) {
      console.error("Error sending email:", error); // Log the error
    }
  }
  res.status(httpStatus.CREATED).send(property);
});

const getAllProperties = catchAsync(async (req, res) => {
  const filters = {
    propertyCategory: req.query.propertyCategory
      ? parseInt(req.query.propertyCategory)
      : null,
    propertyType: req.query.propertyType
      ? parseInt(req.query.propertyType)
      : null,
    city: req.query.city,
    minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
    maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
  };

  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sortBy: req.query.sortBy || "created_at",
    sortOrder: req.query.sortOrder?.toLowerCase() || "desc",
  };

  const result = await propertyService.getAllProperties(filters, options);
  res.send(result);
});

const getPropertyById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId, full } = req.body;

  let property;

  console.log("Property Details", id, "Userid", userId, "Full", full);

  if (full === "1") {
    // Get full details without user info (level 1)
    const updatedId = id == 0 ? null : id;
    property = await propertyService.getPropertyDetails(updatedId, userId);
  } else {
    // Get basic details (level 0)
    property = await propertyService.getPropertyById(id);
  }

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }

  res.send(property);
});

const updateProperty = catchAsync(async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user.t_user_get_by_id[0]?.userid;

  const updateData = {
    ...req.body,
    isactive: true,
    isapproved: false,
    isarchieved: false,
    updatedBy: userId,
  };

  let attachmentsToRemove = JSON.parse(req.body.attachmentsToRemove);
  const newFiles = req.processedFiles || [];

  // Remove specified attachments
  for (const attachment of attachmentsToRemove) {
    if (attachment && (attachment.attachmenturl || attachment.attachmentid)) {
      try {
        if (attachment.attachmenturl) {
          await storageService.deleteFile(attachment);
        }
        if (attachment.attachmentid) {
          await propertyService.deleteAttachment(attachment.attachmentid);
        }
      } catch (error) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Error removing attachment"
        );
      }
    }
  }

  // Upload new attachments
  let newImageUrls = [];
  if (newFiles.length > 0) {
    newImageUrls = await storageService.uploadMultipleFiles(newFiles);
  }

  // Create new attachment records in the database
  for (const imageUrl of newImageUrls) {
    const name = imageUrl.split("/").pop();
    const type = imageUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i)
      ? 1
      : 2;

    await propertyService.insertAttachment({
      propertyId: propertyId,
      name: name,
      url: imageUrl,
      type: type,
      isPrimary: false,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  const updatedProperty = await propertyService.updateProperty(
    propertyId,
    updateData
  );
  res.send(updatedProperty);
});

const deleteProperty = catchAsync(async (req, res) => {
  const propertyId = req.params.id; // Get the property ID from the request parameters
  const userId = req.user.t_user_get_by_id[0]?.userid; // Get the user ID from the request

  // Call the service to delete the property
  await propertyService.deleteProperty(propertyId, userId);

  res.status(httpStatus.NO_CONTENT).send(); // Send a 204 No Content response
});

const getPropertyDetails = catchAsync(async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.params.userId;

  const property = await propertyService.getPropertyDetails(propertyId, userId);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }
  res.send(property);
});

const approveProperty = catchAsync(async (req, res) => {
  const propertyId = req.params.id;
  const { userId, action } = req.body;

  const userDetails = await userService.getUserById(userId);

  // console.log("User details", userDetails);

  if (!userDetails?.t_user_get_by_id[0]?.isadmin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only administrators can approve properties"
    );
  }

  const result = await propertyService.approveProperty(
    propertyId,
    userId,
    action
  );

  console.log("Result", result);

  //Send email to the seller
  if(result){
    try {
      sendEmail({
        from: null,
        to: result?.t_property_request_action?.email,
        subject: "Your Property is Approved",
        text: "Your Property is Approved Successfully",
        html: createPropertyApprovalEmail(result?.t_property_request_action?.fullname, result?.t_property_request_action, config),
      });
    } catch (error) {
      console.error("Error sending email:", error); // Log the error
    }
  }
  res.send(result);
});

const searchProperties = catchAsync(async (req, res) => {
  const searchCriteria = {
    propertyCategory: req.query.propertyCategory,
    propertyType: req.query.propertyType,
    location: req.query.location,
    pinCode: req.query.pinCode,
    city: req.query.city,
    state: req.query.state,
    userId: req.query.userid,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    minArea: req.query.minArea,
    maxArea: req.query.maxArea,
    minBedrooms: req.query.minBedrooms,
    maxBedrooms: req.query.maxBedrooms,
    status: req.query.status,
    isActive: req.query.isActive,
  };

  console.log("User id in search", req.query.userid);

  const properties = await propertyService.searchProperties(searchCriteria);
  res.send(properties);
});

const addToFavorites = catchAsync(async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user.t_user_get_by_id[0]?.userid;
  const favoriteData = {
    ...req.body,
    userId,
    propertyId,
    createdBy: userId,
    updatedBy: userId,
  };

  const favorite = await propertyService.addToFavorites(favoriteData);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Property added to favorites successfully",
  });
});

const updateFavorite = catchAsync(async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user.id;
  const updateData = {
    ...req.body,
    userId,
    propertyId,
  };

  const favorite = await propertyService.updateFavorite(updateData);
  res.send(favorite);
});

const getFavorites = catchAsync(async (req, res) => {
  const userId = req.user.t_user_get_by_id[0]?.userid;
  console.log("User id in Fav", userId);

  const favorites = await propertyService.getFavorites(userId);
  res.send(favorites);
});

const getRecentViewedWithFavoriteCount = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const properties = await propertyService.getRecentViewedWithFavoriteCount(
    limit
  );
  res.send(properties);
});

const bookProperty = catchAsync(async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user.t_user_get_by_id[0]?.userid;
  const bookingData = {
    ...req.body,
    userId,
    propertyId,
    createdBy: userId,
    updatedBy: userId,
  };

  const booking = await propertyService.bookProperty(bookingData);

  console.log("Booking", booking);

  // Send email to the seller
  if(booking){
    try {
      sendEmail({
        from: null,
        // to: [booking?.t_propertybooking_insert?.selleremail, config?.adminEmail],
        to: [config?.adminEmail], // ✅ Removed seller's email
        subject: "Property Booking Notification",
        text: "Your Property is Booked Successfully",
        html: createPropertyBookingEmail(booking?.t_propertybooking_insert, config),
      });
    } catch (error) {
      console.error("Error sending email:", error); // Log the error
    }
  }
  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Property booked successfully",
    data: booking,
  });
});

const updateBooking = catchAsync(async (req, res) => {
  const propertyId = req.params.propertyId;
  const bookingId = req.params.bookingId;
  const userId = req.user.t_user_get_by_id[0]?.userid;

  const updateData = {
    ...req.body,
    bookingId,
    userId,
    propertyId,
    updatedBy: userId,
  };

  const booking = await propertyService.updateBooking(updateData);
  res.send(booking);
});

const getBookingsByUserId = catchAsync(async (req, res) => {
  // const propertyId = req.params.id;
  const userId = req.user.t_user_get_by_id[0]?.userid;
  // const bookingId = req.query.bookingId;

  console.log("User id in booking", userId);

  const booking = await propertyService.getBookingsByUserId(userId);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }
  res.send(booking);
});

const getPendingApprovals = catchAsync(async (req, res) => {
  const pendingProperties = await propertyService.getPendingApprovals();
  res.status(httpStatus.OK).send({
    success: true,
    message: "Pending properties retrieved successfully",
    data: pendingProperties,
  });
});

const getMostViewedProperties = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5; // Default limit to 5
  const properties = await propertyService.getMostViewedProperties(limit);
  res.status(httpStatus.OK).send({
    success: true,
    message: "Most viewed properties retrieved successfully",
    data: properties,
  });
});

const deleteFavorite = catchAsync(async (req, res) => {
  const favoriteId = req.params.id; // Get the favorite ID from the request parameters
  const userId = req.user.t_user_get_by_id[0]?.userid; // Get the user ID from the request

  // Call the service to delete the favorite
  await propertyService.deleteFavorite(userId, favoriteId);

  res.status(httpStatus.NO_CONTENT).send(); // Send a 204 No Content response
});

// //created by sreeni on 2025-05-02 
// const updatePropertyAttachments = catchAsync(async (req, res) => {
//   const propertyId = req.params.id;
//   const userId = req.user.t_user_get_by_id[0]?.userid;

//   const attachmentsToRemove = req.body.attachmentsToRemove || [];

//   // 1. Delete specified attachments
//   for (const attachmentId of attachmentsToRemove) {
//     await storageService.deleteFile(attachmentId);
//     await propertyService.deleteAttachment(attachmentId);
//   }

//   // 2. Upload new files
//   let newImageUrls = [];
//   if (req.processedFiles && req.processedFiles.length > 0) {
//     newImageUrls = await storageService.uploadMultipleFiles(req.processedFiles);
//   }

//   // 3. Insert new attachments — set first one as primary
//   for (let i = 0; i < newImageUrls.length; i++) {
//     const imageUrl = newImageUrls[i];

//     await propertyService.insertAttachment({
//       propertyId,
//       name: `Attachment-${Date.now()}`,
//       url: imageUrl,
//       type: 1, // assuming it's an image
//       isPrimary: i === 0, // set only the first one as primary
//       createdBy: userId,
//       updatedBy: userId,
//     });
//   }

//   res.send("Property Updated Successfully");
// });


const updatePropertyAttachments = catchAsync(async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user.t_user_get_by_id[0]?.userid;

  const attachmentsToRemove = req.body.attachmentsToRemove || [];

  for (const attachmentId of attachmentsToRemove) {
    await storageService.deleteFile(attachmentId);
    await propertyService.deleteAttachment(attachmentId);
  }

  let newImageUrls = [];
  if (req.processedFiles && req.processedFiles.length > 0) {
    newImageUrls = await storageService.uploadMultipleFiles(req.processedFiles);
  }

  for (const imageUrl of newImageUrls) {
    await propertyService.addAttachment({
      propertyId,
      attachmentUrl: imageUrl,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  res.send("Property Updated Successfully");
});


const getDownloadProperties = async (req, res) => {
  try {
    const report = await propertyService.getDownloadReport(); // or call DB directly

    if (!report) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'No report found' });
    }

    res.status(httpStatus.OK).json(report);
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch report123' });
  }
};

// const updatePropertyAttachments = catchAsync(async (req, res) => {
//   const propertyId = req.params.id;
//   const userId = req.user.t_user_get_by_id[0]?.userid;

//   const attachmentsToRemove = req.body.attachmentsToRemove || [];

//   // 1. Delete attachments
//   for (const attachment of attachmentsToRemove) {
//     try {
//       if (attachment.attachmenturl) {
//         await storageService.deleteFile(attachment); // Deletes from storage
//       }
//       if (attachment.attachmentid) {
//         await propertyService.deleteAttachment(attachment.attachmentid); // Deletes from DB
//       }
//     } catch (err) {
//       console.error("Failed to remove attachment:", err);
//     }
//   }

//   // 2. Upload new files
//   let newImageUrls = [];
//   if (req.processedFiles && req.processedFiles.length > 0) {
//     newImageUrls = await storageService.uploadMultipleFiles(req.processedFiles);
//   }

//   // 3. Check for existing primary
//   const existingAttachments = await propertyService.getAttachmentsByPropertyId(propertyId);
//   let hasPrimary = existingAttachments.some((a) => a.isPrimary);

//   // 4. Add new attachments
//   for (let i = 0; i < newImageUrls.length; i++) {
//     const imageUrl = newImageUrls[i];
//     const name = imageUrl.split("/").pop();
//     const type = /\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl.toLowerCase()) ? 1 : 2;
//     const isPrimary = !hasPrimary && i === 0; // Mark first uploaded one as primary if none exists

//     await propertyService.insertAttachment({
//       propertyId,
//       name,
//       url: imageUrl,
//       type,
//       isPrimary,
//       createdBy: userId,
//       updatedBy: userId,
//     });

//     if (isPrimary) hasPrimary = true;
//   }

//   // 5. Ensure at least one primary
//   const updatedAttachments = await propertyService.getAttachmentsByPropertyId(propertyId);
//   const primaryExists = updatedAttachments.some((att) => att.isPrimary);

//   if (!primaryExists && updatedAttachments.length > 0) {
//     await propertyService.setPrimaryAttachment(updatedAttachments[0].attachmentId, userId);
//   }

//   res.status(httpStatus.OK).send({
//     success: true,
//     message: "Property attachments updated successfully",
//   });
// });


module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getPropertyDetails,
  approveProperty,
  searchProperties,
  addToFavorites,
  updateFavorite,
  getFavorites,
  getRecentViewedWithFavoriteCount,
  bookProperty,
  updateBooking,
  getBookingsByUserId,
  getPendingApprovals,
  getMostViewedProperties,
  deleteFavorite,
  updatePropertyAttachments,
  getDownloadProperties,
};
