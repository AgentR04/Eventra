import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from './config';

// Create a new document with a generated ID
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Create a new document with a specific ID
export const setDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), data);
    return { id: docId, ...data };
  } catch (error) {
    console.error("Error setting document: ", error);
    throw error;
  }
};

// Get a document by ID
export const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

// Get all documents from a collection
export const getCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting collection: ", error);
    throw error;
  }
};

// Query documents from a collection
export const queryDocuments = async (collectionName, conditions = [], sortBy = null, limitTo = null) => {
  try {
    let queryRef = collection(db, collectionName);
    
    // Add query conditions
    if (conditions.length > 0) {
      const queryConstraints = conditions.map(condition => 
        where(condition.field, condition.operator, condition.value)
      );
      queryRef = query(queryRef, ...queryConstraints);
    }
    
    // Add sorting
    if (sortBy) {
      queryRef = query(queryRef, orderBy(sortBy.field, sortBy.direction || 'asc'));
    }
    
    // Add limit
    if (limitTo) {
      queryRef = query(queryRef, limit(limitTo));
    }
    
    const querySnapshot = await getDocs(queryRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error querying documents: ", error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
    return { id: docId, ...data };
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};
