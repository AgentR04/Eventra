import { useEffect, useState } from "react";
import {
  FaBrain,
  FaCheckCircle,
  FaColumns,
  FaExchangeAlt,
  FaHourglassHalf,
  FaLink,
  FaListUl,
  FaRegClock,
  FaRegLightbulb,
  FaRobot,
  FaUserClock,
  FaUserFriends,
} from "react-icons/fa";
import TaskAI from "../TaskAI";

// Mock tasks data for testing
const mockTasks = [
  {
    id: "task1",
    title: "Design event poster",
    description:
      "Create a visually appealing poster for the upcoming Tech Conference",
    status: "Not Started",
    priority: "High",
    deadline: "June 5, 2023",
    estimatedHours: 6,
    assignedTo: [],
    createdBy: "user1",
    createdAt: "May 15, 2023",
    requiredSkills: ["Graphic Design", "Creativity", "Adobe Photoshop"],
    dependencies: [],
    committee: "Tech Committee",
    event: "Annual Tech Conference",
  },
  {
    id: "task11",
    title: "Create event schedule",
    description:
      "Develop a detailed schedule for the Tech Conference with session timings",
    status: "Completed",
    priority: "High",
    deadline: "May 25, 2023",
    estimatedHours: 4,
    assignedTo: ["user3"],
    createdBy: "user1",
    createdAt: "May 10, 2023",
    completedDate: "May 24, 2023",
    requiredSkills: ["Planning", "Organization", "Attention to Detail"],
    dependencies: [],
    committee: "Tech Committee",
    event: "Annual Tech Conference",
  },
  {
    id: "task2",
    title: "Book venue for Hackathon",
    description: "Secure the Computer Science Building for the Hackathon event",
    status: "In Progress",
    priority: "High",
    deadline: "June 1, 2023",
    estimatedHours: 3,
    assignedTo: ["user2"],
    createdBy: "user1",
    createdAt: "May 10, 2023",
    requiredSkills: ["Communication", "Negotiation", "Planning"],
    dependencies: [],
    committee: "Tech Committee",
    event: "Hackathon 2023",
  },
  {
    id: "task3",
    title: "Prepare budget proposal",
    description: "Create a detailed budget proposal for the Cultural Festival",
    status: "Not Started",
    priority: "Medium",
    deadline: "June 10, 2023",
    estimatedHours: 8,
    assignedTo: [],
    createdBy: "user3",
    createdAt: "May 18, 2023",
    requiredSkills: ["Budgeting", "Excel", "Financial Planning"],
    dependencies: [],
    committee: "Cultural Committee",
    event: "Cultural Festival",
  },
  {
    id: "task4",
    title: "Coordinate with speakers",
    description:
      "Reach out to potential speakers for the Tech Conference and confirm their participation",
    status: "Not Started",
    priority: "Medium",
    deadline: "June 8, 2023",
    estimatedHours: 10,
    assignedTo: [],
    createdBy: "user1",
    createdAt: "May 20, 2023",
    requiredSkills: ["Communication", "Networking", "Event Planning"],
    dependencies: [],
    committee: "Tech Committee",
    event: "Annual Tech Conference",
  },
  {
    id: "task5",
    title: "Create registration form",
    description:
      "Develop an online registration form for the Hackathon participants",
    status: "Not Started",
    priority: "High",
    deadline: "June 3, 2023",
    estimatedHours: 4,
    assignedTo: [],
    createdBy: "user2",
    createdAt: "May 22, 2023",
    requiredSkills: ["Web Development", "Form Design", "UI/UX"],
    dependencies: [],
    committee: "Tech Committee",
    event: "Hackathon 2023",
  },
  {
    id: "task6",
    title: "Arrange catering",
    description: "Find and book a catering service for the Alumni Meetup",
    status: "Not Started",
    priority: "Low",
    deadline: "July 15, 2023",
    estimatedHours: 5,
    assignedTo: [],
    createdBy: "user4",
    createdAt: "May 25, 2023",
    requiredSkills: ["Negotiation", "Food Planning", "Budgeting"],
    dependencies: [],
    committee: "Alumni Relations",
    event: "Alumni Meetup",
  },
  {
    id: "task7",
    title: "Design event website",
    description:
      "Create a website for the Career Fair with company profiles and schedule",
    status: "Not Started",
    priority: "Medium",
    deadline: "June 20, 2023",
    estimatedHours: 15,
    assignedTo: [],
    createdBy: "user3",
    createdAt: "May 23, 2023",
    requiredSkills: [
      "Web Development",
      "UI/UX Design",
      "HTML/CSS",
      "JavaScript",
    ],
    dependencies: [],
    committee: "Placement Committee",
    event: "Career Fair",
  },
  {
    id: "task8",
    title: "Organize volunteer team",
    description: "Recruit and organize volunteers for the Cultural Festival",
    status: "In Progress",
    priority: "Medium",
    deadline: "June 25, 2023",
    estimatedHours: 8,
    assignedTo: ["user5"],
    createdBy: "user3",
    createdAt: "May 19, 2023",
    requiredSkills: ["Leadership", "Team Management", "Communication"],
    dependencies: [],
    committee: "Cultural Committee",
    event: "Cultural Festival",
  },
  {
    id: "task9",
    title: "Set up equipment",
    description:
      "Arrange and test audio-visual equipment for the Tech Conference",
    status: "Not Started",
    priority: "High",
    deadline: "June 14, 2023",
    estimatedHours: 6,
    assignedTo: [],
    createdBy: "user1",
    createdAt: "May 26, 2023",
    requiredSkills: ["Technical Knowledge", "AV Equipment", "Troubleshooting"],
    dependencies: ["task1"],
    committee: "Tech Committee",
    event: "Annual Tech Conference",
  },
  {
    id: "task10",
    title: "Prepare marketing materials",
    description:
      "Create social media posts, flyers, and email templates for the Career Fair",
    status: "Not Started",
    priority: "Medium",
    deadline: "June 15, 2023",
    estimatedHours: 10,
    assignedTo: [],
    createdBy: "user4",
    createdAt: "May 24, 2023",
    requiredSkills: ["Marketing", "Copywriting", "Graphic Design"],
    dependencies: [],
    committee: "Placement Committee",
    event: "Career Fair",
  },
  {
    id: "task12",
    title: "Reserve parking spaces",
    description:
      "Coordinate with campus security to reserve parking for event speakers and VIPs",
    status: "Completed",
    priority: "Medium",
    deadline: "May 30, 2023",
    estimatedHours: 3,
    assignedTo: ["user2"],
    createdBy: "user1",
    createdAt: "May 15, 2023",
    completedDate: "May 28, 2023",
    requiredSkills: ["Communication", "Logistics", "Planning"],
    dependencies: [],
    committee: "Tech Committee",
    event: "Annual Tech Conference",
  },
];

// Mock team members data for testing
const mockTeamMembers = [
  {
    id: "user1",
    name: "John Doe",
    role: "Tech Lead",
    committee: "Tech Committee",
    skills: ["Web Development", "Project Management", "UI/UX Design"],
    currentTasks: ["task2"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    performanceRating: 9,
    specialization: "Frontend Development",
  },
  {
    id: "user2",
    name: "Jane Smith",
    role: "Event Coordinator",
    committee: "Cultural Committee",
    skills: ["Event Planning", "Communication", "Budgeting", "Negotiation"],
    currentTasks: ["task2"],
    availability: ["Monday", "Wednesday", "Friday"],
    performanceRating: 8,
    specialization: "Event Management",
  },
  {
    id: "user3",
    name: "Michael Brown",
    role: "Designer",
    committee: "Tech Committee",
    skills: ["Graphic Design", "Adobe Photoshop", "Illustration", "Creativity"],
    currentTasks: [],
    availability: ["Tuesday", "Thursday", "Friday"],
    performanceRating: 7,
    specialization: "Visual Design",
  },
  {
    id: "user4",
    name: "Sarah Johnson",
    role: "Marketing Specialist",
    committee: "Placement Committee",
    skills: ["Marketing", "Social Media", "Copywriting", "Content Creation"],
    currentTasks: [],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    performanceRating: 8,
    specialization: "Digital Marketing",
  },
  {
    id: "user5",
    name: "David Wilson",
    role: "Developer",
    committee: "Tech Committee",
    skills: ["Web Development", "JavaScript", "React", "Node.js"],
    currentTasks: ["task8"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    performanceRating: 9,
    specialization: "Full Stack Development",
  },
  {
    id: "user6",
    name: "Emily Davis",
    role: "Finance Coordinator",
    committee: "Cultural Committee",
    skills: ["Budgeting", "Financial Planning", "Excel", "Accounting"],
    currentTasks: [],
    availability: ["Wednesday", "Thursday", "Friday"],
    performanceRating: 8,
    specialization: "Financial Management",
  },
  {
    id: "user7",
    name: "Robert Miller",
    role: "Content Creator",
    committee: "Placement Committee",
    skills: ["Content Writing", "Editing", "Research", "Social Media"],
    currentTasks: [],
    availability: ["Monday", "Tuesday", "Friday"],
    performanceRating: 7,
    specialization: "Content Strategy",
  },
  {
    id: "user8",
    name: "Lisa Anderson",
    role: "UI/UX Designer",
    committee: "Tech Committee",
    skills: ["UI/UX Design", "Wireframing", "Prototyping", "User Research"],
    currentTasks: [],
    availability: ["Tuesday", "Wednesday", "Thursday"],
    performanceRating: 9,
    specialization: "User Experience",
  },
];

const TaskManagement = ({
  tasks: propTasks,
  teamMembers: propTeamMembers,
  handleAssignTask: propHandleAssignTask,
  taskRecommendations = [],
}) => {
  // Use mock data if no props are provided
  const [localTasks, setLocalTasks] = useState([]);
  const [localTeamMembers, setLocalTeamMembers] = useState([]);
  const [taskManagementView, setTaskManagementView] = useState("kanban"); // 'kanban', 'team', 'analytics', 'ai'
  const [showTaskAISuggestions, setShowTaskAISuggestions] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Initialize with mock data if props are not provided
  useEffect(() => {
    setLocalTasks(propTasks?.length > 0 ? propTasks : mockTasks);
    setLocalTeamMembers(
      propTeamMembers?.length > 0 ? propTeamMembers : mockTeamMembers
    );
  }, [propTasks, propTeamMembers]);

  // Helper functions
  const getTasksByStatus = (status) => {
    return localTasks.filter((task) => task.status === status);
  };

  const getTeamMember = (id) => {
    return localTeamMembers.find((member) => member.id === id);
  };

  const canTaskBeStarted = (taskId) => {
    const task = localTasks.find((t) => t.id === taskId);
    if (!task || !task.dependencies || task.dependencies.length === 0)
      return true;

    return task.dependencies.every((depId) => {
      const depTask = localTasks.find((t) => t.id === depId);
      return depTask && depTask.status === "Completed";
    });
  };

  // Handle task assignment (local implementation if prop not provided)
  const handleAssignTask = (taskId, assignedToIds) => {
    if (propHandleAssignTask) {
      propHandleAssignTask(taskId, assignedToIds);
    } else {
      // Local implementation
      setLocalTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, assignedTo: assignedToIds, status: "In Progress" }
            : task
        )
      );
      setIsAIProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Based Team & Task Management Header */}
      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:text-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold dark:text-white flex items-center">
              <FaBrain className="text-primary mr-2" />
              AI-Based Team & Task Management
            </h3>
            <p className="text-gray-600 mt-1 dark:text-gray-300">
              Intelligent task assignment and team management with NLP
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-2 text-sm rounded-md flex items-center ${
                taskManagementView === "kanban"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setTaskManagementView("kanban")}
            >
              <FaColumns className="mr-1" /> Kanban Board
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-md flex items-center ${
                taskManagementView === "team"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setTaskManagementView("team")}
            >
              <FaUserFriends className="mr-1" /> Team Members
            </button>
            <button
              className={`px-3 py-2 text-sm rounded-md flex items-center ${
                taskManagementView === "ai"
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => setTaskManagementView("ai")}
            >
              <FaRobot className="mr-1" /> AI Task Allocation
            </button>
            <button
              className="px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              onClick={() => setShowTaskAISuggestions(!showTaskAISuggestions)}
            >
              <FaRegLightbulb className="mr-1 text-yellow-500" /> AI
              Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* AI Task Allocation Section */}
      {taskManagementView === "ai" && (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 text-white dark:bg-gray-800 dark:text-white">
          <h4 className="font-medium text-white flex items-center mb-4">
            <FaRobot className="text-primary mr-2" />
            AI-Powered Task Allocation
          </h4>

          {isAIProcessing ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="ml-3 text-gray-300">Processing with AI...</p>
            </div>
          ) : (
            <TaskAI
              tasks={localTasks}
              teamMembers={localTeamMembers}
              onAssignTask={handleAssignTask}
              onSelectTask={setSelectedTask}
              selectedTask={selectedTask}
              setIsProcessing={setIsAIProcessing}
              currentUser={{ uid: localTeamMembers[0]?.id }}
            />
          )}
        </div>
      )}

      {/* AI Task Recommendations Panel */}
      {showTaskAISuggestions && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-md p-4 dark:bg-gray-800 dark:text-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
              <FaBrain className="text-yellow-500 mr-2" />
              AI-Powered Task Recommendations
            </h4>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowTaskAISuggestions(false)}
            >
              &times;
            </button>
          </div>
          <div className="space-y-3">
            {taskRecommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="flex items-start bg-white bg-opacity-60 p-3 rounded-md dark:bg-gray-800 dark:text-white dark:bg-opacity-60"
              >
                <div className="flex-shrink-0 mt-1">
                  {recommendation.type === "reassignment" && (
                    <FaExchangeAlt className="text-blue-500" />
                  )}
                  {recommendation.type === "workload" && (
                    <FaUserClock className="text-orange-500" />
                  )}
                  {recommendation.type === "deadline" && (
                    <FaRegClock className="text-red-500" />
                  )}
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {recommendation.type} Recommendation
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        recommendation.confidence === "high"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {recommendation.confidence} confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {recommendation.reason}
                  </p>
                  <p className="text-sm font-medium text-primary mt-1">
                    {recommendation.suggestion}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Impact: {recommendation.impact}
                  </p>
                  <div className="mt-2 flex justify-end space-x-2">
                    <button className="px-3 py-1 text-xs rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                      Ignore
                    </button>
                    <button className="px-3 py-1 text-xs rounded-md bg-primary text-white hover:bg-primary-dark">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban Board View */}
      {taskManagementView === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To-Do Column */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:text-white">
            <div className="bg-gray-50 p-4 border-b border-gray-200 dark:bg-gray-800 dark:text-white">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                <FaListUl className="text-gray-500 mr-2" />
                To-Do
                <span className="ml-2 bg-gray-200 text-gray-700 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTasksByStatus("Not Started").length}
                </span>
              </h4>
            </div>
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {getTasksByStatus("Not Started").map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200">
                      {task.title}
                    </h5>
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
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      {task.assignedTo && task.assignedTo.length > 0 ? (
                        <>
                          <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                            {getTeamMember(task.assignedTo[0])?.name?.charAt(
                              0
                            ) || "?"}
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {getTeamMember(task.assignedTo[0])?.name ||
                              "Unknown"}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="h-6 w-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
                            ?
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            Unassigned
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Due: {task.deadline}
                    </span>
                  </div>
                  {task.dependencies &&
                    task.dependencies.length > 0 &&
                    !canTaskBeStarted(task.id) && (
                      <div className="mt-2 text-xs text-red-500 flex items-center">
                        <FaLink className="mr-1" /> Waiting on dependencies
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:text-white">
            <div className="bg-gray-50 p-4 border-b border-gray-200 dark:bg-gray-800 dark:text-white">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                <FaHourglassHalf className="text-blue-500 mr-2" />r In Progressr
                <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-200 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTasksByStatus("In Progress").length}
                </span>
              </h4>
            </div>
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {getTasksByStatus("In Progress").map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200">
                      {task.title}
                    </h5>
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
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      {task.assignedTo && task.assignedTo.length > 0 ? (
                        <>
                          <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                            {getTeamMember(task.assignedTo[0])?.name?.charAt(
                              0
                            ) || "?"}
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {getTeamMember(task.assignedTo[0])?.name ||
                              "Unknown"}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="h-6 w-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
                            ?
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            Unassigned
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Due: {task.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:text-white">
            <div className="bg-gray-50 p-4 border-b border-gray-200 dark:bg-gray-800 dark:text-white">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                Completed
                <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-200 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTasksByStatus("Completed").length}
                </span>
              </h4>
            </div>
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {getTasksByStatus("Completed").map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow  dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200">
                      {task.title}
                    </h5>
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
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      {task.assignedTo && task.assignedTo.length > 0 ? (
                        <>
                          <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                            {getTeamMember(task.assignedTo[0])?.name?.charAt(
                              0
                            ) || "?"}
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {getTeamMember(task.assignedTo[0])?.name ||
                              "Unknown"}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="h-6 w-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
                            ?
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            Unassigned
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Completed: {task.completedDate || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Members View */}
      {taskManagementView === "team" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:text-white">
          <div className="p-6">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
              Team Members
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-lg mr-3">
                      {member.avatar || member.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200">
                        {member.name}
                      </h5>
                      <p className="text-xs text-gray-500 capitalize dark:text-gray-400">
                        {member.role} • {member.committee}
                      </p>
                    </div>
                  </div>

                  {member.skills && member.skills.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1 dark:text-gray-400">
                      Current Tasks:
                    </p>
                    {member.currentTasks && member.currentTasks.length > 0 ? (
                      <ul className="text-sm text-gray-700 space-y-1 dark:text-gray-400">
                        {member.currentTasks.map((taskId) => {
                          const task = localTasks.find((t) => t.id === taskId);
                          return task ? (
                            <li key={taskId} className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                              {task.title}
                            </li>
                          ) : null;
                        })}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No active tasks
                      </p>
                    )}
                  </div>

                  {member.availability && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1 dark:text-gray-400">
                        Availability:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {member.availability.map((day, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
