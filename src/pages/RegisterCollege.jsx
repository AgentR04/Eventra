import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUniversity, FaCalendarAlt, FaUsers, FaEnvelope, FaArrowLeft, FaCheck } from 'react-icons/fa';

const RegisterCollege = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    collegeName: '',
    festName: '',
    startDate: '',
    endDate: '',
    committeeCount: '',
    eventCount: '',
    festMode: 'on-campus',
    classroomCount: '',
    auditoriumCount: '',
    footfallStrength: '',
    floorCount: '',
    agreeTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [collegeCode, setCollegeCode] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setRegistrationComplete(true);
      
      // Generate college code based on college name and fest name
      const collegePrefix = formData.collegeName.split(' ')[0].substring(0, 4).toUpperCase();
      const festPrefix = formData.festName.split(' ')[0].substring(0, 2).toUpperCase();
      const year = new Date().getFullYear();
      const generatedCode = `${collegePrefix}-${festPrefix}${year}`;
      setCollegeCode(generatedCode);
      
      // In a real app, you would submit the form data to your backend here
      console.log('Registration data:', formData);
    }, 1500);
  };
  
  // Form validation for each step
  const validateStep1 = () => {
    return formData.email.trim() !== '' && 
           formData.collegeName.trim() !== '' && 
           formData.festName.trim() !== '';
  };
  
  const validateStep2 = () => {
    return formData.startDate !== '' && 
           formData.endDate !== '' && 
           formData.committeeCount !== '' && 
           formData.eventCount !== '' &&
           (formData.festMode !== 'on-campus' || (
             formData.classroomCount !== '' &&
             formData.auditoriumCount !== '' &&
             formData.footfallStrength !== '' &&
             formData.floorCount !== ''
           ));
  };
  
  const validateStep3 = () => {
    return formData.agreeTerms;
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
                <h2 className="text-3xl font-bold text-dark">Register Your College/Committee</h2>
                <p className="mt-2 text-gray-600">Set up your college fest on Eventra</p>
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
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-dark mb-6">Basic Information</h3>
                    
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Official Committee Gmail</label>
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
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="techfest2025@gmail.com"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">This will be used for all official communications</p>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUniversity className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="collegeName"
                          name="collegeName"
                          type="text"
                          required
                          value={formData.collegeName}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="e.g., SIES College of Engineering"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="festName" className="block text-sm font-medium text-gray-700 mb-1">Fest Name</label>
                      <input
                        id="festName"
                        name="festName"
                        type="text"
                        required
                        value={formData.festName}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="e.g., TechFest 2025"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep1()}
                        className={`py-3 px-6 rounded-md text-white font-medium ${validateStep1() ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-300 cursor-not-allowed'} transition-colors duration-300`}
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 2: Event Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-dark mb-6">Event Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="startDate"
                            name="startDate"
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="endDate"
                            name="endDate"
                            type="date"
                            required
                            value={formData.endDate}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="committeeCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Committees</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUsers className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="committeeCount"
                            name="committeeCount"
                            type="number"
                            min="1"
                            required
                            value={formData.committeeCount}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="e.g., 5"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="eventCount" className="block text-sm font-medium text-gray-700 mb-1">Approx. Number of Events</label>
                        <input
                          id="eventCount"
                          name="eventCount"
                          type="number"
                          min="1"
                          required
                          value={formData.eventCount}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="e.g., 15"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fest Mode</label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="festMode"
                            value="on-campus"
                            checked={formData.festMode === 'on-campus'}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">On-Campus</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="festMode"
                            value="online"
                            checked={formData.festMode === 'online'}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">Online</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="festMode"
                            value="hybrid"
                            checked={formData.festMode === 'hybrid'}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">Hybrid</span>
                        </label>
                      </div>
                    </div>
                    
                    {(formData.festMode === 'on-campus' || formData.festMode === 'hybrid') && (
                      <div className="mb-6 bg-blue-50 p-4 rounded-md">
                        <h4 className="text-md font-medium text-blue-800 mb-3">Venue Information</h4>
                        <p className="text-sm text-blue-600 mb-4">This information will help us with event allocation and scheduling.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <label htmlFor="classroomCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Classrooms</label>
                            <input
                              id="classroomCount"
                              name="classroomCount"
                              type="number"
                              min="0"
                              required={formData.festMode === 'on-campus' || formData.festMode === 'hybrid'}
                              value={formData.classroomCount}
                              onChange={handleChange}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="e.g., 30"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="auditoriumCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Auditoriums</label>
                            <input
                              id="auditoriumCount"
                              name="auditoriumCount"
                              type="number"
                              min="0"
                              required={formData.festMode === 'on-campus' || formData.festMode === 'hybrid'}
                              value={formData.auditoriumCount}
                              onChange={handleChange}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="e.g., 2"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="footfallStrength" className="block text-sm font-medium text-gray-700 mb-1">Expected Footfall Strength</label>
                            <input
                              id="footfallStrength"
                              name="footfallStrength"
                              type="number"
                              min="0"
                              required={formData.festMode === 'on-campus' || formData.festMode === 'hybrid'}
                              value={formData.footfallStrength}
                              onChange={handleChange}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="e.g., 1000"
                            />
                            <p className="mt-1 text-xs text-gray-500">Approximate number of attendees expected</p>
                          </div>
                          
                          <div>
                            <label htmlFor="floorCount" className="block text-sm font-medium text-gray-700 mb-1">Number of Floors</label>
                            <input
                              id="floorCount"
                              name="floorCount"
                              type="number"
                              min="1"
                              required={formData.festMode === 'on-campus' || formData.festMode === 'hybrid'}
                              value={formData.floorCount}
                              onChange={handleChange}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="e.g., 5"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
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
                        disabled={!validateStep2()}
                        className={`py-3 px-6 rounded-md text-white font-medium ${validateStep2() ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-300 cursor-not-allowed'} transition-colors duration-300`}
                      >
                        Next Step
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 3: Review & Submit */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-dark mb-6">Review & Submit</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-dark mb-4">Registration Summary</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">College Name</p>
                          <p className="font-medium">{formData.collegeName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fest Name</p>
                          <p className="font-medium">{formData.festName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fest Mode</p>
                          <p className="font-medium capitalize">{formData.festMode}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fest Dates</p>
                          <p className="font-medium">{formData.startDate} to {formData.endDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Committees / Events</p>
                          <p className="font-medium">{formData.committeeCount} committees, {formData.eventCount} events</p>
                        </div>
                        
                        {(formData.festMode === 'on-campus' || formData.festMode === 'hybrid') && (
                          <>
                            <div className="col-span-2">
                              <h5 className="font-medium text-gray-700 mb-2 mt-2">Venue Information</h5>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Classrooms</p>
                              <p className="font-medium">{formData.classroomCount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Auditoriums</p>
                              <p className="font-medium">{formData.auditoriumCount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Expected Footfall</p>
                              <p className="font-medium">{formData.footfallStrength} attendees</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Number of Floors</p>
                              <p className="font-medium">{formData.floorCount}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center">
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          required
                        />
                        <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                          I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </label>
                      </div>
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
                        disabled={isSubmitting || !validateStep3()}
                        className={`py-3 px-6 rounded-md text-white font-medium ${!isSubmitting && validateStep3() ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-300 cursor-not-allowed'} transition-colors duration-300`}
                      >
                        {isSubmitting ? 'Registering...' : 'Complete Registration'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          ) : (
            <div className="px-6 py-12 sm:px-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="text-green-500 text-3xl" />
              </div>
              
              <h2 className="text-3xl font-bold text-dark mb-4">Registration Successful!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your college has been successfully registered on Eventra.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
                <h3 className="font-semibold text-dark mb-2">Your College Code</h3>
                <div className="text-2xl font-bold text-primary mb-2">{collegeCode}</div>
                <p className="text-sm text-gray-500 mb-4">
                  Share this code with your committee members to join your organization.
                </p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(collegeCode)}
                  className="text-sm text-primary hover:text-primary-dark font-medium"
                >
                  Copy to clipboard
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/setup-committees"
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
                >
                  Set Up Committees
                </Link>
                <Link
                  to="/dashboard"
                  className="bg-white border border-primary text-primary hover:bg-primary/5 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterCollege;
