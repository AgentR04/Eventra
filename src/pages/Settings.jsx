import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaUniversity, 
  FaArrowLeft, 
  FaSave, 
  FaCamera, 
  FaExclamationCircle,
  FaCheck
} from 'react-icons/fa';
import Button from '../components/common/Button';
import { useFirebase } from '../firebase/FirebaseContext';
import { updateUserProfile as updateAuthProfile } from '../firebase/auth';
import { getUserProfile } from '../firebase/users';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const Settings = () => {
  const { currentUser, loading } = useFirebase();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    collegeCode: '',
    role: '',
    committee: '',
    skills: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !currentUser) {
      navigate('/login');
      return;
    }
    
    // Fetch user profile data
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          // Get Firestore profile data
          const profileData = await getUserProfile(currentUser.uid);
          
          if (profileData) {
            setFormData({
              name: profileData.name || currentUser.displayName || '',
              email: profileData.email || currentUser.email || '',
              phone: profileData.phone || '',
              collegeCode: profileData.collegeCode || '',
              role: profileData.role || 'member',
              committee: profileData.committee || 'general',
              skills: profileData.skills || ''
            });
          } else {
            // Use Firebase auth data if Firestore profile doesn't exist
            setFormData({
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              phone: '',
              collegeCode: '',
              role: 'member',
              committee: 'general',
              skills: ''
            });
          }
          setInitialLoad(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load profile data. Please try again.');
          setInitialLoad(false);
        }
      }
    };
    
    fetchUserData();
  }, [currentUser, loading, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any previous error/success messages
    setError('');
    setSuccess('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Update Firebase Auth profile (only name can be updated here)
      await updateAuthProfile(formData.name);
      
      // Update Firestore profile (all other fields) using the same approach as in SignUp
      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        collegeCode: formData.collegeCode,
        role: formData.role,
        committee: formData.committee,
        skills: formData.skills,
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        profileComplete: true
      }, { merge: true });
      
      setSuccess('Profile updated successfully!');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button
          onClick={() => navigate(-1)}
          variant="text"
          size="sm"
          leftIcon={<FaArrowLeft />}
          className="mb-8"
        >
          Back
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="px-6 py-8 sm:px-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
              <p className="mt-2 text-gray-600">
                Update your profile information
              </p>
            </div>
            
            {initialLoad ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Error message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                    <div className="flex items-center">
                      <FaExclamationCircle className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}
                
                {/* Success message */}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                    <div className="flex items-center">
                      <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                )}
                
                {/* Name */}
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="john.doe@example.com"
                      disabled={currentUser?.providerData[0]?.providerId === 'google.com'}
                    />
                    {currentUser?.providerData[0]?.providerId === 'google.com' && (
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed for Google accounts
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Phone */}
                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                
                {/* College Code */}
                <div className="mb-6">
                  <label
                    htmlFor="collegeCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    College Code
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUniversity className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="collegeCode"
                      name="collegeCode"
                      type="text"
                      value={formData.collegeCode}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="COLLEGE123"
                    />
                  </div>
                </div>
                
                {/* Role */}
                <div className="mb-6">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="member">Member</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="head">Head</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                
                {/* Committee */}
                <div className="mb-6">
                  <label
                    htmlFor="committee"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Committee
                  </label>
                  <select
                    id="committee"
                    name="committee"
                    value={formData.committee}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="finance">Finance</option>
                    <option value="publicity">Publicity</option>
                  </select>
                </div>
                
                {/* Skills */}
                <div className="mb-6">
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Skills
                  </label>
                  <textarea
                    id="skills"
                    name="skills"
                    rows="3"
                    value={formData.skills}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="List your skills (e.g., graphic design, event coordination, social media marketing)"
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500">
                    This helps the AI assign you appropriate tasks
                  </p>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    variant="primary"
                    size="md"
                    leftIcon={!isSubmitting && <FaSave />}
                  >
                    {isSubmitting ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
