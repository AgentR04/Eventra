import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:w-2/3 mb-8 md:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Event Planning?
            </h2>
            <p className="text-xl text-white/80">
              Join thousands of college event organizers who are saving time and reducing stress with Eventra.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/signup" 
              className="bg-white text-primary font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 text-lg"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
