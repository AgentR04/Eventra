import EnhancedHero from "../components/EnhancedHero";
import FeaturesSection from "../components/features/FeaturesSection";
import HowItWorks from "../components/features/HowItWorks";
import Testimonials from "../components/features/Testimonials";
import CallToAction from "../components/features/CallToAction";

const Home = () => {
  return (
    <div className="dark ">
      <EnhancedHero />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;
