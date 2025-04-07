import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { FaBell, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const DashboardHeader = ({
  userData,
  auth,
  notifications = [],
  activeTab,
  setActiveTab,
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  // Default to dark mode if no preference exists
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true' || localStorage.getItem('darkMode') === null);

  useEffect(() => {
    // Apply dark mode class to html element
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-gray-800 shadow-md text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Eventra Logo"
              className="h-10 w-auto mr-3"
            />
            <h1 className="text-2xl font-bold text-primary dark:text-primary-300">Eventra</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-xl text-yellow-400" />
              ) : (
                <FaMoon className="text-xl" />
              )}
            </button>
            <div className="relative">
              <button
                className="p-2 text-gray-600 hover:text-primary relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell className="text-xl" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">
                        Notifications
                      </h3>
                      <button className="text-sm text-primary hover:underline">
                        Mark All Read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-3 border-b border-gray-100 hover:bg-gray-50"
                        >
                          <p className="text-sm text-gray-800">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-200 text-center">
                    <Link
                      to="/notifications"
                      className="text-sm text-primary hover:underline"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <div className="mr-3 text-right">
                <p className="font-medium text-gray-800">{userData.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {userData.role} • {userData.committee}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt={userData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {userData.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:text-primary"
              title="Sign Out"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
