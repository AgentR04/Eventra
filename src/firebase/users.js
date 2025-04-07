import { setDocument, getDocument, updateDocument } from "./firestore";

// Collection name for users
const USERS_COLLECTION = "users";

/**
 * Create or update a user profile in Firestore
 * @param {string} userId - The Firebase Auth user ID
 * @param {object} userData - User profile data
 * @returns {Promise<object>} - The created/updated user document
 */
export const saveUserProfile = async (userId, userData) => {
  try {
    // Check if user document already exists
    const existingUser = await getDocument(USERS_COLLECTION, userId);

    if (existingUser) {
      // Update existing user
      return await updateDocument(USERS_COLLECTION, userId, userData);
    } else {
      // Create new user document
      return await setDocument(USERS_COLLECTION, userId, {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

/**
 * Get a user profile by ID
 * @param {string} userId - The Firebase Auth user ID
 * @returns {Promise<object|null>} - The user document or null if not found
 */
export const getUserProfile = async (userId) => {
  try {
    return await getDocument(USERS_COLLECTION, userId);
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Update a user profile
 * @param {string} userId - The Firebase Auth user ID
 * @param {object} userData - User profile data to update
 * @returns {Promise<object>} - The updated user document
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    return await updateDocument(USERS_COLLECTION, userId, {
      ...userData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
