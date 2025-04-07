import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark dark:bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white">Eventra</Link>
            <p className="mt-4 text-gray-300">
              AI-powered event planning assistant for college fests. Simplify scheduling, team management, and budgeting.
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features#scheduling" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Smart Scheduling
                </Link>
              </li>
              <li>
                <Link to="/features#team-management" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Team Management
                </Link>
              </li>
              <li>
                <Link to="/features#budget" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Budget Tracking
                </Link>
              </li>
              <li>
                <Link to="/features#ai-assistant" className="text-gray-300 hover:text-white transition-colors duration-300">
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="flex items-center space-x-4 mb-4">
              <FaEnvelope className="text-gray-300" />
              <a href="mailto:info@eventra.com" className="text-gray-300 hover:text-white transition-colors duration-300">
                info@eventra.com
              </a>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Eventra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
