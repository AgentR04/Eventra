import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Event Coordinator, Tech Fest 2025",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "Eventra transformed how we organized our annual tech fest. The AI scheduling feature alone saved us countless hours of manual work and prevented several potential conflicts."
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Cultural Secretary, Arts Festival",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "The budget tracking feature is a game-changer! We could visualize our spending in real-time and make adjustments before issues arose. Our finance team loves the detailed reports."
  },
  {
    id: 3,
    name: "Arjun Mehta",
    role: "Student Council President",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    quote: "Managing 15 teams and over 100 volunteers was seamless with Eventra. The task assignment and communication features kept everyone on the same page throughout our week-long festival."
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from event organizers who've transformed their planning process with Eventra
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                    <img 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -left-2 bg-primary rounded-full p-2 text-white">
                    <FaQuoteLeft size={16} />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-lg md:text-xl text-gray-600 italic mb-6">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div>
                  <h4 className="text-xl font-semibold text-dark">{testimonials[currentIndex].name}</h4>
                  <p className="text-gray-500">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md text-primary hover:bg-primary hover:text-white transition-colors duration-300"
            >
              <FaChevronLeft size={20} />
            </button>
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md text-primary hover:bg-primary hover:text-white transition-colors duration-300"
            >
              <FaChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
