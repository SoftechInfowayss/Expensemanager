import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaChalkboardTeacher, FaClock, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { BookOpen, CheckCircle, Clock, Users ,ArrowRight} from "lucide-react";
// Images for the slider (replace with your own)
const sliderImages = [
  "/slider1.jpg",
  "/slider2.jpg",
  "/slider3.jpg",
];

const EnglishPrepHub = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section with Slider */}
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-red-50 to-white p-8 relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-white/90 z-10"></div>

      {/* Left Side: Text Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 text-gray-900 relative z-20"
      >
        <h1 className="text-6xl font-bold mb-6">
          Master the <span className="text-red-600">PTE Exam</span>
        </h1>
        <p className="text-xl mb-8 text-gray-700">
          Your success is our commitment. Join{" "}
          <span className="font-semibold text-red-600">EnglishPrepHub</span> today!
        </p>
        <button className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition duration-300 flex items-center space-x-2">
          <span>Book Your Free Demo</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Additional Features (Icons with Hover Text) */}
        <div className="mt-12 flex justify-center md:justify-start space-x-8">
          {[
            {
              icon: <CheckCircle className="w-10 h-10 text-red-600 hover:text-red-700 transition duration-300" />,
              tooltip: "Proven Strategies",
            },
            {
              icon: <Users className="w-10 h-10 text-red-600 hover:text-red-700 transition duration-300" />,
              tooltip: "Expert Trainers",
            },
            {
              icon: <Clock className="w-10 h-10 text-red-600 hover:text-red-700 transition duration-300" />,
              tooltip: "Flexible Timings",
            },
            {
              icon: <BookOpen className="w-10 h-10 text-red-600 hover:text-red-700 transition duration-300" />,
              tooltip: "Comprehensive Material",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group flex flex-col items-center"
            >
              <div className="mb-2">{feature.icon}</div>
              <span className="absolute top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-700 text-center">
                {feature.tooltip}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12"
        >
          <p className="text-lg text-gray-700 mb-4">
            At <span className="font-semibold text-red-600">EnglishPrepHub</span>, we provide:
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>One-on-one coaching sessions.</li>
            <li>Personalized study plans.</li>
            <li>Mock tests with detailed feedback.</li>
            <li>Flexible class schedules.</li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Right Side: Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="md:w-1/2 flex justify-center relative z-20"
      >
        <img
          src="https://st3.depositphotos.com/9880800/16377/i/450/depositphotos_163770092-stock-photo-multicultural-students-studying-in-park.jpg" // Replace with your image path
          alt="EnglishPrepHub"
          className="w-full max-w-md rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
        />
      </motion.div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10 z-10"></div>
    </div>
      {/* About Section */}
      <div className="py-20 px-4 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10 z-10"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto text-center relative z-20"
      >
        <h2 className="text-4xl font-bold mb-6 text-gray-900">
          Why Choose <span className="text-red-600">EnglishPrepHub</span>?
        </h2>
        <p className="text-lg mb-8 text-gray-700">
          Success in the PTE exam demands more than just practice. It requires
          the right strategies. Our one-on-one sessions and flexible class
          timings will help you master complex listening tasks, refine your
          spoken fluency, and perfect your written responses.
        </p>
        <p className="text-2xl font-semibold text-red-600 mb-12">
          Your Score, Our Promise
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <CheckCircle className="w-12 h-12 text-red-600 mb-4" />,
              title: "Proven Strategies",
              description:
                "Learn the best techniques to ace the PTE exam with our proven strategies.",
            },
            {
              icon: <Users className="w-12 h-12 text-red-600 mb-4" />,
              title: "Expert Trainers",
              description:
                "Get guidance from certified PTE trainers with years of experience.",
            },
            {
              icon: <Clock className="w-12 h-12 text-red-600 mb-4" />,
              title: "Flexible Timings",
              description:
                "Choose class timings that suit your schedule and learn at your own pace.",
            },
            {
              icon: <BookOpen className="w-12 h-12 text-red-600 mb-4" />,
              title: "Comprehensive Material",
              description:
                "Access the best study resources and practice material for the PTE exam.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
      {/* Featured Courses Section */}
      <div className="bg-gray-100 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Minute Mastery",
                price: "$599",
                sessions: "10 one-on-one sessions",
                image: "/course1.jpg",
              },
              {
                title: "Booster Course",
                price: "$299",
                sessions: "7 one-on-one sessions",
                image: "/course2.jpg",
              },
              {
                title: "Flex 15 Days Course",
                price: "$699",
                sessions: "15 one-on-one sessions",
                image: "/course3.jpg",
              },
              {
                title: "Champion Course",
                price: "$799",
                sessions: "30 one-on-one sessions",
                image: "/course4.jpg",
              },
            ].map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-2xl font-bold mb-4">{course.title}</h3>
                <p className="text-red-600 text-3xl font-bold mb-4">
                  {course.price}
                </p>
                <p className="text-gray-600 mb-6">{course.sessions}</p>
                <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300">
                  Enroll Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10 z-10"></div>

      {/* Content */}
      <div className="max-w-7xl mx-auto text-center relative z-20">
        <h2 className="text-4xl font-bold mb-12 text-gray-900">
          Our <span className="text-red-600">Results</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "John Doe",
              score: "90/90",
              feedback:
                "EnglishPrepHub helped me achieve my dream score. The one-on-one sessions were incredibly helpful!",
              image: "/student1.jpg", // Replace with your image path
            },
            {
              name: "Jane Smith",
              score: "88/90",
              feedback:
                "The flexible timings and personalized guidance made all the difference. Highly recommended!",
              image: "/student2.jpg", // Replace with your image path
            },
            {
              name: "Alice Johnson",
              score: "87/90",
              feedback:
                "I improved my speaking and writing skills significantly. Thank you, EnglishPrepHub!",
              image: "/student3.jpg", // Replace with your image path
            },
          ].map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Student Image */}
              <div className="w-full h-48 overflow-hidden rounded-lg mb-6">
                <img
                  src={result.image}
                  alt={result.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Student Details */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white">
                  <FaStar size={24} />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-900">{result.name}</p>
                  <p className="text-sm text-gray-600">PTE Score: {result.score}</p>
                </div>
              </div>

              {/* Feedback */}
              <p className="text-gray-600">{result.feedback}</p>
            </motion.div>
          ))}
        </div>

        {/* Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-12"
        >
          <p className="text-xl mb-6 text-gray-700">
            Ready to achieve your dream PTE score? Join us today!
          </p>
          <button className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition duration-300">
            Book Your Free Demo
          </button>
        </motion.div>
      </div>
    </div>
      {/* Footer Section */}
      <div className="bg-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">EnglishPrepHub</h3>
              <p>Your Success, Our Commitment</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <ul>
                <li>Home</li>
                <li>Courses</li>
                <li>Testimonials</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact Us</h4>
              <p>Email: info@englishprephub.com</p>
              <p>Phone: +123 456 7890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnglishPrepHub;