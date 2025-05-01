import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0B0F19] text-gray-300 py-16 px-6 lg:px-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-900 opacity-10 blur-xl animate-pulse"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-indigo-900 opacity-10 blur-xl animate-pulse delay-300"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        {/* Company Info */}
        <div className="transform hover:-translate-y-1 transition-transform duration-500 ease-in-out">
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            ExpenseEase
          </h2>
          <p className="text-gray-400 mt-3 leading-relaxed">
            Track, budget, and take control of your finances effortlessly.
          </p>
          <div className="mt-4">
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30">
              Get Started
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="transform hover:-translate-y-1 transition-transform duration-500 ease-in-out">
          <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
            Quick Links
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></span>
          </h3>
          <ul className="space-y-3">
            {[
              { name: "Home", path: "/" },
              { name: "About us", path: "/about" },
              { name: "Contact us", path: "/contact" },
              { name: "Sign up", path: "/signup" },
              { name: "Login", path: "/login" },
            ].map((item, index) => (
              <li key={index} className="group">
                <Link
                  to={item.path}
                  className="text-gray-400 hover:text-blue-400 transition-all duration-300 ease-in-out flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="transform hover:-translate-y-1 transition-transform duration-500 ease-in-out">
          <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
            Resources
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></span>
          </h3>
          <ul className="space-y-3">
            {["Privacy Policy", "Terms of Service", "Security", "Help Center"].map((item, index) => (
              <li key={index} className="group">
                <a 
                  href={`#${item.toLowerCase().replace(" ", "-")}`} 
                  className="text-gray-400 hover:text-blue-400 transition-all duration-300 ease-in-out flex items-center"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="transform hover:-translate-y-1 transition-transform duration-500 ease-in-out">
          <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
            Contact Us
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></span>
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 group">
              <div className="mt-1 p-1.5 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-all duration-300">
                <FaMapMarkerAlt className="text-blue-400 text-sm" />
              </div>
              <span className="group-hover:text-blue-400 transition-all duration-300">
                123 Finance Street, NY, USA
              </span>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="mt-1 p-1.5 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-all duration-300">
                <FaPhoneAlt className="text-blue-400 text-sm" />
              </div>
              <a href="tel:+1234567890" className="hover:text-blue-400 transition-all duration-300">
                +1 234 567 890
              </a>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="mt-1 p-1.5 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-all duration-300">
                <FaEnvelope className="text-blue-400 text-sm" />
              </div>
              <a href="mailto:support@expensetracker.com" className="hover:text-blue-400 transition-all duration-300">
                support@expensetracker.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center relative">
        {/* Animated border */}
        <div className="absolute top-0 left-0 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[shimmer_3s_infinite]"></div>
        
        {/* Social Media Icons */}
        <div className="flex gap-5">
          {[
            { icon: FaFacebookF, color: "hover:text-[#1877F2]" },
            { icon: FaTwitter, color: "hover:text-[#1DA1F2]" },
            { icon: FaInstagram, color: "hover:text-[#E4405F]" },
            { icon: FaLinkedinIn, color: "hover:text-[#0A66C2]" }
          ].map(({ icon: Icon, color }, index) => (
            <a 
              key={index} 
              href="#" 
              className={`text-gray-400 ${color} transition-all duration-300 ease-in-out text-lg p-2 rounded-full bg-gray-800 hover:bg-gray-700 hover:scale-110`}
            >
              <Icon />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-sm mt-6 md:mt-0 animate-[pulse_5s_infinite]">
          &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;