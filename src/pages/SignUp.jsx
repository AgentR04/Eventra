import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUniversity,
  FaUser
} from "react-icons/fa";
import Button from "../components/common/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFirebase } from "../firebase/FirebaseContext";

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, db } = useFirebase();

  const [formData, setFormData] = useState({
    collegeCode: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    committee: "",
    skills: "",
    availability: [],
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    signUpMethod: "", // 'google' or 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0); // Start with method selection (step 0)
  const [isInvited, setIsInvited] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Parse query parameters for invitation links
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const email = params.get("email");
    const committee = params.get("committee");
    const role = params.get("role");

    if (code && email) {
      setFormData((prev) => ({
        ...prev,
        collegeCode: code,
        email: email,
        committee: committee || "",
        role: role || "",
      }));
      setIsInvited(true);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!isInvited && !formData.collegeCode.trim()) {
      newErrors.collegeCode = "College code is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Only update errors when explicitly validating
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    // Only update errors when explicitly validating
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
    }

    // Only update errors when explicitly validating
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const nextStep = () => {
    if (step === 0) {
      // Method selection step doesn't need validation
      if (formData.signUpMethod) {
        setStep(1);
      } else {
        setErrors({ signUpMethod: "Please select a sign-up method" });
      }
    } else if (step === 1) {
      const validation = validateStep1();
      setErrors(validation.errors);
      if (validation.isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      const validation = validateStep2();
      setErrors(validation.errors);
      if (validation.isValid) {
        setStep(3);
      }
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleGoogleSignUp = async () => {
    try {
      setFormData((prev) => ({
        ...prev,
        signUpMethod: "google",
      }));

      // If we're just selecting the method, move to next step
      if (step === 0) {
        setStep(1);
        return;
      }

      // If we're at step 3 (final step), proceed with Google sign-up
      if (step === 3) {
        setIsSubmitting(true);
        const provider = new GoogleAuthProvider();
        // Add scopes for additional user information
        provider.addScope('profile');
        provider.addScope('email');
        
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Extract user information from Google profile
        const userName = user.displayName || formData.name;
        const userEmail = user.email;
        const userPhone = user.phoneNumber || formData.phone;

        // Save user data to Firestore with enhanced information
        const userData = await saveUserToFirestore(user.uid, userEmail, userName);
        
        // Log successful registration
        console.log("Google sign-up successful", userData);

        setIsSubmitting(false);
        setRegistrationComplete(true);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Google sign-up error:", error);

      // Handle specific errors
      if (error.code === "auth/popup-closed-by-user") {
        setErrors({ googleSignUp: "Sign-up was cancelled. Please try again." });
      } else if (error.code === "auth/popup-blocked") {
        setErrors({
          googleSignUp:
            "Pop-up was blocked by your browser. Please allow pop-ups for this site.",
        });
      } else {
        setErrors({ googleSignUp: `Error: ${error.message}` });
      }
    }
  };

  const handleEmailSignUp = () => {
    setFormData((prev) => ({
      ...prev,
      signUpMethod: "email",
    }));
    setStep(1);
  };

  // Function to save user data to Firestore
  const saveUserToFirestore = async (userId, email, name = formData.name) => {
    try {
      // Prepare user data with default values for any missing fields
      const userData = {
        uid: userId,
        email: email,
        name: name || "",
        phone: formData.phone || "",
        collegeCode: formData.collegeCode || "",
        role: formData.role || "",
        committee: formData.committee || "",
        skills: formData.skills || "",
        availability: formData.availability || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        signUpMethod: formData.signUpMethod,
        profileComplete: false, // Flag to track if profile is complete
        lastLogin: serverTimestamp(),
      };

      // Create a user document in Firestore
      await setDoc(doc(db, "users", userId), userData);

      console.log("User data saved to Firestore successfully");
      return userData; // Return the saved data for further use if needed
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
      throw error; // Re-throw to handle in the calling function
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.signUpMethod === "email") {
      const validation = validateStep3();
      setErrors(validation.errors);

      if (validation.isValid) {
        setIsSubmitting(true);

        try {
          // Create user with email and password
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );

          const user = userCredential.user;

          // Save additional user data to Firestore with enhanced information
          const userData = await saveUserToFirestore(user.uid, formData.email);
          
          // Log successful registration
          console.log("Email sign-up successful", userData);

          setIsSubmitting(false);
          setRegistrationComplete(true);

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } catch (error) {
          setIsSubmitting(false);
          console.error("Email registration error:", error);

          // Handle specific Firebase auth errors
          if (error.code === "auth/email-already-in-use") {
            setErrors({
              email:
                "This email is already registered. Please use a different email or try logging in.",
            });
          } else if (error.code === "auth/weak-password") {
            setErrors({
              password:
                "Password is too weak. Please choose a stronger password.",
            });
          } else {
            setErrors({ submit: `Registration failed: ${error.message}` });
          }
        }
      }
    } else if (formData.signUpMethod === "google") {
      // For Google sign-up, just check if terms are agreed
      if (!formData.agreeTerms) {
        setErrors({ agreeTerms: "You must agree to the terms and conditions" });
        return;
      }

      // Trigger Google sign-up process
      await handleGoogleSignUp();
    }
  };

  const availabilityOptions = [
    { value: "weekday-morning", label: "Weekday Mornings" },
    { value: "weekday-afternoon", label: "Weekday Afternoons" },
    { value: "weekday-evening", label: "Weekday Evenings" },
    { value: "weekend-morning", label: "Weekend Mornings" },
    { value: "weekend-afternoon", label: "Weekend Afternoons" },
    { value: "weekend-evening", label: "Weekend Evenings" },
  ];

  const handleAvailabilityChange = (value) => {
    if (formData.availability.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        availability: prev.availability.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, value],
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8 dark">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-8"
        >
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
                <Link to="/" className="text-3xl font-bold text-primary">
                  Eventra
                </Link>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  {isInvited
                    ? "Complete Your Registration"
                    : "Sign Up for an Account"}
                </h2>
                <p className="mt-2 text-gray-600">
                  {isInvited
                    ? "You were invited to join a committee"
                    : "Enter your college code to join your college committee"}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex-1">
                  <div
                    className={`h-2 rounded-l-full ${
                      step >= 1 ? "bg-primary" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  } mx-2`}
                >
                  1
                </div>
                <div className="flex-1">
                  <div
                    className={`h-2 ${
                      step >= 2 ? "bg-primary" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  } mx-2`}
                >
                  2
                </div>
                <div className="flex-1">
                  <div
                    className={`h-2 ${
                      step >= 3 ? "bg-primary" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  } mx-2`}
                >
                  3
                </div>
                <div className="flex-1">
                  <div
                    className={`h-2 ${
                      step >= 4 ? "bg-primary" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 4
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  } mx-2`}
                >
                  4
                </div>
                <div className="flex-1">
                  <div
                    className={`h-2 rounded-r-full ${
                      step >= 4 ? "bg-primary" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 0: Sign-up Method Selection */}
                {step === 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <h3 className="text-xl font-semibold text-dark mb-6">
                      Choose Sign-up Method
                    </h3>

                    <div className="space-y-6">
                      <Button
                        type="button"
                        onClick={handleGoogleSignUp}
                        variant="outline"
                        size="md"
                        fullWidth
                        leftIcon={<img src="/google-icon.png" alt="Google" className="h-5 w-5" />}
                      >
                        Sign up with Google
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">
                            Or
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={handleEmailSignUp}
                        variant="outline"
                        size="md"
                        fullWidth
                        leftIcon={<FaEnvelope className="h-5 w-5 text-gray-500" />}
                      >
                        Sign up with Email
                      </Button>
                    </div>

                    {errors.signUpMethod && (
                      <p className="mt-4 text-sm text-red-600">
                        {errors.signUpMethod}
                      </p>
                    )}

                    <div className="mt-8 text-sm text-gray-500">
                      <p>
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="text-primary hover:underline"
                        >
                          Log in
                        </Link>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Invitation Details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-dark mb-6">
                      Invitation Details
                    </h3>

                    {!isInvited && (
                      <>
                        <div className="mb-8">
                          <label
                            htmlFor="collegeCode"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            College Code
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaUniversity className="h-5 w-5 text-primary" />
                            </div>
                            <input
                              id="collegeCode"
                              name="collegeCode"
                              type="text"
                              value={formData.collegeCode}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-3 py-3 border-2 ${
                                errors.collegeCode
                                  ? "border-red-500"
                                  : "border-primary border-opacity-50"
                              } rounded-md focus:outline-none focus:ring-primary focus:border-primary uppercase font-medium`}
                              placeholder="e.g., SIES-TF2025"
                            />
                          </div>
                          {errors.collegeCode && (
                            <p className="mt-2 text-sm text-red-600 font-medium">
                              {errors.collegeCode}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-gray-600">
                            Enter the college code provided by your committee
                            admin
                          </p>
                        </div>
                      </>
                    )}

                    <div className="mb-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email address
                      </label>
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
                          className={`block w-full pl-10 pr-3 py-3 border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-primary focus:border-primary ${
                            isInvited ? "bg-gray-100" : ""
                          }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                      {isInvited && (
                        <p className="mt-1 text-sm text-gray-500">
                          Email is pre-filled from your invitation
                        </p>
                      )}
                    </div>

                    {isInvited && formData.committee && (
                      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h4 className="text-md font-medium text-blue-800 mb-2">
                          Invitation Details
                        </h4>
                        <p className="text-sm text-blue-600 mb-1">
                          <span className="font-medium">College Code:</span>{" "}
                          {formData.collegeCode}
                        </p>
                        {formData.committee && (
                          <p className="text-sm text-blue-600 mb-1">
                            <span className="font-medium">Committee:</span>{" "}
                            {formData.committee}
                          </p>
                        )}
                        {formData.role && (
                          <p className="text-sm text-blue-600">
                            <span className="font-medium">Role:</span>{" "}
                            {formData.role}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between mt-8">
                      {step > 0 && (
                        <Button
                          type="button"
                          onClick={prevStep}
                          variant="outline"
                          size="md"
                          leftIcon={<FaArrowLeft size={14} />}
                        >
                          Back
                        </Button>
                      )}
                      <div className={step === 0 ? "w-full flex justify-end" : ""}>
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={!validateStep1()}
                          variant="primary"
                          size="md"
                          className="min-w-[120px]"
                        >
                          Next Step
                        </Button>
                      </div>
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
                    <h3 className="text-xl font-semibold text-dark mb-6">
                      Personal Information
                    </h3>

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
                          autoComplete="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

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
                          autoComplete="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="skills"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Skills (Optional)
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

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability (Optional)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {availabilityOptions.map((option) => (
                          <label
                            key={option.value}
                            className="inline-flex items-center"
                          >
                            <input
                              type="checkbox"
                              checked={formData.availability.includes(
                                option.value
                              )}
                              onChange={() =>
                                handleAvailabilityChange(option.value)
                              }
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="ml-2 text-gray-700">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        This helps with scheduling and task assignments
                      </p>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        size="md"
                        leftIcon={<FaArrowLeft size={14} />}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep2()}
                        variant="primary"
                        size="md"
                        className="min-w-[120px]"
                      >
                        Next Step
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Account Security (only for email sign-up) */}
                {step === 3 && formData.signUpMethod === "email" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-dark mb-6">
                      Account Security
                    </h3>

                    <div className="mb-6">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
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
                          className={`block w-full pl-10 pr-3 py-3 border ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm Password
                      </label>
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
                          className={`block w-full pl-10 pr-3 py-3 border ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center">
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
                            errors.agreeTerms ? "border-red-500" : ""
                          }`}
                        />
                        <label
                          htmlFor="agreeTerms"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            className="text-primary hover:underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            className="text-primary hover:underline"
                          >
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      {errors.agreeTerms && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.agreeTerms}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between mt-8">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        size="md"
                        leftIcon={<FaArrowLeft size={14} />}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        variant="primary"
                        size="md"
                        className="min-w-[180px]"
                      >
                        {isSubmitting ? "Processing..." : "Complete Registration"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Final Step for Google Sign-up */}
                {step === 3 && formData.signUpMethod === "google" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold text-dark mb-6">
                      Terms & Conditions
                    </h3>

                    <div className="mb-6 p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600 mb-4">
                        By completing registration, you agree to our Terms of
                        Service and Privacy Policy.
                      </p>

                      <div className="flex items-start mb-4">
                        <div className="flex items-center h-5">
                          <input
                            id="agreeTerms"
                            name="agreeTerms"
                            type="checkbox"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="agreeTerms"
                            className="font-medium text-gray-700"
                          >
                            I agree to the{" "}
                            <a
                              href="#"
                              className="text-primary hover:underline"
                            >
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                              href="#"
                              className="text-primary hover:underline"
                            >
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                      </div>
                      {errors.agreeTerms && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.agreeTerms}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        size="md"
                        leftIcon={<FaArrowLeft size={14} />}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !formData.agreeTerms}
                        isLoading={isSubmitting}
                        variant="primary"
                        size="md"
                        className="min-w-[180px]"
                      >
                        {isSubmitting ? "Processing..." : "Complete with Google"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          ) : (
            <div className="px-6 py-12 sm:px-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-dark mb-4">
                Registration Successful!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your account has been created successfully and your data has
                been saved to Firebase. You are now logged in and will be
                redirected to your dashboard shortly.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
                >
                  Go to Dashboard
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
