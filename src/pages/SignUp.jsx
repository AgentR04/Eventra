import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaUniversity, FaArrowLeft, FaIdCard, FaPhone } from 'react-icons/fa';

const SignUp = () => {
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    collegeCode: '',
    invitationCode: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    committee: '',
    skills: '',
    availability: [],
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isInvited, setIsInvited] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  // Parse query parameters for invitation links
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const email = params.get('email');
    const committee = params.get('committee');
    const role = params.get('role');
    
    if (code && email) {
      setFormData(prev => ({
        ...prev,
        collegeCode: code,
        email: email,
        committee: committee || '',
        role: role || ''
      }));
      setIsInvited(true);
    }
  }, [location]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!isInvited && !formData.collegeCode.trim()) {
      newErrors.collegeCode = 'College code is required';
    }
    
    if (!isInvited && !formData.invitationCode.trim()) {
      newErrors.invitationCode = 'Invitation code is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep3()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setRegistrationComplete(true);
        // In a real app, you would handle registration here
        console.log('Registration attempt with:', formData);
      }, 1500);
    }
  };
  
  const availabilityOptions = [
    { value: 'weekday-morning', label: 'Weekday Mornings' },
    { value: 'weekday-afternoon', label: 'Weekday Afternoons' },
    { value: 'weekday-evening', label: 'Weekday Evenings' },
    { value: 'weekend-morning', label: 'Weekend Mornings' },
    { value: 'weekend-afternoon', label: 'Weekend Afternoons' },
    { value: 'weekend-evening', label: 'Weekend Evenings' }
  ];
  
  const handleAvailabilityChange = (value) => {
    if (formData.availability.includes(value)) {
      setFormData(prev => ({
        ...prev,
        availability: prev.availability.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, value]
      }));
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary-dark mb-8">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {!registrationComplete ? (
            <div className="px-6 py-8 sm:px-10">
              <div className="text-center mb-8">
                <Link to="/" className="text-3xl font-bold text-primary">Eventra</Link>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  {isInvited ? 'Complete Your Registration' : 'Sign Up with Invitation'}
                </h2>
                <p className="mt-2 text-gray-600">
                  {isInvited 
                    ? 'You were invited to join a committee' 
                    : 'Enter your invitation details to join your college committee'}
                </p>
              </div>
              
              {/* Progress Steps */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex-1">
                  <div className={`h-2 rounded-l-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} mx-2`}>
                  1
                </div>
                <div className="flex-1">
                  <div className={`h-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} mx-2`}>
                  2
                </div>
                <div className="flex-1">
                  <div className={`h-2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} mx-2`}>
                  3
                </div>
                <div className="flex-1">
                  <div className={`h-2 rounded-r-full ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Step 1: Invitation Details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-dark mb-6">Invitation Details</h3>
                    
                    {!isInvited && (
                      <>
                        <div className="mb-6">
                          <label htmlFor="collegeCode" className="block text-sm font-medium text-gray-700 mb-1">College Code</label>
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
                              className={`block w-full pl-10 pr-3 py-3 border ${errors.collegeCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary uppercase`}
                              placeholder="e.g., SIES-TF2025"
                            />
                          </div>
                          {errors.collegeCode && <p className="mt-1 text-sm text-red-600">{errors.collegeCode}</p>}
                          <p className="mt-1 text-sm text-gray-500">Enter the college code provided by your committee admin</p>
                        </div>
                        
                        <div className="mb-6">
                          <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700 mb-1">Invitation Code</label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaIdCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="invitationCode"
                              name="invitationCode"
                              type="text"
                              value={formData.invitationCode}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-3 py-3 border ${errors.invitationCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                              placeholder="Enter your invitation code"
                            />
                          </div>
                          {errors.invitationCode && <p className="mt-1 text-sm text-red-600">{errors.invitationCode}</p>}
                        </div>
                      </>
                    )}
                    
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isInvited}
                          className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary ${isInvited ? 'bg-gray-100' : ''}`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                      {isInvited && <p className="mt-1 text-sm text-gray-500">Email is pre-filled from your invitation</p>}
                    </div>
                    
                    {isInvited && formData.committee && (
                      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h4 className="text-md font-medium text-blue-800 mb-2">Invitation Details</h4>
                        <p className="text-sm text-blue-600 mb-1">
                          <span className="font-medium">College Code:</span> {formData.collegeCode}
                        </p>
                        {formData.committee && (
                          <p className="text-sm text-blue-600 mb-1">
                            <span className="font-medium">Committee:</span> {formData.committee}
                          </p>
                        )}
                        {formData.role && (
                          <p className="text-sm text-blue-600">
                            <span className="font-medium">Role:</span> {formData.role}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`py-3 px-6 rounded-md text-white font-medium ${validateStep1() ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-300 cursor-not-allowed'} transition-colors duration-300`}
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 2: Personal Information */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-dark mb-6">Personal Information</h3>
                    
                    <div className="mb-6">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills (Optional)</label>
                      <textarea
                        id="skills"
                        name="skills"
                        rows="3"
                        value={formData.skills}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="List your skills (e.g., graphic design, event coordination, social media marketing)"
                      ></textarea>
                      <p className="mt-1 text-sm text-gray-500">This helps the AI assign you appropriate tasks</p>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Availability (Optional)</label>
                      <div className="grid grid-cols-2 gap-3">
                        {availabilityOptions.map(option => (
                          <label key={option.value} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.availability.includes(option.value)}
                              onChange={() => handleAvailabilityChange(option.value)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="ml-2 text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">This helps with scheduling and task assignments</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="py-3 px-6 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className={`py-3 px-6 rounded-md text-white font-medium ${validateStep2() ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-300 cursor-not-allowed'} transition-colors duration-300`}
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 3: Account Security */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-dark mb-6">Account Security</h3>
                    
                    <div className="mb-6">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center">
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${errors.agreeTerms ? 'border-red-500' : ''}`}
                        />
                        <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                          I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </label>
                      </div>
                      {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="py-3 px-6 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`py-3 px-6 rounded-md text-white font-medium ${!isSubmitting ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-300 cursor-not-allowed'} transition-colors duration-300`}
                      >
                        {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          ) : (
            <div className="px-6 py-12 sm:px-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-dark mb-4">Registration Successful!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your account has been created successfully. You can now log in to access your committee dashboard.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/login"
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
                >
                  Log In Now
                </Link>
                <Link
                  to="/"
                  className="bg-white border border-primary text-primary hover:bg-primary/5 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
