import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../../firebase/FirebaseContext";
import Button from "../common/Button";

const Navbar = () => {
  const { currentUser, auth, loading } = useFirebase();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    photoURL: null,
  });

  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.displayName || "User",
        photoURL: currentUser.photoURL,
      });
    }
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 shadow-md fixed w-full z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-primary font-bold text-2xl"
              >
                Eventra
              </motion.div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary font-medium transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-gray-700 hover:text-primary font-medium transition-colors duration-300"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary font-medium transition-colors duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary font-medium transition-colors duration-300"
            >
              Contact
            </Link>

            {!loading &&
              (currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary font-medium transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-2">
                    {userData.photoURL ? (
                      <img
                        src={userData.photoURL}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        {userData.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {userData.name}
                      </span>
                      <Button
                        onClick={handleSignOut}
                        variant="text"
                        size="sm"
                        className="text-xs text-red-500 hover:text-red-700 text-left p-0 m-0 min-h-0 justify-start"
                      >
                        Sign out
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    Login
                  </Button>
                </Link>
              ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              onClick={toggleMenu}
              variant="text"
              size="sm"
              className="p-2 text-gray-700 hover:text-primary"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              Contact
            </Link>

            {!loading &&
              (currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <div className="px-3 py-2 flex items-center">
                    {userData.photoURL ? (
                      <img
                        src={userData.photoURL}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">
                        {userData.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {userData.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-blue-600"
                >
                  Login
                </Link>
              ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
