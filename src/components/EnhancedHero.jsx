import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const EnhancedHero = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="text-primary">AI-Powered</span> College Fest Planning Assistant
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl">
              Streamline your college fest planning with Eventra. Automate scheduling, task assignments, and coordination across committees.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register-college" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark shadow-md transition-all duration-300"
              >
                <FaUsers className="mr-2" />
                Register College / Committee
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 shadow-md transition-all duration-300"
              >
                <FaCalendarAlt className="mr-2" />
                Committee Member Login
              </Link>
            </div>
            
            <div className="mt-8 flex items-center text-gray-500">
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/women/17.jpg" alt="" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/men/4.jpg" alt="" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/women/3.jpg" alt="" />
              </div>
              <span className="ml-3 text-sm">Trusted by 500+ colleges worldwide</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-primary px-6 py-4 flex items-center justify-between">
                <h3 className="text-white font-medium">Eventra Dashboard</h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Technical Fest 2023</h4>
                    <p className="text-sm text-gray-500">SIES College of Engineering</p>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Active
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-900">Upcoming Events</h5>
                      <span className="text-xs text-primary">View all</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                        <span className="text-sm">Hackathon - June 15</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                        <span className="text-sm">Technical Workshop - June 18</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-gray-900">Task Progress</h5>
                      <span className="text-xs text-primary">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Link to="/login" className="text-primary hover:text-primary-dark text-sm font-medium inline-flex items-center">
                    Access Dashboard
                    <FaArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHero;
