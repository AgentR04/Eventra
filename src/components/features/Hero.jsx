import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="btn-primary text-center">
                Get Started
              </Link>
              <Link to="/features" className="btn-secondary text-center">
                Explore Features
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

export default Hero;
