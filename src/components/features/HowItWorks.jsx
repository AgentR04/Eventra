import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Sign Up & Create Event",
    description: "Create an account and set up your college event with basic details like name, date, and venue."
  },
  {
    number: "02",
    title: "Add Teams & Tasks",
    description: "Define your organizational structure, add team members, and create tasks for each team."
  },
  {
    number: "03",
    title: "Let AI Optimize",
    description: "Our AI will suggest optimal schedules, task assignments, and budget allocations based on your inputs."
  },
  {
    number: "04",
    title: "Monitor & Adjust",
    description: "Track progress in real-time, receive alerts for potential issues, and make adjustments as needed."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your event planning process streamlined in just a few simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 text-8xl font-bold text-primary/10">
                {step.number}
              </div>
              <div className="card relative z-10 h-full">
                <h3 className="text-xl font-semibold text-dark mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
