import { Link } from "react-router-dom";

const DashboardOverview = ({
  upcomingEvents = [],
  tasks = [],
  notifications = [],
  committees = [],
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 dark:bg-gray-800 dark:text-white">
      <div className="bg-gray-800 rounded-lg shadow-md p-6 ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
          <Link to="/events" className="text-primary text-sm hover:underline">
            View All
          </Link>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="border-l-4 border-primary pl-4 py-2"
              >
                <h4 className="font-medium text-white">{event.name}</h4>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-300">{event.date}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center py-4">No upcoming events</p>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">My Tasks</h3>
          <Link to="/tasks" className="text-primary text-sm hover:underline">
            View All
          </Link>
        </div>
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.status === "Completed"}
                  className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <div className="ml-3 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      task.status === "Completed"
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">Due: {task.deadline}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center py-4">No tasks assigned</p>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <button className="text-primary text-sm hover:underline">
            Mark All Read
          </button>
        </div>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex dark:text-white">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-800 dark:text-white">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center py-4">No new notifications</p>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Committees</h3>
          <Link
            to="/committees"
            className="text-primary text-sm hover:underline"
          >
            Manage
          </Link>
        </div>
        <div className="space-y-3">
          {committees.map((committee) => (
            <div
              key={committee.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md"
            >
              <div>
                <h4 className="font-medium text-white">{committee.name}</h4>
                <p className="text-xs text-gray-500">
                  {committee.members} members
                </p>
              </div>
              <div className="text-sm text-gray-600">
                {committee.events} event
                {committee.events !== 1 ? "s" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
