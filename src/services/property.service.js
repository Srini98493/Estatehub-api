const httpStatus = require("http-status");
const { propertyModel } = require("../db/models");
const ApiError = require("../utils/ApiError");
const { uploadMultipleFiles } = require("./storage.service");

const createProperty = async (propertyData) => {
  try {
    const property = await propertyModel.insert(propertyData);
    return property;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Error creating property");
  }
};

const getAllProperties = async (filters, options) => {
  const properties = await propertyModel.getAllWithFilters(filters, options);
  return properties;
};

const getPropertyById = async (id) => {
  const result = await propertyModel.getById(id);
  return result;
};

const updateProperty = async (id, updateData) => {
  const property = await getPropertyById(id);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }
  return propertyModel.update(id, updateData);
};

const deleteProperty = async (id, userId) => {
  const property = await getPropertyById(id);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
  }
  return propertyModel.delete(id, userId);
};

const getPropertyDetails = async (id, userId = null) => {
    console.log("Get Property details By Id", id, "UserId", userId);
    
  const result = await propertyModel.getPropertyDetails(id, userId);
  console.log("Get Property details By Id", id, "UserId", userId);
  return result;
};

const getPropertyDetailsWithUser = async (id, userId = null) => {
  const result = await propertyModel.getPropertyDetailsWithUser(id, userId);
  return result;
};

const approveProperty = async (propertyId, userId, action) => {
  try {
    if (!["submit", "approve"].includes(action)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid action");
    }

    const result = await propertyModel.approveProperty(
      propertyId,
      userId,
      action
    );
    return result;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Error ${action}ing property: ${error.message}`
    );
  }
};

const searchProperties = async (searchCriteria) => {
    try {
        const properties = await propertyModel.searchByCriteria(searchCriteria);
        return properties;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error searching properties");
    }
};

const addToFavorites = async (favoriteData) => {
  try {
    const favorite = await propertyModel.insertFavorite(favoriteData);
    return favorite;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Error adding to favorites");
  }
};

const updateFavorite = async (updateData) => {
  try {
    const favorite = await propertyModel.updateFavorite(updateData);
    return favorite;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Error updating favorite");
  }
};

const getFavorites = async (userId) => {
  try {
    const favorites = await propertyModel.getFavorites(userId);
    return favorites;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Error fetching favorites");
  }
};

const getRecentViewedWithFavoriteCount = async (limit = 5) => {
  try {
    const properties = await propertyModel.getRecentViewedWithFavoriteCount(
      limit
    );
    return properties;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Error fetching recent viewed properties"
    );
  }
};

const bookProperty = async (bookingData) => {
  try {
    const booking = await propertyModel.insertBooking(bookingData);
    return booking;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Error booking property");
  }
};

const updateBooking = async (updateData) => {
  try {
    const booking = await propertyModel.updateBooking(updateData);
    return booking;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Error updating property booking"
    );
  }
};

const getBookingsByUserId = async (userId) => {
  try {
    const booking = await propertyModel.getBookingsByUserId(
      userId
    );
    return booking;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Error fetching booking details"
    );
  }
};

const createPropertyWithAttachments = async (propertyData, files) => {
  try {
   
    // Create property with attachments
    return await propertyModel.insertPropertyWithAttachments(
      propertyData,
      files
    );
  } catch (error) {
    console.error("Error in createPropertyWithAttachments:", error);
    throw error;
  }
};

const updatePropertyAttachment = async (attachmentData) => {
  return await propertyModel.updatePropertyAttachment(attachmentData);
};

const getPropertyAttachments = async (propertyId) => {
  return await propertyModel.getPropertyAttachments(propertyId);
};

const getPendingApprovals = async () => {
    try {
        const properties = await propertyModel.getPropertyDetails(null, 1);
        // Filter properties where isApproved is false
        const propertiesList = properties?.t_propertydetails_get_by_id;
        
        const pendingProperties = Array.isArray(propertiesList) 
            ? propertiesList.filter(prop => prop.isapproved === false)
            : [];
        return pendingProperties;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error fetching pending approvals");
    }
};

const getMostViewedProperties = async (limit) => {
  try {
    const result = await propertyModel.getRecentViewedWithFavoriteCount(limit);
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Error fetching most viewed properties");
  }
};

const deleteFavorite = async (userId, favoriteId) => {
    try {
        // Call the model to delete the favorite
        await propertyModel.deleteFavorite(userId, favoriteId);
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error deleting favorite");
    }
};

const deleteAttachment = async (attachmentId) => {
  return await propertyModel.deleteAttachment(attachmentId);
};

const insertAttachment = async (attachmentData) => {
  return await propertyModel.insertAttachment(attachmentData);
};

// Example service function to fetch the property report (download report)
const getDownloadReport = async () => {
  try {
    const report = await propertyModel.getDownloadReport();

    if (!report || report.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "No property report available.");
    }

    return {
      status: httpStatus.OK,
      message: "Property report retrieved successfully.",
      data: report,
    };
  } catch (error) {
    console.error("Error fetching property report:", error);
    if (error instanceof ApiError) {
      throw error;  // Handle known API errors
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error");
  }
};

// const getAttachmentsByPropertyId = async (propertyId) => {
//   try {
//     return await propertyModel.getPropertyAttachments(propertyId);
//   } catch (error) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Error fetching attachments");
//   }
// };

// const setPrimaryAttachment = async (attachmentId, userId) => {
//   try {
//     return await propertyModel.setPrimaryAttachment(attachmentId, userId);
//   } catch (error) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Error setting primary attachment");
//   }
// };

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
  createPropertyWithAttachments,
  updatePropertyAttachment,
  getPropertyAttachments,
  getPendingApprovals,
  getMostViewedProperties,
  deleteFavorite,
  deleteAttachment,
  insertAttachment,
  getDownloadReport, 
  // getAttachmentsByPropertyId,
  // setPrimaryAttachment,
  
};
