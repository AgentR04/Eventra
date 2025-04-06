import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaChartPie, FaBell, FaRobot, FaChartLine, FaMobile } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="card hover:border-primary hover:border"
    >
      <div className="flex items-center mb-4">
        <div className="bg-primary/10 p-3 rounded-lg text-primary mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-dark">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaCalendarAlt size={24} />,
      title: "Smart Scheduling System",
      description: "Auto-detect and resolve scheduling conflicts with AI suggestions for optimal time slots.",
      id: "scheduling"
    },
    {
      icon: <FaUsers size={24} />,
      title: "AI-Based Team Management",
      description: "Assign tasks intelligently based on skills and workload with role-based task assignments.",
      id: "team-management"
    },
    {
      icon: <FaChartPie size={24} />,
      title: "Budget Management & Tracking",
      description: "Track all finances with expense logging, budget allocation, and visual dashboards.",
      id: "budget"
    },
    {
      icon: <FaBell size={24} />,
      title: "Communication System",
      description: "Real-time updates for task changes, schedule updates, and automated reminders.",
      id: "communication"
    },
    {
      icon: <FaRobot size={24} />,
      title: "AI Optimization & Assistant",
      description: "Get recommendations based on past event data and use our AI chatbot for quick answers.",
      id: "ai-assistant"
    },
    {
      icon: <FaChartLine size={24} />,
      title: "Analytics & Reporting",
      description: "Gain insights into team performance, timelines, and generate post-fest analysis reports.",
      id: "analytics"
    },
    {
      icon: <FaMobile size={24} />,
      title: "Mobile-Friendly Access",
      description: "Access from any device with responsive design and role-based logins for all team members.",
      id: "mobile"
    }
  ];

  return (
    <section id="features" className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform offers everything you need to plan and manage successful college events.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
