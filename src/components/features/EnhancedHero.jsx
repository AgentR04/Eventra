import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUniversity, FaUsers, FaArrowRight } from 'react-icons/fa';

const EnhancedHero = () => {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-10 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-6">
              <span className="text-primary">AI-Powered</span> Event Planning Assistant
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Simplify your college fest planning with smart scheduling, team management, and budget tracking. Let AI handle the complexity while you focus on creating memorable experiences.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <Link 
                to="/register-college" 
                className="group flex items-center justify-between bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-300"
              >
                <div className="flex items-center">
                  <FaUniversity className="mr-3 text-xl" />
                  <div>
                    <div className="text-lg">Register College</div>
                    <div className="text-xs font-normal opacity-80">For Admins/Organizers</div>
                  </div>
                </div>
                <FaArrowRight className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
              </Link>
              
              <Link 
                to="/login" 
                className="group flex items-center justify-between bg-white border border-primary text-primary hover:bg-primary/5 font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-300"
              >
                <div className="flex items-center">
                  <FaUsers className="mr-3 text-xl" />
                  <div>
                    <div className="text-lg">Committee Login</div>
                    <div className="text-xs font-normal opacity-80">For Team Members</div>
                  </div>
                </div>
                <FaArrowRight className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2"
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl"></div>
              <img 
                src="/src/assets/images/hero-dashboard.png" 
                alt="Eventra Dashboard" 
                className="relative z-10 rounded-lg shadow-2xl w-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=Eventra+Dashboard';
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHero;
