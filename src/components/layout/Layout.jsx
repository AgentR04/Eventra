import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect } from 'react';

const Layout = () => {
  // Enable dark mode by default
  useEffect(() => {
    // Set dark mode as default if no preference is stored
    if (localStorage.getItem('darkMode') === null) {
      localStorage.setItem('darkMode', 'true');
    }
    
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
