import { motion } from "framer-motion";
import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import Footer from "../components/Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/contact", formData);
      toast.success(response.data.message || "Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#080E1D] text-white min-h-screen">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-40 text-center bg-[#0F172A]">
        {/* Animated Background Waves */}
        <div className="absolute inset-0">
          <svg
            className="absolute bottom-0 left-0 w-full h-56 opacity-50"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="url(#waveGradient)"
              fillOpacity="1"
              d="M0,192L48,186.7C96,181,192,171,288,186.7C384,203,480,245,576,250.7C672,256,768,224,864,218.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96V320H0Z"
            ></path>
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#1E3A8A", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#2563EB", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300 drop-shadow-lg hover:shadow-blue-500 transition-all duration-300"
        >
          Let’s Connect 🚀
        </motion.h1>

        {/* Subtitle with Typewriter Effect */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-5 text-xl text-blue-300 max-w-2xl mx-auto px-6 animate-typewriter"
        >
          Empowering you to take control of your expenses with smart solutions!
        </motion.p>

        {/* Glowing Button with Neon Hover Effect */}
        <motion.a
          href="#contact"
          whileHover={{
            scale: 1.15,
            boxShadow: "0px 0px 30px rgba(37, 99, 235, 0.9)",
            textShadow: "0px 0px 10px rgba(255, 255, 255, 0.8)",
          }}
          transition={{ duration: 0.3 }}
          className="mt-10 inline-block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-10 py-4 text-lg font-semibold text-white rounded-full shadow-md hover:shadow-blue-600 transition-all duration-300"
        >
          Get in Touch ✨
        </motion.a>

        {/* Floating Dots Animation */}
        <div className="absolute top-10 left-10 w-5 h-5 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-10 w-6 h-6 bg-cyan-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>

        {/* CSS for Typewriter Animation */}
        <style jsx>{`
          @keyframes typewriter {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }
          .animate-typewriter {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            border-right: 3px solid #ffffff;
            animation: typewriter 3s steps(30, end) infinite alternate;
          }
        `}</style>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto py-16 px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold text-blue-400">Contact Us</h2>
          <p className="text-gray-400">Need support? Reach out via phone, email, or visit us.</p>

          <div className="space-y-5">
            {[
              { icon: <FaPhone />, text: "+1 234 567 890" },
              { icon: <FaEnvelope />, text: "support@expensetracker.com" },
              { icon: <FaMapMarkerAlt />, text: "123 Finance St, New York, USA" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 bg-gradient-to-r from-[#131B2D] to-[#1C2333] p-4 rounded-xl shadow-lg"
              >
                <span className="text-blue-500 text-3xl">{item.icon}</span>
                <p className="text-lg">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Social Media */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-blue-400">Follow Us</h3>
            <div className="flex gap-5 mt-3">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="bg-[#121826] p-4 rounded-full shadow-lg cursor-pointer hover:shadow-blue-400"
                >
                  <Icon className="text-blue-400 text-3xl" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative p-8 rounded-2xl shadow-lg bg-opacity-10 backdrop-blur-xl border border-blue-500 bg-[#1A1F3D]"
        >
          <div className="absolute top-0 right-0 bg-blue-500 w-16 h-16 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 bg-purple-500 w-16 h-16 rounded-tr-full"></div>

          <h2 className="text-3xl font-semibold text-blue-400 mb-6">Send a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: "Your Name", type: "text", name: "name" },
              { label: "Email Address", type: "email", name: "email" },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-gray-300 text-sm">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full p-3 mt-1 rounded-md bg-[#131B2D] text-white focus:ring-2 focus:ring-blue-500 outline-none border border-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-gray-300 text-sm">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="w-full p-3 mt-1 rounded-md bg-[#131B2D] text-white focus:ring-2 focus:ring-blue-500 outline-none border border-blue-500"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-md text-lg font-semibold hover:shadow-xl transition duration-300"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* Google Map */}
      <section className="max-w-7xl mx-auto p-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="overflow-hidden rounded-lg shadow-lg border border-blue-500"
        >
          <iframe
            title="map"
            className="w-full h-72 rounded-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.263544144465!2d-74.00601508459416!3d40.71277577933098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316217d4fb%3A0x76a32b59f74f9b69!2sNew%20York%2C%20USA!5e0!3m2!1sen!2s!4v1634011364563!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;