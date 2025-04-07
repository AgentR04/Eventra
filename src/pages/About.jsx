import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="dark">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              About Eventra
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The story behind our AI-powered event planning platform
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-dark mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Eventra, we believe that college events should be memorable for the right reasons - not for the stress and chaos of planning them. Our mission is to transform event planning from a daunting task to an enjoyable experience through the power of AI and intuitive design.
              </p>
              <p className="text-lg text-gray-600">
                We're dedicated to empowering student organizers with tools that streamline coordination, enhance collaboration, and optimize resources, allowing them to focus on creating impactful experiences rather than getting lost in logistical details.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"></div>
              <img 
                src="/src/assets/images/about-mission.jpg" 
                alt="Our Mission" 
                className="relative z-10 rounded-lg shadow-xl w-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=Our+Mission';
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 md:order-1 relative"
            >
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-secondary/20 rounded-full filter blur-3xl"></div>
              <img 
                src="/src/assets/images/about-story.jpg" 
                alt="Our Story" 
                className="relative z-10 rounded-lg shadow-xl w-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=Our+Story';
                }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2"
            >
              <h2 className="text-3xl font-bold text-dark mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Eventra was born from the frustrations of a group of college students who experienced firsthand the challenges of organizing large-scale campus events. After struggling with spreadsheets, miscommunications, and last-minute crises during their college festival, they envisioned a better way.
              </p>
              <p className="text-lg text-gray-600">
                Founded in 2023, our team combines expertise in artificial intelligence, user experience design, and event management to create a platform that addresses the unique needs of college event organizers. What started as a solution for one campus has grown into a platform trusted by student organizations across the country.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-dark mb-6">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Eventra
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card text-center"
            >
              <div className="bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-4">Innovation</h3>
              <p className="text-gray-600">
                We continuously push the boundaries of what's possible with AI and technology to solve real problems faced by event organizers.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card text-center"
            >
              <div className="bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-4">Collaboration</h3>
              <p className="text-gray-600">
                We believe in the power of teamwork and design our platform to enhance communication and coordination among event teams.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card text-center"
            >
              <div className="bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark mb-4">Reliability</h3>
              <p className="text-gray-600">
                We understand that events have no room for technical failures, which is why we prioritize building robust, dependable systems.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
