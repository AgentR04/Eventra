import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaEnvelope,
  FaGoogle,
  FaLock,
  FaUniversity,
} from "react-icons/fa";
import Button from "../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, signInWithGoogle } from "../firebase/auth";
import { useFirebase } from "../firebase/FirebaseContext";

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useFirebase();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState({
    collegeCode: "",
    email: "",
    password: "",
    rememberMe: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate form data
      if (!formData.collegeCode) {
        throw new Error("Please enter your college code");
      }
      
      if (!formData.email) {
        throw new Error("Please enter your email address");
      }
      
      if (!formData.password) {
        throw new Error("Please enter your password");
      }

      console.log("Attempting login with:", { 
        email: formData.email, 
        collegeCode: formData.collegeCode 
      });

      // Authenticate with Firebase
      const user = await loginUser(formData.email, formData.password);
      console.log("Login successful:", user.uid);

      // If successful, redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      
      // Provide more specific error messages based on Firebase error codes
      if (err.code === 'auth/user-not-found') {
        setError("No account found with this email address. Please check your email or sign up.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email format. Please enter a valid email address.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed login attempts. Please try again later or reset your password.");
      } else {
        setError(err.message || "Failed to login. Please check your credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8 dark">
      <div className="max-w-md mx-auto">
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
          className="bg-gray-800 rounded-xl shadow-xl overflow-hidden text-white"
        >
          <div className="px-6 py-8 sm:px-10">
            <div className="text-center mb-8">
              <Link to="/" className="text-3xl font-bold text-primary">
                Eventra
              </Link>
              <h2 className="mt-4 text-2xl font-bold text-white">
                Committee Member Login
              </h2>
              <p className="mt-2 text-gray-300">
                Sign in to access your committee dashboard
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="collegeCode"
                  className="block text-sm font-medium text-white"
                >
                  College Code
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUniversity className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="collegeCode"
                    name="collegeCode"
                    type="text"
                    required
                    value={formData.collegeCode}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm text-white"
                    placeholder="e.g., SIES-TF2025"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the code provided by your committee admin
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm text-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
                >
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary hover:text-primary-dark"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  leftIcon={<FaGoogle className="h-5 w-5 text-red-500" />}
                  onClick={async () => {
                    try {
                      setIsSubmitting(true);
                      setError("");
                      console.log("Attempting Google sign-in");
                      const user = await signInWithGoogle();
                      console.log("Google sign-in successful:", user.uid);
                      navigate("/dashboard");
                    } catch (err) {
                      console.error("Google sign-in error:", err);
                      if (err.code === 'auth/popup-closed-by-user') {
                        setError("Sign-in cancelled. Please try again.");
                      } else if (err.code === 'auth/popup-blocked') {
                        setError("Pop-up blocked by browser. Please allow pop-ups for this site.");
                      } else {
                        setError(err.message || "Failed to sign in with Google. Please try again.");
                      }
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Sign in with Google
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Sign up with invitation code
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
