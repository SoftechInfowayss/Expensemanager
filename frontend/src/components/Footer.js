import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-[#0B0F19] text-gray-300 py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold text-white">ExpenseEase</h2>
          <p className="text-gray-400 mt-3">Track, budget, and take control of your finances effortlessly.</p>
        </div>

        {/* Quick Links */}
<div>
  <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
  <ul className="space-y-3">
    {[
      { name: "Home", path: "/" },
      { name: "About us", path: "/about" },
      { name: "Contact us", path: "/contact" },
      { name: "Sign up", path: "/signup" },
      { name: "Login", path: "/login" },
    ].map((item, index) => (
      <li key={index}>
        <Link
          to={item.path}
          className="text-gray-400 hover:text-blue-400 transition-all duration-300 ease-in-out"
        >
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-3">
            {["Privacy Policy", "Terms of Service", "Security", "Help Center"].map((item, index) => (
              <li key={index}>
                <a 
                  href={`#${item.toLowerCase().replace(" ", "-")}`} 
                  className="text-gray-400 hover:text-blue-400 transition-all duration-300 ease-in-out"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-400" />
              <span>123 Finance Street, NY, USA</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-400" />
              <a href="tel:+1234567890" className="hover:text-blue-400 transition-all">+1 234 567 890</a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" />
              <a href="mailto:support@expensetracker.com" className="hover:text-blue-400 transition-all">support@expensetracker.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media & Copyright */}
      <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Social Media Icons */}
        <div className="flex gap-4">
          {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
            <a 
              key={index} 
              href="#" 
              className="text-gray-400 hover:text-blue-400 transition-all duration-300 ease-in-out text-lg"
            >
              <Icon />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-sm mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
