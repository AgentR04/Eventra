import { useState } from "react";
import { FaBell, FaCheckCircle, FaRegClock } from "react-icons/fa";

const NotificationsPanel = ({ notifications = [] }) => {
  const [filter, setFilter] = useState("all"); // all, unread, important

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    if (filter === "important") return notification.important;
    return true;
  });

  const markAllAsRead = () => {
    // This would update the notifications in a real app
    console.log("Marking all notifications as read");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaBell className="text-primary mr-2" />
          Notifications
        </h3>
        <button 
          onClick={markAllAsRead}
          className="text-primary text-sm hover:underline"
        >
          Mark All Read
        </button>
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            filter === "unread"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-md ${
            filter === "important"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilter("important")}
        >
          Important
        </button>
      </div>

      {filteredNotifications.length > 0 ? (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex p-3 rounded-md ${
                notification.read ? "bg-white" : "bg-blue-50"
              } ${
                notification.important ? "border-l-4 border-yellow-500" : ""
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {notification.type === "alert" ? (
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                ) : notification.type === "update" ? (
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                ) : notification.type === "success" ? (
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                )}
              </div>
              <div className="ml-3 flex-grow">
                <p className="text-sm text-gray-800">
                  {notification.message}
                </p>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500 flex items-center">
                    <FaRegClock className="mr-1" size={10} />
                    {notification.time}
                  </p>
                  {notification.read && (
                    <p className="text-xs text-green-500 flex items-center">
                      <FaCheckCircle className="mr-1" size={10} />
                      Read
                    </p>
                  )}
                </div>
              </div>
              <div className="ml-2 flex flex-col space-y-2">
                <button className="text-xs text-primary hover:underline">
                  {notification.read ? "Mark unread" : "Mark read"}
                </button>
                {notification.actionable && (
                  <button className="text-xs text-primary hover:underline">
                    View
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaBell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p>No notifications found</p>
          {filter !== "all" && (
            <button 
              className="text-primary text-sm hover:underline mt-2"
              onClick={() => setFilter("all")}
            >
              View all notifications
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
