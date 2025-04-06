import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaChartPie, FaBell, FaRobot, FaChartLine, FaMobile } from 'react-icons/fa';

const FeatureDetail = ({ id, icon, title, description, details, imageUrl, reverse }) => {
  return (
    <section id={id} className="py-16 border-b border-gray-200 last:border-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
          <motion.div
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-lg text-primary mr-4">
                {icon}
              </div>
              <h2 className="text-3xl font-bold text-dark">{title}</h2>
            </div>
            <p className="text-xl text-gray-600 mb-6">{description}</p>
            <ul className="space-y-4">
              {details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  <div className="text-primary mt-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">{detail}</p>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-overlay"></div>
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/600x400?text=${title.replace(/\s+/g, '+')}`;
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const featuresData = [
    {
      id: "scheduling",
      icon: <FaCalendarAlt size={24} />,
      title: "Smart Scheduling System",
      description: "Automatically create conflict-free event schedules with AI optimization.",
      details: [
        "Auto-detects and resolves scheduling conflicts for rooms, volunteers, judges, and performers",
        "Considers time preferences, venue availability, and event type",
        "Provides drag-and-drop calendar for manual adjustments",
        "Offers AI suggestions for optimal time slots",
        "Syncs with Google Calendar / Outlook (optional)"
      ],
      imageUrl: "/src/assets/images/scheduling.png"
    },
    {
      id: "team-management",
      icon: <FaUsers size={24} />,
      title: "AI-Based Team & Task Management",
      description: "Assign tasks and roles intelligently based on skills and workload.",
      details: [
        "Role-based task assignments using NLP (e.g., 'Design poster', 'Arrange snacks')",
        "Team member profiles with skills, past experience, and availability",
        "Kanban-style board (To-Do, In Progress, Done)",
        "Task dependencies and reminders",
        "AI recommends task reassignment in case of delays or overloads"
      ],
      imageUrl: "/src/assets/images/team-management.png"
    },
    {
      id: "budget",
      icon: <FaChartPie size={24} />,
      title: "Budget Management & Tracking",
      description: "Centralized system to track all finances of the fest.",
      details: [
        "Expense and income logging (categories: food, decor, tech, sponsorship)",
        "Budget allocation per team or event",
        "Visual dashboards (pie charts, bar graphs)",
        "AI alerts for overspending trends",
        "Suggests reallocation strategies or savings opportunities"
      ],
      imageUrl: "/src/assets/images/budget.png"
    },
    {
      id: "communication",
      icon: <FaBell size={24} />,
      title: "Communication & Notification System",
      description: "Reduce miscommunication and ensure everyone is on the same page.",
      details: [
        "Real-time updates for task changes, schedule updates, and budget limits",
        "Role-based announcements (e.g., only Heads get some notifications)",
        "Automated reminders for deadlines",
        "Optional integration with WhatsApp, Discord, Slack"
      ],
      imageUrl: "/src/assets/images/communication.png"
    },
    {
      id: "ai-assistant",
      icon: <FaRobot size={24} />,
      title: "AI Optimization & Assistant Bot",
      description: "Learn from data and offer planning assistance.",
      details: [
        "Recommends improvements based on past event data",
        "AI chatbot assistant for queries like 'Where is the dance event?' or 'What's my next task?'",
        "Predicts high-risk areas for delays or overbookings",
        "Suggests vendors, decorators, or performers based on budget and ratings"
      ],
      imageUrl: "/src/assets/images/ai-assistant.png"
    },
    {
      id: "analytics",
      icon: <FaChartLine size={24} />,
      title: "Analytics & Reporting",
      description: "Provide insights into team performance, timelines, and post-fest analysis.",
      details: [
        "Team performance reports",
        "Delayed vs on-time task analysis",
        "Expense trend analysis",
        "Automated post-event report generation for organizers"
      ],
      imageUrl: "/src/assets/images/analytics.png"
    },
    {
      id: "mobile",
      icon: <FaMobile size={24} />,
      title: "Mobile-Friendly & Multi-User Access",
      description: "Make the system usable for every organizer and volunteer.",
      details: [
        "Responsive web app or lightweight mobile app",
        "Role-based logins (Admin, Team Lead, Volunteer)",
        "Real-time sync across devices",
        "Offline mode for critical functions"
      ],
      imageUrl: "/src/assets/images/mobile.png"
    }
  ];

  return (
    <div>
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Powerful AI-Driven Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the comprehensive tools that make Eventra the ultimate solution for college event planning.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-12">
        {featuresData.map((feature, index) => (
          <FeatureDetail
            key={feature.id}
            id={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            details={feature.details}
            imageUrl={feature.imageUrl}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
