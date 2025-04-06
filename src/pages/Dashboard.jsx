import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, FaUsers, FaClipboardList, FaBell, FaChartLine, FaCog, FaSignOutAlt,
  FaRobot, FaExclamationTriangle, FaCheckCircle, FaLightbulb, FaBuilding, FaClock,
  FaMapMarkerAlt, FaUserClock, FaCalendarPlus, FaFilter, FaSync, FaDownload,
  FaBrain, FaUserTag, FaListUl, FaLink, FaExchangeAlt, FaUserCog, FaStar, FaHourglassHalf,
  FaTasks, FaColumns, FaArrowRight, FaUserFriends, FaRegClock, FaCode, FaRegLightbulb,
  FaMoneyBillWave, FaChartPie, FaReceipt, FaWallet, FaArrowUp, FaArrowDown, FaPercentage,
  FaCoins, FaFileInvoiceDollar, FaHandHoldingUsd, FaBalanceScale, FaExclamationCircle,
  FaChartBar, FaRupeeSign, FaHistory, FaTag, FaCalculator, FaPiggyBank
} from 'react-icons/fa';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [schedulingView, setSchedulingView] = useState('calendar'); // 'calendar', 'conflicts', 'resources'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isRoleHead, setIsRoleHead] = useState(true); // For role-based access control
  
  // AI-Based Team & Task Management state variables
  const [taskManagementView, setTaskManagementView] = useState('kanban'); // 'kanban', 'team', 'analytics'
  const [showTaskAISuggestions, setShowTaskAISuggestions] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(null);
  const [aiTaskAnalysis, setAiTaskAnalysis] = useState(null);
  
  // Budget Management & Tracking state variables
  const [budgetView, setBudgetView] = useState('overview'); // 'overview', 'expenses', 'income', 'allocation'
  const [showBudgetAISuggestions, setShowBudgetAISuggestions] = useState(false);
  const [selectedBudgetCategory, setSelectedBudgetCategory] = useState(null);
  const [selectedBudgetPeriod, setSelectedBudgetPeriod] = useState('monthly'); // 'weekly', 'monthly', 'overall'
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);
  
  // Mock data for demonstration
  const upcomingEvents = [
    { 
      id: 1, 
      name: 'Technical Workshop', 
      date: '2023-06-15', 
      startTime: '10:00', 
      endTime: '12:00',
      committee: 'Technical', 
      status: 'Upcoming',
      venue: 'Auditorium 1',
      attendees: 120,
      resources: ['Projector', 'Sound System'],
      personnel: ['Dr. Smith', 'Prof. Johnson']
    },
    { 
      id: 2, 
      name: 'Cultural Night', 
      date: '2023-06-18', 
      startTime: '18:00', 
      endTime: '21:00',
      committee: 'Cultural', 
      status: 'Planning',
      venue: 'Main Ground',
      attendees: 500,
      resources: ['Stage', 'Lighting', 'Sound System'],
      personnel: ['Ms. Davis', 'Mr. Wilson']
    },
    { 
      id: 3, 
      name: 'Hackathon', 
      date: '2023-06-25', 
      startTime: '09:00', 
      endTime: '18:00',
      committee: 'Technical', 
      status: 'Registration Open',
      venue: 'Computer Lab',
      attendees: 80,
      resources: ['Computers', 'Internet', 'Refreshments'],
      personnel: ['Prof. Miller', 'Dr. Brown']
    }
  ];
  
  // Mock scheduling conflicts
  const schedulingConflicts = [
    {
      id: 1,
      type: 'venue',
      severity: 'high',
      description: 'Auditorium 1 double-booked for Technical Workshop and Guest Lecture',
      events: [1, 4],
      aiSuggestion: 'Move Guest Lecture to Classroom 105 which has similar capacity and AV equipment'
    },
    {
      id: 2,
      type: 'personnel',
      severity: 'medium',
      description: 'Prof. Miller scheduled for both Hackathon and Coding Competition simultaneously',
      events: [3, 5],
      aiSuggestion: 'Reassign Prof. Miller to morning session of Hackathon and afternoon session of Coding Competition'
    },
    {
      id: 3,
      type: 'resource',
      severity: 'low',
      description: 'Insufficient sound equipment for Cultural Night and Music Competition on same day',
      events: [2, 6],
      aiSuggestion: 'Rent additional sound equipment or reschedule Music Competition to June 19'
    }
  ];
  
  // Mock venue data
  const venues = [
    { id: 1, name: 'Auditorium 1', capacity: 200, resources: ['Projector', 'Sound System', 'Stage'], availability: 'High' },
    { id: 2, name: 'Auditorium 2', capacity: 150, resources: ['Projector', 'Sound System'], availability: 'Medium' },
    { id: 3, name: 'Main Ground', capacity: 1000, resources: ['Open Space'], availability: 'High' },
    { id: 4, name: 'Computer Lab', capacity: 100, resources: ['Computers', 'Internet', 'Projector'], availability: 'Low' },
    { id: 5, name: 'Classroom 105', capacity: 80, resources: ['Projector', 'Whiteboard'], availability: 'High' },
    { id: 6, name: 'Seminar Hall', capacity: 120, resources: ['Projector', 'Sound System', 'AC'], availability: 'Medium' }
  ];
  
  // Mock AI suggestions
  const aiSuggestions = [
    { id: 1, type: 'schedule', suggestion: 'Schedule Technical events on weekdays for better attendance based on historical data', confidence: 'high' },
    { id: 2, type: 'venue', suggestion: 'Auditorium 1 is optimal for Technical Workshop based on expected attendance and equipment needs', confidence: 'medium' },
    { id: 3, type: 'timing', suggestion: 'Cultural events get 30% more attendance when scheduled after 5 PM', confidence: 'high' },
    { id: 4, type: 'resource', suggestion: 'Consider renting additional sound equipment for June 18-20 due to multiple events', confidence: 'medium' }
  ];
  
  // Calendar data (days of the week)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];
  
  // Enhanced tasks with dependencies, skills, and NLP analysis
  const tasks = [
    { 
      id: 1, 
      title: 'Finalize speakers list', 
      description: 'Contact and confirm all speakers for the Technical Workshop',
      deadline: '2023-06-10', 
      priority: 'High', 
      status: 'In Progress',
      assignee: 2,
      requiredSkills: ['Communication', 'Event Planning'],
      dependencies: [],
      nlpTags: ['coordination', 'communication', 'planning'],
      progress: 60,
      estimatedHours: 5,
      riskLevel: 'Medium'
    },
    { 
      id: 2, 
      title: 'Book auditorium', 
      description: 'Reserve Auditorium 1 for the Technical Workshop',
      deadline: '2023-06-08', 
      priority: 'High', 
      status: 'Completed',
      assignee: 1,
      requiredSkills: ['Logistics', 'Venue Management'],
      dependencies: [],
      nlpTags: ['booking', 'venue', 'logistics'],
      progress: 100,
      estimatedHours: 2,
      riskLevel: 'Low'
    },
    { 
      id: 3, 
      title: 'Design event posters', 
      description: 'Create promotional posters for the Technical Workshop',
      deadline: '2023-06-12', 
      priority: 'Medium', 
      status: 'Not Started',
      assignee: 3,
      requiredSkills: ['Graphic Design', 'Creativity'],
      dependencies: [1], // Depends on finalizing speakers
      nlpTags: ['design', 'creative', 'promotional'],
      progress: 0,
      estimatedHours: 8,
      riskLevel: 'High'
    },
    { 
      id: 4, 
      title: 'Arrange refreshments', 
      description: 'Coordinate with catering for workshop refreshments',
      deadline: '2023-06-20', 
      priority: 'Low', 
      status: 'Not Started',
      assignee: 4,
      requiredSkills: ['Catering', 'Logistics'],
      dependencies: [2], // Depends on booking the venue
      nlpTags: ['catering', 'food', 'logistics'],
      progress: 0,
      estimatedHours: 3,
      riskLevel: 'Low'
    },
    { 
      id: 5, 
      title: 'Set up registration system', 
      description: 'Configure online registration form and payment gateway',
      deadline: '2023-06-15', 
      priority: 'High', 
      status: 'In Progress',
      assignee: 5,
      requiredSkills: ['Web Development', 'Technical'],
      dependencies: [],
      nlpTags: ['technical', 'registration', 'development'],
      progress: 30,
      estimatedHours: 10,
      riskLevel: 'Medium'
    }
  ];
  
  const notifications = [
    { id: 1, message: 'New task assigned: Review event budget', time: '2 hours ago' },
    { id: 2, message: 'Technical Workshop registration is now open', time: '1 day ago' },
    { id: 3, message: 'Budget for Cultural Night approved', time: '2 days ago' }
  ];
  
  // Team member profiles with skills and availability
  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Committee Head',
      committee: 'Technical',
      avatar: 'JD',
      skills: ['Event Planning', 'Leadership', 'Venue Management'],
      skillLevels: {
        'Event Planning': 5,
        'Leadership': 5,
        'Venue Management': 4
      },
      availability: [
        { date: '2023-06-15', slots: ['morning', 'afternoon'] },
        { date: '2023-06-16', slots: ['morning'] }
      ],
      pastTasks: [
        { id: 101, name: 'Organize Tech Symposium', completion: 'on-time', quality: 5 },
        { id: 102, name: 'Coordinate with speakers', completion: 'on-time', quality: 5 }
      ],
      workload: 2 // Current number of assigned tasks
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Coordinator',
      committee: 'Technical',
      avatar: 'JS',
      skills: ['Communication', 'Event Planning', 'Coordination'],
      skillLevels: {
        'Communication': 5,
        'Event Planning': 4,
        'Coordination': 5
      },
      availability: [
        { date: '2023-06-15', slots: ['afternoon'] },
        { date: '2023-06-16', slots: ['morning', 'afternoon'] }
      ],
      pastTasks: [
        { id: 103, name: 'Manage speaker invitations', completion: 'on-time', quality: 4 },
        { id: 104, name: 'Coordinate event schedule', completion: 'delayed', quality: 3 }
      ],
      workload: 3
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Designer',
      committee: 'Marketing',
      avatar: 'MJ',
      skills: ['Graphic Design', 'Creativity', 'Social Media'],
      skillLevels: {
        'Graphic Design': 5,
        'Creativity': 5,
        'Social Media': 4
      },
      availability: [
        { date: '2023-06-15', slots: ['morning', 'afternoon'] },
        { date: '2023-06-16', slots: ['afternoon'] }
      ],
      pastTasks: [
        { id: 105, name: 'Design event logo', completion: 'on-time', quality: 5 },
        { id: 106, name: 'Create social media graphics', completion: 'on-time', quality: 5 }
      ],
      workload: 1
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      role: 'Volunteer',
      committee: 'Cultural',
      avatar: 'SW',
      skills: ['Catering', 'Logistics', 'Coordination'],
      skillLevels: {
        'Catering': 4,
        'Logistics': 3,
        'Coordination': 4
      },
      availability: [
        { date: '2023-06-15', slots: ['afternoon'] },
        { date: '2023-06-16', slots: ['morning', 'afternoon'] }
      ],
      pastTasks: [
        { id: 107, name: 'Coordinate refreshments', completion: 'on-time', quality: 4 },
        { id: 108, name: 'Manage volunteer schedules', completion: 'on-time', quality: 4 }
      ],
      workload: 1
    },
    {
      id: 5,
      name: 'David Lee',
      role: 'Developer',
      committee: 'Technical',
      avatar: 'DL',
      skills: ['Web Development', 'Technical', 'Programming'],
      skillLevels: {
        'Web Development': 5,
        'Technical': 5,
        'Programming': 5
      },
      availability: [
        { date: '2023-06-15', slots: ['morning'] },
        { date: '2023-06-16', slots: ['morning', 'afternoon'] }
      ],
      pastTasks: [
        { id: 109, name: 'Develop event website', completion: 'on-time', quality: 5 },
        { id: 110, name: 'Set up registration system', completion: 'delayed', quality: 4 }
      ],
      workload: 2
    }
  ];
  
  // AI task recommendations
  const taskRecommendations = [
    {
      id: 1,
      taskId: 3,
      type: 'reassignment',
      reason: 'Task dependencies delayed - Finalize speakers list is only 60% complete',
      suggestion: 'Consider reassigning to Sarah Wilson who has availability and relevant skills',
      suggestedAssignee: 4,
      confidence: 'high',
      impact: 'Reduces risk of missing deadline by 70%'
    },
    {
      id: 2,
      taskId: 5,
      type: 'workload',
      reason: 'David Lee is currently working on multiple high-priority tasks',
      suggestion: 'Consider reducing David\'s workload by reassigning this task to Mike Johnson',
      suggestedAssignee: 3,
      confidence: 'medium',
      impact: 'Balances team workload and improves overall efficiency'
    },
    {
      id: 3,
      taskId: 1,
      type: 'deadline',
      reason: 'Current progress (60%) suggests potential deadline risk',
      suggestion: 'Extend deadline by 2 days or allocate additional resources',
      newDeadline: '2023-06-12',
      confidence: 'medium',
      impact: 'Ensures quality completion without rushing'
    }
  ];
  
  const committees = [
    { id: 1, name: 'Technical', members: 12, events: 3 },
    { id: 2, name: 'Cultural', members: 15, events: 2 },
    { id: 3, name: 'Marketing', members: 8, events: 0 },
    { id: 4, name: 'Sponsorship', members: 6, events: 0 }
  ];
  
  // Budget Management & Tracking mock data
  const budgetCategories = [
    { id: 1, name: 'Food & Beverages', icon: 'utensils', color: '#FF6B6B' },
    { id: 2, name: 'Decoration', icon: 'paint-brush', color: '#4ECDC4' },
    { id: 3, name: 'Technical Equipment', icon: 'laptop', color: '#1A535C' },
    { id: 4, name: 'Marketing', icon: 'ad', color: '#FF9F1C' },
    { id: 5, name: 'Venue', icon: 'building', color: '#7B68EE' },
    { id: 6, name: 'Prizes', icon: 'trophy', color: '#FFD700' },
    { id: 7, name: 'Miscellaneous', icon: 'ellipsis-h', color: '#6C757D' }
  ];
  
  const incomeCategories = [
    { id: 1, name: 'Sponsorship', icon: 'handshake', color: '#28A745' },
    { id: 2, name: 'Ticket Sales', icon: 'ticket-alt', color: '#17A2B8' },
    { id: 3, name: 'College Funding', icon: 'university', color: '#6610F2' },
    { id: 4, name: 'Merchandise', icon: 'tshirt', color: '#FD7E14' },
    { id: 5, name: 'Donations', icon: 'gift', color: '#20C997' }
  ];
  
  const expenses = [
    { 
      id: 1, 
      title: 'Catering for Technical Workshop', 
      amount: 25000, 
      date: '2023-06-10', 
      category: 1, 
      committee: 1, 
      event: 1,
      status: 'approved',
      paymentMethod: 'Bank Transfer',
      receipt: 'receipt_001.pdf'
    },
    { 
      id: 2, 
      title: 'Sound System Rental', 
      amount: 15000, 
      date: '2023-06-12', 
      category: 3, 
      committee: 2, 
      event: 2,
      status: 'approved',
      paymentMethod: 'Credit Card',
      receipt: 'receipt_002.pdf'
    },
    { 
      id: 3, 
      title: 'Stage Decoration', 
      amount: 18000, 
      date: '2023-06-15', 
      category: 2, 
      committee: 2, 
      event: 2,
      status: 'pending',
      paymentMethod: 'Cash',
      receipt: 'receipt_003.pdf'
    },
    { 
      id: 4, 
      title: 'Social Media Advertising', 
      amount: 10000, 
      date: '2023-06-05', 
      category: 4, 
      committee: 3, 
      event: null,
      status: 'approved',
      paymentMethod: 'Credit Card',
      receipt: 'receipt_004.pdf'
    },
    { 
      id: 5, 
      title: 'Venue Booking for Hackathon', 
      amount: 30000, 
      date: '2023-06-08', 
      category: 5, 
      committee: 1, 
      event: 3,
      status: 'approved',
      paymentMethod: 'Bank Transfer',
      receipt: 'receipt_005.pdf'
    },
    { 
      id: 6, 
      title: 'Prizes for Coding Competition', 
      amount: 20000, 
      date: '2023-06-20', 
      category: 6, 
      committee: 1, 
      event: 3,
      status: 'pending',
      paymentMethod: 'Not Paid',
      receipt: null
    }
  ];
  
  const incomes = [
    { 
      id: 1, 
      title: 'TechCorp Sponsorship', 
      amount: 50000, 
      date: '2023-05-15', 
      category: 1, 
      committee: 4,
      status: 'received',
      paymentMethod: 'Bank Transfer',
      agreement: 'agreement_001.pdf'
    },
    { 
      id: 2, 
      title: 'Cultural Night Ticket Sales', 
      amount: 25000, 
      date: '2023-06-18', 
      category: 2, 
      committee: 2,
      status: 'pending',
      paymentMethod: 'Cash & Online',
      agreement: null
    },
    { 
      id: 3, 
      title: 'College Fund Allocation', 
      amount: 100000, 
      date: '2023-05-01', 
      category: 3, 
      committee: null,
      status: 'received',
      paymentMethod: 'Bank Transfer',
      agreement: 'agreement_002.pdf'
    },
    { 
      id: 4, 
      title: 'Event T-shirt Sales', 
      amount: 15000, 
      date: '2023-06-15', 
      category: 4, 
      committee: 3,
      status: 'partial',
      paymentMethod: 'Cash & Online',
      agreement: null
    },
    { 
      id: 5, 
      title: 'Alumni Donations', 
      amount: 30000, 
      date: '2023-05-20', 
      category: 5, 
      committee: 4,
      status: 'received',
      paymentMethod: 'Bank Transfer',
      agreement: 'agreement_003.pdf'
    }
  ];
  
  const budgetAllocations = [
    { id: 1, committee: 1, allocated: 80000, spent: 55000, remaining: 25000 },
    { id: 2, committee: 2, allocated: 70000, spent: 33000, remaining: 37000 },
    { id: 3, committee: 3, allocated: 40000, spent: 10000, remaining: 30000 },
    { id: 4, committee: 4, allocated: 20000, spent: 5000, remaining: 15000 }
  ];
  
  const budgetAIRecommendations = [
    {
      id: 1,
      type: 'overspending',
      category: 1,
      committee: 1,
      message: 'Food & Beverages spending is 15% higher than average for similar events',
      suggestion: 'Consider reducing catering quantities or finding alternative vendors',
      impact: 'Potential savings of ₹5,000 - ₹8,000',
      confidence: 'high'
    },
    {
      id: 2,
      type: 'reallocation',
      category: null,
      committee: 2,
      message: 'Cultural committee has 53% of their budget unspent with only 2 weeks remaining',
      suggestion: 'Reallocate ₹15,000 to Technical committee for Hackathon prizes',
      impact: 'Better budget utilization and improved Hackathon event quality',
      confidence: 'medium'
    },
    {
      id: 3,
      type: 'saving',
      category: 3,
      committee: null,
      message: 'Technical equipment rental costs can be reduced by booking in advance',
      suggestion: 'Book all remaining equipment needs now for a 20% early booking discount',
      impact: 'Potential savings of ₹10,000',
      confidence: 'high'
    },
    {
      id: 4,
      type: 'income',
      category: 1,
      committee: 4,
      message: 'Sponsorship targets are 30% below projections',
      suggestion: 'Reach out to 5 new potential sponsors with updated sponsorship packages',
      impact: 'Potential additional income of ₹50,000 - ₹75,000',
      confidence: 'medium'
    }
  ];
  
  // Mock user data
  const user = {
    name: 'John Doe',
    role: 'Committee Head',
    committee: 'Technical',
    collegeCode: 'SIES-TF2023'
  };
  
  // Helper function to get events for a specific day
  const getEventsForDay = (day) => {
    // In a real app, this would filter events based on the actual date
    return upcomingEvents.filter((_, index) => index % 7 === day);
  };
  
  // Function to handle drag and drop of events
  const handleEventDragDrop = (eventId, newTime, newVenue) => {
    // In a real app, this would update the event's time and venue
    console.log(`Event ${eventId} moved to ${newTime} at ${newVenue}`);
    // This would trigger conflict detection and update the UI
  };
  
  // Helper functions for AI-Based Team & Task Management
  
  // Get team member by ID
  const getTeamMember = (id) => {
    return teamMembers.find(member => member.id === id) || null;
  };
  
  // Get tasks for a specific status (for Kanban board)
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };
  
  // Handle task drag and drop between Kanban columns
  const handleTaskDragDrop = (taskId, newStatus) => {
    console.log(`Task ${taskId} moved to ${newStatus}`);
    // In a real app, this would update the task's status
  };
  
  // Analyze task description with NLP and suggest assignees
  const analyzeTaskWithNLP = (taskDescription) => {
    // In a real app, this would use NLP to extract skills and suggest team members
    // For demo purposes, we'll simulate NLP analysis
    const mockSkills = ['design', 'coordination', 'technical'];
    const extractedSkills = mockSkills.filter(skill => 
      taskDescription.toLowerCase().includes(skill)
    );
    
    // Find team members with matching skills
    const suggestedAssignees = teamMembers.filter(member => 
      member.skills.some(skill => 
        extractedSkills.some(extractedSkill => 
          skill.toLowerCase().includes(extractedSkill)
        )
      )
    );
    
    return {
      extractedSkills,
      suggestedAssignees: suggestedAssignees.map(member => ({
        id: member.id,
        name: member.name,
        matchScore: Math.floor(Math.random() * 40) + 60 // Mock match score between 60-100%
      }))
    };
  };
  
  // Get task dependencies
  const getTaskDependencies = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return [];
    
    return task.dependencies.map(depId => tasks.find(t => t.id === depId));
  };
  
  // Check if a task can be started based on its dependencies
  const canTaskBeStarted = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return true;
    
    // Check if all dependencies are completed
    return task.dependencies.every(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask && depTask.status === 'Completed';
    });
  };
  
  // Budget Management & Tracking helper functions
  
  // Get category name by ID
  const getBudgetCategoryName = (categoryId, isIncome = false) => {
    const categories = isIncome ? incomeCategories : budgetCategories;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  // Get committee name by ID
  const getCommitteeName = (committeeId) => {
    const committee = committees.find(com => com.id === committeeId);
    return committee ? committee.name : 'General';
  };
  
  // Calculate total income
  const calculateTotalIncome = () => {
    return incomes.reduce((total, income) => total + income.amount, 0);
  };
  
  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };
  
  // Calculate remaining budget
  const calculateRemainingBudget = () => {
    return calculateTotalIncome() - calculateTotalExpenses();
  };
  
  // Calculate expenses by category
  const calculateExpensesByCategory = () => {
    const expensesByCategory = {};
    
    budgetCategories.forEach(category => {
      expensesByCategory[category.id] = {
        name: category.name,
        color: category.color,
        amount: 0
      };
    });
    
    expenses.forEach(expense => {
      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category].amount += expense.amount;
      }
    });
    
    return Object.values(expensesByCategory);
  };
  
  // Calculate income by category
  const calculateIncomeByCategory = () => {
    const incomeByCategory = {};
    
    incomeCategories.forEach(category => {
      incomeByCategory[category.id] = {
        name: category.name,
        color: category.color,
        amount: 0
      };
    });
    
    incomes.forEach(income => {
      if (incomeByCategory[income.category]) {
        incomeByCategory[income.category].amount += income.amount;
      }
    });
    
    return Object.values(incomeByCategory);
  };
  
  // Calculate expenses by committee
  const calculateExpensesByCommittee = () => {
    const expensesByCommittee = {};
    
    committees.forEach(committee => {
      expensesByCommittee[committee.id] = {
        name: committee.name,
        amount: 0
      };
    });
    
    expenses.forEach(expense => {
      if (expense.committee && expensesByCommittee[expense.committee]) {
        expensesByCommittee[expense.committee].amount += expense.amount;
      }
    });
    
    return Object.values(expensesByCommittee);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'budget':
        return (
          <div className="space-y-6">
            {/* Budget Management & Tracking Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FaMoneyBillWave className="text-primary mr-2" />
                    Budget Management & Tracking
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Centralized system to track all finances of the fest
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`px-3 py-2 text-sm rounded-md flex items-center ${budgetView === 'overview' ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setBudgetView('overview')}
                  >
                    <FaChartPie className="mr-1" /> Overview
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm rounded-md flex items-center ${budgetView === 'expenses' ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setBudgetView('expenses')}
                  >
                    <FaArrowDown className="mr-1" /> Expenses
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm rounded-md flex items-center ${budgetView === 'income' ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setBudgetView('income')}
                  >
                    <FaArrowUp className="mr-1" /> Income
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm rounded-md flex items-center ${budgetView === 'allocation' ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setBudgetView('allocation')}
                  >
                    <FaBalanceScale className="mr-1" /> Allocation
                  </button>
                  <button 
                    className="px-3 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
                    onClick={() => setShowBudgetAISuggestions(!showBudgetAISuggestions)}
                  >
                    <FaRegLightbulb className="mr-1 text-yellow-500" /> AI Insights
                  </button>
                </div>
              </div>
            </div>
            
            {/* Budget AI Recommendations Panel */}
            {showBudgetAISuggestions && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <FaRegLightbulb className="text-yellow-500 mr-2" />
                    AI-Powered Budget Insights
                  </h4>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowBudgetAISuggestions(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className="space-y-3">
                  {budgetAIRecommendations.map(recommendation => (
                    <div key={recommendation.id} className="flex items-start bg-white bg-opacity-60 p-3 rounded-md">
                      <div className="flex-shrink-0 mt-1">
                        {recommendation.type === 'overspending' && <FaExclamationCircle className="text-red-500" />}
                        {recommendation.type === 'reallocation' && <FaExchangeAlt className="text-blue-500" />}
                        {recommendation.type === 'saving' && <FaPiggyBank className="text-green-500" />}
                        {recommendation.type === 'income' && <FaHandHoldingUsd className="text-purple-500" />}
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-800 capitalize">{recommendation.type} Alert</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${recommendation.confidence === 'high' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {recommendation.confidence} confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{recommendation.message}</p>
                        <p className="text-sm font-medium text-primary mt-1">{recommendation.suggestion}</p>
                        <p className="text-xs text-gray-500 mt-1">Impact: {recommendation.impact}</p>
                        <div className="mt-2 flex justify-end space-x-2">
                          <button className="px-3 py-1 text-xs rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                            Dismiss
                          </button>
                          <button className="px-3 py-1 text-xs rounded-md bg-primary text-white hover:bg-primary-dark">
                            Apply Suggestion
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Budget Overview Section */}
            {budgetView === 'allocation' && (
              <div className="space-y-6">
                {/* Budget Allocation Header */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                    <FaBalanceScale className="text-primary mr-2" />
                    Budget Allocation by Committee
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Committee
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Allocated Budget
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Spent
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remaining
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilization
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {budgetAllocations.map(allocation => {
                          const committee = committees.find(c => c.id === allocation.committee);
                          const utilizationPercentage = (allocation.spent / allocation.allocated) * 100;
                          
                          return (
                            <tr key={allocation.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{committee?.name || 'Unknown'}</div>
                                <div className="text-xs text-gray-500">{committee?.members || 0} members</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{formatCurrency(allocation.allocated)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-red-600">{formatCurrency(allocation.spent)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-green-600">{formatCurrency(allocation.remaining)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${utilizationPercentage > 90 ? 'bg-red-500' : utilizationPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                    style={{ width: `${utilizationPercentage}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{utilizationPercentage.toFixed(1)}% utilized</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-primary hover:text-primary-dark mr-3">Adjust</button>
                                <button className="text-gray-600 hover:text-gray-900">Details</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Budget Allocation Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaExchangeAlt className="text-blue-500 mr-2" />
                      Budget Reallocation
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Transfer budget between committees to optimize resource allocation.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Committee</label>
                        <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                          <option value="">Select Committee</option>
                          {committees.map(committee => (
                            <option key={committee.id} value={committee.id}>{committee.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Committee</label>
                        <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                          <option value="">Select Committee</option>
                          {committees.map(committee => (
                            <option key={committee.id} value={committee.id}>{committee.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                          </div>
                          <input
                            type="text"
                            className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea 
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          rows="3"
                          placeholder="Explain the reason for this reallocation"
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end">
                        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                          Submit Reallocation
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaCalculator className="text-green-500 mr-2" />
                      Budget Utilization Forecast
                    </h4>
                    
                    <div className="space-y-4">
                      {budgetAllocations.map(allocation => {
                        const committee = committees.find(c => c.id === allocation.committee);
                        const utilizationPercentage = (allocation.spent / allocation.allocated) * 100;
                        const forecastUtilization = Math.min(utilizationPercentage * 1.5, 100); // Simple forecast
                        
                        return (
                          <div key={allocation.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-gray-800">{committee?.name || 'Unknown'}</h5>
                              <span className={`text-xs px-2 py-1 rounded-full ${forecastUtilization > 90 ? 'bg-red-100 text-red-800' : forecastUtilization > 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                {forecastUtilization > 90 ? 'At Risk' : forecastUtilization > 70 ? 'On Track' : 'Under Budget'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-600">Current:</span>
                              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="h-1.5 rounded-full bg-blue-500" 
                                  style={{ width: `${utilizationPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-gray-700">{utilizationPercentage.toFixed(1)}%</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm mt-1">
                              <span className="text-gray-600">Forecast:</span>
                              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${forecastUtilization > 90 ? 'bg-red-500' : forecastUtilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                  style={{ width: `${forecastUtilization}%` }}
                                ></div>
                              </div>
                              <span className="text-gray-700">{forecastUtilization.toFixed(1)}%</span>
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-2">
                              {forecastUtilization > 90 
                                ? 'Projected to exceed budget. Consider reallocation.' 
                                : forecastUtilization > 70 
                                  ? 'On track to utilize allocated budget.' 
                                  : 'Projected to under-utilize. Consider reallocating excess.'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {budgetView === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Summary Cards */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800 flex items-center">
                      <FaWallet className="text-green-500 mr-2" />
                      Total Income
                    </h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      All Sources
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {formatCurrency(calculateTotalIncome())}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    From {incomes.length} income sources
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800 flex items-center">
                      <FaReceipt className="text-red-500 mr-2" />
                      Total Expenses
                    </h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                      All Categories
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {formatCurrency(calculateTotalExpenses())}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    From {expenses.length} expense entries
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800 flex items-center">
                      <FaBalanceScale className="text-blue-500 mr-2" />
                      Remaining Budget
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${calculateRemainingBudget() >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {calculateRemainingBudget() >= 0 ? 'Surplus' : 'Deficit'}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${calculateRemainingBudget() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(calculateRemainingBudget())}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {calculateRemainingBudget() >= 0 ? 'Available to spend' : 'Over budget'}
                  </div>
                </div>
                
                {/* Expense Breakdown Chart */}
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                  <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                    <FaChartPie className="text-primary mr-2" />
                    Expense Breakdown by Category
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {calculateExpensesByCategory().map((category, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-1" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-xs text-gray-600">{category.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    {/* This would be a real chart in a production app */}
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="w-40 h-40 rounded-full overflow-hidden relative">
                        {calculateExpensesByCategory().map((category, index, array) => {
                          const total = array.reduce((sum, cat) => sum + cat.amount, 0);
                          const percentage = (category.amount / total) * 100;
                          const previousPercentages = array
                            .slice(0, index)
                            .reduce((sum, cat) => sum + (cat.amount / total) * 100, 0);
                          
                          return (
                            <div 
                              key={index}
                              className="absolute top-0 left-0 w-full h-full"
                              style={{
                                backgroundColor: category.color,
                                clipPath: `conic-gradient(from ${previousPercentages * 3.6}deg, ${category.color} 0deg, ${category.color} ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg, transparent 360deg)`
                              }}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Income Breakdown Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                    <FaChartBar className="text-green-500 mr-2" />
                    Income Sources
                  </h4>
                  <div className="space-y-3">
                    {calculateIncomeByCategory().map((category, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <div className="flex-grow">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700">{category.name}</span>
                            <span className="font-medium text-gray-900">{formatCurrency(category.amount)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="h-1.5 rounded-full" 
                              style={{ 
                                width: `${(category.amount / calculateTotalIncome()) * 100}%`,
                                backgroundColor: category.color 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-3">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-800 flex items-center">
                      <FaHistory className="text-gray-500 mr-2" />
                      Recent Transactions
                    </h4>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-xs rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                        All
                      </button>
                      <button className="px-3 py-1 text-xs rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center">
                        <FaArrowDown className="text-red-500 mr-1 text-xs" /> Expenses
                      </button>
                      <button className="px-3 py-1 text-xs rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center">
                        <FaArrowUp className="text-green-500 mr-1 text-xs" /> Income
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Committee
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Show both expenses and incomes, sorted by date */}
                        {[...expenses, ...incomes]
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .slice(0, 5)
                          .map((transaction, index) => {
                            const isIncome = 'agreement' in transaction;
                            return (
                              <tr key={`${isIncome ? 'income' : 'expense'}-${transaction.id}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {transaction.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{transaction.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                    {getBudgetCategoryName(transaction.category, isIncome)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {transaction.committee ? getCommitteeName(transaction.committee) : 'General'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className={`text-sm font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                                    {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isIncome ? 
                                    (transaction.status === 'received' ? 'bg-green-100 text-green-800' : 
                                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-blue-100 text-blue-800') : 
                                    (transaction.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                    'bg-yellow-100 text-yellow-800')}`}>
                                    {transaction.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <button className="text-primary hover:text-primary-dark text-sm font-medium">
                      View All Transactions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
                <Link to="/events" className="text-primary text-sm hover:underline">View All</Link>
              </div>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium text-gray-800">{event.name}</h4>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-600">{event.date}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{event.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">My Tasks</h3>
                <Link to="/tasks" className="text-primary text-sm hover:underline">View All</Link>
              </div>
              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={task.status === 'Completed'} 
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">Due: {task.deadline}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No tasks assigned</p>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <button className="text-primary text-sm hover:underline">Mark All Read</button>
              </div>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification.id} className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No new notifications</p>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Committees</h3>
                <Link to="/committees" className="text-primary text-sm hover:underline">Manage</Link>
              </div>
              <div className="space-y-3">
                {committees.map(committee => (
                  <div key={committee.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                    <div>
                      <h4 className="font-medium text-gray-800">{committee.name}</h4>
                      <p className="text-xs text-gray-500">{committee.members} members</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {committee.events} event{committee.events !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'events':
        return (
          <div>
            {/* Role-based access check - Only show Smart Scheduling to Committee Heads */}
            {isRoleHead ? (
              <div className="space-y-6">
                {/* Smart Scheduling Header */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FaRobot className="text-primary mr-2" />
                        Smart Scheduling System
                      </h3>
                      <p className="text-gray-600 mt-1">
                        AI-powered event scheduling with automatic conflict detection
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button 
                        className={`px-3 py-2 text-sm rounded-md flex items-center ${schedulingView === 'calendar' ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setSchedulingView('calendar')}
                      >
                        <FaCalendarAlt className="mr-1" /> Calendar
                      </button>
                      <button 
                        className={`px-3 py-2 text-sm rounded-md flex items-center ${schedulingView === 'conflicts' ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setSchedulingView('conflicts')}
                      >
                        <FaExclamationTriangle className="mr-1" /> Conflicts
                        {schedulingConflicts.length > 0 && (
                          <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {schedulingConflicts.length}
                          </span>
                        )}
                      </button>
                      <button 
                        className={`px-3 py-2 text-sm rounded-md flex items-center ${schedulingView === 'resources' ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setSchedulingView('resources')}
                      >
                        <FaBuilding className="mr-1" /> Venues
                      </button>
                      <button 
                        className="px-3 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
                        onClick={() => setShowAISuggestions(!showAISuggestions)}
                      >
                        <FaLightbulb className="mr-1 text-yellow-500" /> AI Suggestions
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* AI Suggestions Panel */}
                {showAISuggestions && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        <FaLightbulb className="text-yellow-500 mr-2" />
                        AI-Powered Suggestions
                      </h4>
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setShowAISuggestions(false)}
                      >
                        &times;
                      </button>
                    </div>
                    <div className="space-y-3">
                      {aiSuggestions.map(suggestion => (
                        <div key={suggestion.id} className="flex items-start">
                          <div className={`mt-1 h-2 w-2 rounded-full ${suggestion.confidence === 'high' ? 'bg-green-500' : 'bg-yellow-500'} flex-shrink-0`}></div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-800">{suggestion.suggestion}</p>
                            <p className="text-xs text-gray-500 capitalize">{suggestion.type} • {suggestion.confidence} confidence</p>
                          </div>
                          <button className="ml-auto text-primary text-sm hover:underline">Apply</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Smart Scheduling Views */}
                {schedulingView === 'calendar' && (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Calendar Navigation */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                      <button className="p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h4 className="font-medium text-gray-800">June 2023</h4>
                      <button className="p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="overflow-x-auto">
                      <div className="min-w-max">
                        {/* Days of Week Header */}
                        <div className="grid grid-cols-8 border-b border-gray-200">
                          <div className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                            Time
                          </div>
                          {daysOfWeek.map((day, index) => (
                            <div key={day} className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Time Slots */}
                        {timeSlots.map((time, timeIndex) => (
                          <div key={time} className="grid grid-cols-8 border-b border-gray-200 hover:bg-gray-50">
                            {/* Time Column */}
                            <div className="py-3 px-3 text-xs font-medium text-gray-500 border-r border-gray-200 flex items-center">
                              {time}
                            </div>
                            
                            {/* Day Columns */}
                            {daysOfWeek.map((day, dayIndex) => {
                              // Get events for this day and time slot (simplified logic for demo)
                              const dayEvents = getEventsForDay(dayIndex).filter(e => 
                                e.startTime <= time && e.endTime > time
                              );
                              
                              return (
                                <div 
                                  key={`${day}-${time}`} 
                                  className="py-2 px-1 min-h-[60px] border-r border-gray-100 relative"
                                >
                                  {dayEvents.map(event => (
                                    <div 
                                      key={event.id}
                                      className={`absolute left-0 right-0 mx-1 p-1 rounded text-xs ${timeIndex === timeSlots.indexOf(event.startTime) ? 'rounded-t' : ''} ${timeIndex === timeSlots.indexOf(event.endTime) - 1 ? 'rounded-b' : ''} ${event.committee === 'Technical' ? 'bg-blue-100 text-blue-800 border-l-2 border-blue-500' : 'bg-purple-100 text-purple-800 border-l-2 border-purple-500'}`}
                                      style={{
                                        // Only show event at its start time
                                        display: timeIndex === timeSlots.indexOf(event.startTime) ? 'block' : 'none',
                                        // Height based on duration
                                        height: `${(timeSlots.indexOf(event.endTime) - timeSlots.indexOf(event.startTime)) * 60}px`,
                                        zIndex: 10
                                      }}
                                    >
                                      <div className="font-medium truncate">{event.name}</div>
                                      <div className="truncate text-xs opacity-75">{event.venue}</div>
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Calendar Actions */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center">
                          <FaFilter className="mr-1 text-xs" /> Filter
                        </button>
                        <button className="px-3 py-1 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center">
                          <FaSync className="mr-1 text-xs" /> Refresh
                        </button>
                      </div>
                      <div>
                        <button className="px-3 py-1 text-sm rounded-md bg-primary text-white hover:bg-primary-dark flex items-center">
                          <FaCalendarPlus className="mr-1" /> Add Event
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Conflicts View */}
                {schedulingView === 'conflicts' && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaExclamationTriangle className="text-red-500 mr-2" />
                      Detected Scheduling Conflicts
                    </h4>
                    
                    {schedulingConflicts.length > 0 ? (
                      <div className="space-y-4">
                        {schedulingConflicts.map(conflict => (
                          <div 
                            key={conflict.id} 
                            className={`border-l-4 ${conflict.severity === 'high' ? 'border-red-500 bg-red-50' : conflict.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'} p-4 rounded-r-md`}
                          >
                            <div className="flex justify-between">
                              <h5 className="font-medium text-gray-800 capitalize flex items-center">
                                {conflict.type === 'venue' && <FaBuilding className="mr-2 text-sm" />}
                                {conflict.type === 'personnel' && <FaUserClock className="mr-2 text-sm" />}
                                {conflict.type === 'resource' && <FaClock className="mr-2 text-sm" />}
                                {conflict.type} Conflict
                              </h5>
                              <span className={`text-xs px-2 py-1 rounded-full capitalize ${conflict.severity === 'high' ? 'bg-red-200 text-red-800' : conflict.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}`}>
                                {conflict.severity} priority
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{conflict.description}</p>
                            
                            <div className="mt-3 bg-white bg-opacity-60 p-3 rounded-md">
                              <div className="flex items-start">
                                <FaRobot className="text-primary mt-1 mr-2" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">AI Suggestion:</p>
                                  <p className="text-sm text-gray-600">{conflict.aiSuggestion}</p>
                                </div>
                              </div>
                              <div className="mt-2 flex justify-end space-x-2">
                                <button className="px-3 py-1 text-xs rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                                  Ignore
                                </button>
                                <button className="px-3 py-1 text-xs rounded-md bg-primary text-white hover:bg-primary-dark">
                                  Apply Suggestion
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FaCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <h5 className="text-lg font-medium text-gray-800 mb-1">No Conflicts Detected</h5>
                        <p className="text-gray-600">Your schedule is optimized and conflict-free</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Resources/Venues View */}
                {schedulingView === 'resources' && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FaBuilding className="text-primary mr-2" />
                      Venue Allocation & Availability
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Venue
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Capacity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Resources
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Availability
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {venues.map(venue => (
                            <tr key={venue.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{venue.capacity} people</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                  {venue.resources.map(resource => (
                                    <span key={resource} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                      {resource}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${venue.availability === 'High' ? 'bg-green-100 text-green-800' : venue.availability === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                  {venue.availability}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-primary hover:text-primary-dark mr-3">View Schedule</button>
                                <button className="text-gray-600 hover:text-gray-900">Edit</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Showing {venues.length} venues
                      </div>
                      <button className="px-3 py-1 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center">
                        <FaDownload className="mr-1" /> Export
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Regular Events Table for non-head roles
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Events Management</h3>
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                    Create New Event
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Committee
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {upcomingEvents.map(event => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{event.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{event.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{event.committee}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a href="#" className="text-primary hover:text-primary-dark mr-3">View</a>
                            <a href="#" className="text-gray-600 hover:text-gray-900">Details</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-6">
            {/* AI-Based Team & Task Management Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FaBrain className="text-primary mr-2" />
                    AI-Based Team & Task Management
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Intelligent task assignment and team management with NLP
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`px-3 py-2 text-sm rounded-md flex items-center ${taskManagementView === 'kanban' ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setTaskManagementView('kanban')}
                  >
                    <FaColumns className="mr-1" /> Kanban Board
                  </button>
                  <button 
                    className={`px-3 py-2 text-sm rounded-md flex items-center ${taskManagementView === 'team' ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setTaskManagementView('team')}
                  >
                    <FaUserFriends className="mr-1" /> Team Members
                  </button>
                  <button 
                    className="px-3 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
                    onClick={() => setShowTaskAISuggestions(!showTaskAISuggestions)}
                  >
                    <FaRegLightbulb className="mr-1 text-yellow-500" /> AI Recommendations
                  </button>
                </div>
              </div>
            </div>
            
            {/* AI Task Recommendations Panel */}
            {showTaskAISuggestions && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800 flex items-center">
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
                  {taskRecommendations.map(recommendation => (
                    <div key={recommendation.id} className="flex items-start bg-white bg-opacity-60 p-3 rounded-md">
                      <div className="flex-shrink-0 mt-1">
                        {recommendation.type === 'reassignment' && <FaExchangeAlt className="text-blue-500" />}
                        {recommendation.type === 'workload' && <FaUserClock className="text-orange-500" />}
                        {recommendation.type === 'deadline' && <FaRegClock className="text-red-500" />}
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-800 capitalize">{recommendation.type} Recommendation</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${recommendation.confidence === 'high' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {recommendation.confidence} confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{recommendation.reason}</p>
                        <p className="text-sm font-medium text-primary mt-1">{recommendation.suggestion}</p>
                        <p className="text-xs text-gray-500 mt-1">Impact: {recommendation.impact}</p>
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
            {taskManagementView === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* To-Do Column */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800 flex items-center">
                      <FaListUl className="text-gray-500 mr-2" />
                      To-Do
                      <span className="ml-2 bg-gray-200 text-gray-700 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getTasksByStatus('Not Started').length}
                      </span>
                    </h4>
                  </div>
                  <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                    {getTasksByStatus('Not Started').map(task => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-gray-800">{task.title}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                              {getTeamMember(task.assignee)?.avatar || '?'}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{getTeamMember(task.assignee)?.name || 'Unassigned'}</span>
                          </div>
                          <span className="text-xs text-gray-500">Due: {task.deadline}</span>
                        </div>
                        {task.dependencies.length > 0 && !canTaskBeStarted(task.id) && (
                          <div className="mt-2 text-xs text-red-500 flex items-center">
                            <FaLink className="mr-1" /> Waiting on dependencies
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* In Progress Column */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800 flex items-center">
                      <FaHourglassHalf className="text-blue-500 mr-2" />
                      In Progress
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getTasksByStatus('In Progress').length}
                      </span>
                    </h4>
                  </div>
                  <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                    {getTasksByStatus('In Progress').map(task => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-gray-800">{task.title}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Progress: {task.progress}%</span>
                            <span>{task.estimatedHours} hours estimated</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                              {getTeamMember(task.assignee)?.avatar || '?'}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{getTeamMember(task.assignee)?.name || 'Unassigned'}</span>
                          </div>
                          <span className="text-xs text-gray-500">Due: {task.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Completed Column */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800 flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      Completed
                      <span className="ml-2 bg-green-100 text-green-800 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getTasksByStatus('Completed').length}
                      </span>
                    </h4>
                  </div>
                  <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                    {getTasksByStatus('Completed').map(task => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow opacity-75">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-gray-800 line-through">{task.title}</h5>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">
                              {getTeamMember(task.assignee)?.avatar || '?'}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{getTeamMember(task.assignee)?.name || 'Unassigned'}</span>
                          </div>
                          <span className="text-xs text-gray-500">Completed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Team Members View */}
            {taskManagementView === 'team' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                  <FaUserFriends className="text-primary mr-2" />
                  Team Member Profiles
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map(member => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-medium">
                          {member.avatar}
                        </div>
                        <div className="ml-3">
                          <h5 className="font-medium text-gray-800">{member.name}</h5>
                          <p className="text-xs text-gray-500">{member.role} • {member.committee}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Skills</h6>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map(skill => (
                            <div key={skill} className="flex items-center px-2 py-1 bg-gray-100 rounded-full">
                              <span className="text-xs text-gray-800">{skill}</span>
                              <div className="ml-1 flex items-center">
                                {[...Array(member.skillLevels[skill] || 0)].map((_, i) => (
                                  <FaStar key={i} className="text-yellow-400 text-xs" />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Availability</h6>
                        <div className="space-y-1">
                          {member.availability.map((avail, index) => (
                            <div key={index} className="flex justify-between text-xs">
                              <span className="text-gray-600">{avail.date}</span>
                              <span className="text-gray-800">
                                {avail.slots.join(', ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Workload</h6>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${member.workload <= 2 ? 'bg-green-500' : member.workload <= 4 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${(member.workload / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{member.workload}/5</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <button className="text-xs text-primary hover:underline">View Full Profile</button>
                        <button className="px-3 py-1 text-xs rounded-md bg-primary text-white hover:bg-primary-dark">
                          Assign Task
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Create New Task Button */}
            <div className="fixed bottom-6 right-6">
              <button className="h-14 w-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        );
      default:
        return <div>Content not available</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-primary">Eventra</Link>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                <FaBell className="h-5 w-5" />
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="mt-1 text-sm text-gray-500">
                {user.role} • {user.committee} Committee • College Code: {user.collegeCode}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link to="/settings" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <FaCog className="mr-2 -ml-1 h-4 w-4" />
                Account Settings
              </Link>
              <Link to="/logout" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none">
                <FaSignOutAlt className="mr-2 -ml-1 h-4 w-4" />
                Logout
              </Link>
            </div>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaChartLine className="inline-block mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'events'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaCalendarAlt className="inline-block mr-2" />
                Events
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'tasks'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaClipboardList className="inline-block mr-2" />
                Tasks
              </button>
              <button
                onClick={() => setActiveTab('committees')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'committees'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaUsers className="inline-block mr-2" />
                Committees
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'budget'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaMoneyBillWave className="inline-block mr-2" />
                Budget
              </button>
            </nav>
          </div>
        </div>
        
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
