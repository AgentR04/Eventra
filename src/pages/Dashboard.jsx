import { signOut } from "firebase/auth";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaChartLine,
  FaClipboardList,
  FaCog,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../firebase/FirebaseContext";

// Import the new components
import BudgetManagement from "../components/dashboard/budget/BudgetManagement";
import EventScheduling from "../components/dashboard/events/EventScheduling";
import DashboardHeader from "../components/dashboard/header/DashboardHeader";
import NotificationsPanel from "../components/dashboard/notifications/NotificationsPanel";
import DashboardOverview from "../components/dashboard/overview/DashboardOverview";
import TaskManagement from "../components/dashboard/tasks/TaskManagement";

const Dashboard = () => {
  const { currentUser, auth, db, loading } = useFirebase();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "member",
    committee: "general",
    collegeCode: "",
    photoURL: null,
  });

  // State for tasks and team members (for AI task allocation)
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Mock data
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: "evt1",
      name: "Annual Tech Conference",
      date: "June 15, 2023",
      time: "09:00 - 18:00",
      venue: "Main Auditorium",
      status: "Planning",
      description:
        "Our flagship technology conference featuring industry speakers and workshops.",
      organizer: "Tech Committee",
      attendees: 250,
      budget: 15000,
    },
    {
      id: "evt2",
      name: "Cultural Festival",
      date: "July 8, 2023",
      time: "16:00 - 22:00",
      venue: "College Grounds",
      status: "Confirmed",
      description:
        "Annual cultural festival showcasing talents across various art forms.",
      organizer: "Cultural Committee",
      attendees: 500,
      budget: 25000,
    },
    {
      id: "evt3",
      name: "Hackathon 2023",
      date: "June 22, 2023",
      time: "10:00 - 22:00",
      venue: "Computer Science Building",
      status: "Planning",
      description:
        "24-hour coding competition with prizes for innovative solutions.",
      organizer: "Tech Committee",
      attendees: 120,
      budget: 8000,
    },
    {
      id: "evt4",
      name: "Alumni Meetup",
      date: "August 5, 2023",
      time: "18:00 - 21:00",
      venue: "College Cafeteria",
      status: "Draft",
      description: "Networking event for alumni and current students.",
      organizer: "Alumni Relations",
      attendees: 150,
      budget: 5000,
    },
    {
      id: "evt5",
      name: "Career Fair",
      date: "July 15, 2023",
      time: "10:00 - 16:00",
      venue: "Main Hall",
      status: "Confirmed",
      description:
        "Annual job fair with top companies for recruitment and internships.",
      organizer: "Placement Committee",
      attendees: 300,
      budget: 12000,
    },
  ]);

  const [schedulingConflicts, setSchedulingConflicts] = useState([
    {
      id: "conf1",
      events: ["evt1", "evt3"],
      type: "venue",
      description:
        "Both events scheduled at Computer Science Building on the same day",
      severity: "high",
      suggestedResolution: "Reschedule Hackathon to June 29",
    },
    {
      id: "conf2",
      events: ["evt2", "evt5"],
      type: "organizer",
      description:
        "Key organizer assigned to both events with overlapping responsibilities",
      severity: "medium",
      suggestedResolution: "Reassign organizer or adjust event timing",
    },
    {
      id: "conf3",
      events: ["evt4"],
      type: "resource",
      description: "Insufficient chairs for expected attendees",
      severity: "low",
      suggestedResolution: "Arrange for additional 50 chairs",
    },
  ]);

  const [venues, setVenues] = useState([
    {
      id: "venue1",
      name: "Main Auditorium",
      capacity: 300,
      facilities: ["Projector", "Sound System", "Air Conditioning", "Stage"],
      availability: ["Monday", "Wednesday", "Friday"],
      bookingRate: 5000,
      image: "https://example.com/auditorium.jpg",
    },
    {
      id: "venue2",
      name: "Computer Science Building",
      capacity: 150,
      facilities: ["Computers", "High-speed Internet", "Projector"],
      availability: ["Monday", "Tuesday", "Thursday", "Saturday"],
      bookingRate: 3000,
      image: "https://example.com/cs-building.jpg",
    },
    {
      id: "venue3",
      name: "College Grounds",
      capacity: 1000,
      facilities: ["Open Space", "Basic Sound System", "Power Supply"],
      availability: ["Saturday", "Sunday"],
      bookingRate: 8000,
      image: "https://example.com/grounds.jpg",
    },
    {
      id: "venue4",
      name: "Main Hall",
      capacity: 400,
      facilities: [
        "Projector",
        "Sound System",
        "Air Conditioning",
        "Flexible Seating",
      ],
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      bookingRate: 6000,
      image: "https://example.com/main-hall.jpg",
    },
    {
      id: "venue5",
      name: "College Cafeteria",
      capacity: 200,
      facilities: [
        "Catering Services",
        "Tables and Chairs",
        "Air Conditioning",
      ],
      availability: ["Evening Hours", "Weekends"],
      bookingRate: 4000,
      image: "https://example.com/cafeteria.jpg",
    },
  ]);

  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: "ai1",
      type: "scheduling",
      suggestion:
        "Consider moving the Hackathon to June 29 to avoid venue conflict",
      confidence: "high",
      impact: "Eliminates scheduling conflict with Tech Conference",
    },
    {
      id: "ai2",
      type: "budget",
      suggestion:
        "Reduce catering budget for Alumni Meetup by 15% based on last year's consumption",
      confidence: "medium",
      impact: "Potential savings of ₹750 without affecting event quality",
    },
    {
      id: "ai3",
      type: "resource",
      suggestion:
        "Combine equipment rentals for Tech Conference and Hackathon for bulk discount",
      confidence: "high",
      impact: "Estimated 20% savings on equipment rental costs",
    },
    {
      id: "ai4",
      type: "attendance",
      suggestion:
        "Increase expected attendance for Career Fair by 50 based on registration trend",
      confidence: "medium",
      impact: "Need to arrange for additional seating and refreshments",
    },
    {
      id: "ai5",
      type: "marketing",
      suggestion:
        "Start promoting Cultural Festival on social media now to increase attendance",
      confidence: "high",
      impact:
        "Potential 30% increase in attendance based on previous campaigns",
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: "notif1",
      message: "Budget for Annual Tech Conference approved",
      time: "2 hours ago",
      read: false,
      important: true,
      type: "success",
      actionable: true,
      action: "View Budget",
    },
    {
      id: "notif2",
      message:
        "New task assigned: Create marketing materials for Cultural Festival",
      time: "Yesterday",
      read: true,
      important: false,
      type: "update",
      actionable: true,
      action: "View Task",
    },
    {
      id: "notif3",
      message: "Scheduling conflict detected between two events",
      time: "2 days ago",
      read: false,
      important: true,
      type: "alert",
      actionable: true,
      action: "Resolve Conflict",
    },
    {
      id: "notif4",
      message:
        "5 team members confirmed availability for Hackathon planning meeting",
      time: "3 days ago",
      read: true,
      important: false,
      type: "update",
      actionable: false,
    },
    {
      id: "notif5",
      message: "Reminder: Submit budget proposal for Alumni Meetup by Friday",
      time: "4 days ago",
      read: false,
      important: true,
      type: "alert",
      actionable: true,
      action: "Create Budget",
    },
    {
      id: "notif6",
      message: "New venue added to the system: Conference Room B",
      time: "1 week ago",
      read: true,
      important: false,
      type: "update",
      actionable: true,
      action: "View Venue",
    },
  ]);

  const [committees, setCommittees] = useState([
    {
      id: "com1",
      name: "Tech Committee",
      members: 12,
      events: 3,
      head: "John Doe",
      budget: 25000,
      description:
        "Responsible for all technology-related events and workshops",
    },
    {
      id: "com2",
      name: "Cultural Committee",
      members: 15,
      events: 4,
      head: "Jane Smith",
      budget: 30000,
      description: "Organizes cultural festivals and artistic performances",
    },
    {
      id: "com3",
      name: "Sports Committee",
      members: 10,
      events: 5,
      head: "Mike Johnson",
      budget: 20000,
      description: "Manages sports tournaments and athletic events",
    },
    {
      id: "com4",
      name: "Placement Committee",
      members: 8,
      events: 2,
      head: "Sarah Williams",
      budget: 15000,
      description: "Coordinates career fairs and placement activities",
    },
    {
      id: "com5",
      name: "Alumni Relations",
      members: 6,
      events: 1,
      head: "Robert Brown",
      budget: 10000,
      description: "Maintains alumni network and organizes reunions",
    },
  ]);

  const [budgetAllocations, setBudgetAllocations] = useState([
    {
      id: "budget1",
      committee: "Tech Committee",
      amount: 25000,
      spent: 10000,
      remaining: 15000,
      events: ["Annual Tech Conference", "Hackathon 2023"],
      lastUpdated: "June 1, 2023",
    },
    {
      id: "budget2",
      committee: "Cultural Committee",
      amount: 30000,
      spent: 5000,
      remaining: 25000,
      events: ["Cultural Festival"],
      lastUpdated: "June 2, 2023",
    },
    {
      id: "budget3",
      committee: "Sports Committee",
      amount: 20000,
      spent: 8000,
      remaining: 12000,
      events: ["Annual Sports Meet", "Cricket Tournament"],
      lastUpdated: "May 28, 2023",
    },
    {
      id: "budget4",
      committee: "Placement Committee",
      amount: 15000,
      spent: 3000,
      remaining: 12000,
      events: ["Career Fair"],
      lastUpdated: "June 5, 2023",
    },
    {
      id: "budget5",
      committee: "Alumni Relations",
      amount: 10000,
      spent: 1000,
      remaining: 9000,
      events: ["Alumni Meetup"],
      lastUpdated: "June 3, 2023",
    },
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: "exp1",
      description: "Venue booking for Tech Conference",
      amount: 5000,
      date: "May 15, 2023",
      category: "Venue",
      committee: "Tech Committee",
      approvedBy: "Finance Head",
      receipt: "receipt1.pdf",
    },
    {
      id: "exp2",
      description: "Marketing materials for Cultural Festival",
      amount: 3000,
      date: "May 20, 2023",
      category: "Marketing",
      committee: "Cultural Committee",
      approvedBy: "Finance Head",
      receipt: "receipt2.pdf",
    },
    {
      id: "exp3",
      description: "Equipment rental for Hackathon",
      amount: 2000,
      date: "May 25, 2023",
      category: "Equipment",
      committee: "Tech Committee",
      approvedBy: "Finance Head",
      receipt: "receipt3.pdf",
    },
    {
      id: "exp4",
      description: "Catering deposit for Alumni Meetup",
      amount: 1000,
      date: "June 1, 2023",
      category: "Food & Beverages",
      committee: "Alumni Relations",
      approvedBy: "Finance Head",
      receipt: "receipt4.pdf",
    },
    {
      id: "exp5",
      description: "Trophies for Sports Tournament",
      amount: 3000,
      date: "May 10, 2023",
      category: "Prizes",
      committee: "Sports Committee",
      approvedBy: "Finance Head",
      receipt: "receipt5.pdf",
    },
    {
      id: "exp6",
      description: "Printing company profiles for Career Fair",
      amount: 2000,
      date: "June 2, 2023",
      category: "Printing",
      committee: "Placement Committee",
      approvedBy: "Finance Head",
      receipt: "receipt6.pdf",
    },
    {
      id: "exp7",
      description: "Speaker honorarium for Tech Conference",
      amount: 3000,
      date: "May 30, 2023",
      category: "Speakers",
      committee: "Tech Committee",
      approvedBy: "Finance Head",
      receipt: "receipt7.pdf",
    },
  ]);

  const [incomes, setIncomes] = useState([
    {
      id: "inc1",
      description: "College budget allocation",
      amount: 100000,
      date: "April 1, 2023",
      category: "Institutional Funding",
      receivedBy: "Finance Head",
      receipt: "income1.pdf",
    },
    {
      id: "inc2",
      description: "TechCorp sponsorship for Hackathon",
      amount: 15000,
      date: "May 5, 2023",
      category: "Sponsorship",
      receivedBy: "Tech Committee Head",
      receipt: "income2.pdf",
    },
    {
      id: "inc3",
      description: "Cultural Festival ticket sales",
      amount: 25000,
      date: "Projected",
      category: "Ticket Sales",
      receivedBy: "Pending",
      receipt: "Pending",
    },
    {
      id: "inc4",
      description: "Alumni donations",
      amount: 20000,
      date: "May 15, 2023",
      category: "Donations",
      receivedBy: "Alumni Relations Head",
      receipt: "income4.pdf",
    },
    {
      id: "inc5",
      description: "Career Fair company registration fees",
      amount: 30000,
      date: "Projected",
      category: "Registration Fees",
      receivedBy: "Pending",
      receipt: "Pending",
    },
  ]);

  const [taskRecommendations, setTaskRecommendations] = useState([
    {
      id: "rec1",
      type: "reassignment",
      reason: "John is currently overloaded with 5 high-priority tasks",
      suggestion: "Reassign 'Create event posters' task from John to Sarah",
      confidence: "high",
      impact: "Balances workload and ensures timely completion",
    },
    {
      id: "rec2",
      type: "workload",
      reason: "Marketing team has capacity for additional tasks",
      suggestion: "Assign social media promotion tasks to the marketing team",
      confidence: "medium",
      impact: "Utilizes available resources efficiently",
    },
    {
      id: "rec3",
      type: "deadline",
      reason:
        "Current deadline for venue booking conflicts with approval process",
      suggestion: "Move venue booking deadline 3 days earlier",
      confidence: "high",
      impact: "Prevents potential delays in event planning",
    },
    {
      id: "rec4",
      type: "skill",
      reason: "Task requires graphic design skills",
      suggestion:
        "Assign banner design task to Lisa who has strong design skills",
      confidence: "high",
      impact: "Better quality output and faster completion",
    },
    {
      id: "rec5",
      type: "priority",
      reason: "Budget approval is blocking multiple dependent tasks",
      suggestion: "Increase priority of 'Budget approval' task",
      confidence: "medium",
      impact: "Unblocks critical path for event planning",
    },
  ]);

  const [isRoleHead, setIsRoleHead] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !currentUser) {
      navigate("/login");
      return;
    }

    // Fetch user profile data from Firestore
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              name: data.name || currentUser.displayName || "User",
              email: data.email || currentUser.email || "",
              role: data.role || "member",
              committee: data.committee || "general",
              collegeCode: data.collegeCode || "",
              photoURL: currentUser.photoURL || null,
            });
          } else {
            // Use Firebase auth data if Firestore profile doesn't exist
            setUserData({
              name: currentUser.displayName || "User",
              email: currentUser.email || "",
              role: "member",
              committee: "general",
              collegeCode: "",
              photoURL: currentUser.photoURL || null,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    // Fetch tasks from Firestore
    const fetchTasks = async () => {
      if (currentUser) {
        try {
          const tasksCollectionRef = collection(db, "tasks");
          const tasksSnapshot = await getDocs(tasksCollectionRef);
          const tasksList = [];

          tasksSnapshot.forEach((doc) => {
            tasksList.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          setTasks(tasksList);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    // Fetch team members from Firestore
    const fetchTeamMembers = async () => {
      if (currentUser) {
        try {
          const usersCollectionRef = collection(db, "users");
          const usersSnapshot = await getDocs(usersCollectionRef);
          const usersList = [];

          usersSnapshot.forEach((doc) => {
            // Skip current user
            if (doc.id !== currentUser.uid) {
              const userData = doc.data();
              usersList.push({
                id: doc.id,
                name: userData.name || "User",
                role: userData.role || "member",
                committee: userData.committee || "general",
                skills: userData.skills
                  ? userData.skills.split(",").map((skill) => skill.trim())
                  : [],
                currentTasks: userData.currentTasks || [],
                availability: userData.availability || [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                performanceRating: userData.performanceRating || 7,
                specialization: userData.specialization || null,
              });
            }
          });

          setTeamMembers(usersList);
        } catch (error) {
          console.error("Error fetching team members:", error);
        }
      }
    };

    // Initialize mock data (in a real app, this would be fetched from Firestore)
    const initializeMockData = () => {
      // Initialize your mock data here
      // This would replace the hardcoded data in the original component
    };

    fetchUserData();
    fetchTasks();
    fetchTeamMembers();
    initializeMockData();
  }, [currentUser, loading, navigate, db]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Function to handle task assignments from AI
  const handleAssignTask = async (taskId, assigneeIds) => {
    try {
      // Update the task in Firestore
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        assignedTo: assigneeIds,
        updatedAt: serverTimestamp(),
        status: "Assigned",
      });

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, assignedTo: assigneeIds, status: "Assigned" }
            : task
        )
      );

      // For each assignee, update their currentTasks array
      for (const assigneeId of assigneeIds) {
        const userRef = doc(db, "users", assigneeId);
        await updateDoc(userRef, {
          currentTasks: arrayUnion(taskId),
          updatedAt: serverTimestamp(),
        });
      }

      console.log(`Task ${taskId} assigned to ${assigneeIds.join(", ")}`);
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  // Render the appropriate tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "tasks":
        return (
          <TaskManagement
            tasks={tasks}
            teamMembers={teamMembers}
            handleAssignTask={handleAssignTask}
            taskRecommendations={taskRecommendations}
          />
        );
      case "budget":
        return (
          <BudgetManagement
            budgetAllocations={budgetAllocations}
            committees={committees}
            expenses={expenses}
            incomes={incomes}
          />
        );
      case "events":
        return (
          <EventScheduling
            upcomingEvents={upcomingEvents}
            schedulingConflicts={schedulingConflicts}
            venues={venues}
            aiSuggestions={aiSuggestions}
            isRoleHead={isRoleHead}
          />
        );
      case "notifications":
        return <NotificationsPanel notifications={notifications} />;
      case "overview":
      default:
        return (
          <DashboardOverview
            upcomingEvents={upcomingEvents}
            tasks={tasks}
            notifications={notifications}
            committees={committees}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardHeader
        userData={userData}
        auth={auth}
        notifications={notifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 text-white">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-primary text-white rounded-xl shadow-fancy p-6 mb-8"
        >
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {userData.name}!
              </h1>
              <p className="mt-1 text-sm text-white text-opacity-90">
                {userData.role} • {userData.committee} Committee •{" "}
                {userData.email}
              </p>
              {userData.collegeCode && (
                <p className="mt-1 text-xs text-white text-opacity-75">
                  College Code: {userData.collegeCode}
                </p>
              )}
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link
                to="/settings"
                className="inline-flex items-center px-4 py-2 border border-white border-opacity-30 rounded-lg shadow-sm text-sm font-medium text-white bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-filter backdrop-blur-sm focus:outline-none transition-all duration-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <FaCog className="mr-2 -ml-1 h-4 w-4" />
                Account Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none transition-all duration-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <FaSignOutAlt className="mr-2 -ml-1 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-card mb-8 overflow-hidden"
        >
          <div className="border-b border-gray-100 dark:border-gray-700">
            <nav className="flex flex-wrap -mb-px px-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-6 text-sm font-medium rounded-t-lg transition-all duration-300 flex items-center ${
                  activeTab === "overview"
                    ? "border-b-2 border-primary text-primary bg-primary-50 dark:bg-primary-900/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <FaChartLine
                  className={`mr-2 ${
                    activeTab === "overview"
                      ? "text-primary dark:text-primary-300"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`py-4 px-6 text-sm font-medium rounded-t-lg transition-all duration-300 flex items-center ${
                  activeTab === "events"
                    ? "border-b-2 border-primary text-primary bg-primary-50"
                    : "text-gray-500 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <FaCalendarAlt
                  className={`mr-2 ${
                    activeTab === "events" ? "text-primary" : "text-gray-400"
                  }`}
                />
                Events
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`py-4 px-6 text-sm font-medium rounded-t-lg transition-all duration-300 flex items-center ${
                  activeTab === "tasks"
                    ? "border-b-2 border-primary text-primary bg-primary-50"
                    : "text-gray-500 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <FaClipboardList
                  className={`mr-2 ${
                    activeTab === "tasks" ? "text-primary" : "text-gray-400"
                  }`}
                />
                Tasks
              </button>
              <button
                onClick={() => setActiveTab("budget")}
                className={`py-4 px-6 text-sm font-medium rounded-t-lg transition-all duration-300 flex items-center ${
                  activeTab === "budget"
                    ? "border-b-2 border-primary text-primary bg-primary-50"
                    : "text-gray-500 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <FaMoneyBillWave
                  className={`mr-2 ${
                    activeTab === "budget" ? "text-primary" : "text-gray-400"
                  }`}
                />
                Budget
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`py-4 px-6 text-sm font-medium rounded-t-lg transition-all duration-300 flex items-center ${
                  activeTab === "notifications"
                    ? "border-b-2 border-primary text-primary bg-primary-50"
                    : "text-gray-500 hover:text-primary hover:bg-gray-50"
                }`}
              >
                <FaUsers
                  className={`mr-2 ${
                    activeTab === "notifications"
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                />
                Team
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
