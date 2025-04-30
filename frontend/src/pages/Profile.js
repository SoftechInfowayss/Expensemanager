import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaUser, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaEdit, FaLock, FaInfoCircle } from "react-icons/fa";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const userEmail = localStorage.getItem("email");

  // Fetch user profile data
  useEffect(() => {
    if (!userEmail) {
      setError("User email not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://expensebackend-production.up.railway.app/api/auth/profile?email=${userEmail}`);
        const { name, email, phoneno, address, dob } = res.data;
        setName(name);
        setEmail(email);
        setPhoneno(phoneno || "");
        setAddress(address || "");
        setDob(dob || "");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile data.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail]);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      alert("User email not found. Please log in again.");
      return;
    }

    try {
      const res = await axios.put(`https://expensebackend-production.up.railway.app/api/auth/profile`, {
        name,
        email: userEmail,
        phoneno,
        address,
        dob,
      });
      alert("Profile updated successfully!");
      setName(res.data.name);
      setPhoneno(res.data.phoneno || "");
      setAddress(res.data.address || "");
      setDob(res.data.dob || "");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    alert("Password changed successfully!");
    setIsChangePasswordOpen(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white pt-24 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="text-blue-300 text-xl font-medium"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white pt-24 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-red-400 text-xl font-medium"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white pt-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full filter blur-3xl animate-float top-[-200px] left-[-200px]"></div>
        <div className="absolute w-[600px] h-[600px] bg-purple-600/10 rounded-full filter blur-3xl animate-float bottom-[-200px] right-[-200px]"></div>
      </div>

      {/* Header */}
      <motion.h2
        className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Your Profile
      </motion.h2>

      {/* Main Content */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Details Card */}
        <motion.div
          className="bg-gray-800/20 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/20 shadow-2xl"
          variants={itemVariants}
          whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <FaUser className="text-5xl text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white">{name}</h3>
            <p className="text-gray-300 text-sm mt-1">{email}</p>
          </div>

          <div className="mt-8 space-y-5">
            {[
              { icon: FaPhone, label: "Phone", value: phoneno || "Not provided" },
              { icon: FaMapMarkerAlt, label: "Address", value: address || "Not provided" },
              { icon: FaBirthdayCake, label: "Date of Birth", value: dob || "Not provided" },
            ].map((item, index) => (
              <div key={index} className="flex items-center text-gray-200">
                <item.icon className="text-blue-400 mr-3 text-lg" />
                <span className="text-sm font-medium">{item.label}: </span>
                <span className="ml-2">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <motion.button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </motion.button>
            {/* <motion.button
              onClick={() => setIsChangePasswordOpen(true)}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLock className="mr-2" />
              Change Password
            </motion.button> */}
          </div>
        </motion.div>

        {/* Quick Information Card */}
        <motion.div
          className="bg-gray-800/20 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/20 shadow-2xl"
          variants={itemVariants}
          whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <h3 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <FaInfoCircle className="mr-2" />
            Quick Information
          </h3>
          <div className="space-y-5">
            {[
              {
                title: "Account Security",
                desc: "Ensure your account is secure by using a strong password and enabling two-factor authentication.",
              },
              {
                title: "Profile Completeness",
                desc: "Your profile is 80% complete. Add your phone number and address to complete your profile.",
              },
              {
                title: "Support",
                desc: "Need help? Contact our support team at support@example.com.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-5 bg-gray-700/30 rounded-xl border border-gray-600/20"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <h4 className="font-semibold text-white">{item.title}</h4>
                <p className="text-sm text-gray-300 mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 pt-24 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="bg-gray-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700/20"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3 className="text-2xl font-semibold text-blue-300 mb-6">Update Profile</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                {[
                  { label: "Name", value: name, onChange: setName, type: "text", required: true },
                  { label: "Phone Number", value: phoneno, onChange: setPhoneno, type: "text" },
                  { label: "Address", value: address, onChange: setAddress, type: "text" },
                  { label: "Date of Birth", value: dob, onChange: setDob, type: "date" },
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-200 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      required={field.required}
                    />
                  </div>
                ))}
                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangePasswordOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="bg-gray-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700/20"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3 className="text-2xl font-semibold text-blue-300 mb-6">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-5">
                {[
                  { label: "Current Password", type: "password" },
                  { label: "New Password", type: "password" },
                  { label: "Confirm New Password", type: "password" },
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-200 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      required
                    />
                  </div>
                ))}
                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Change Password
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-15px); opacity: 0.5; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;