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

        fetchProfile();
    }, [userEmail]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`https://expensemanager-jite.onrender.com/api/auth/profile?email=${userEmail}`);
            const { name, email, phoneno, address, dob } = res.data;
            setName(name);
            setEmail(email);
            setPhoneno(phoneno || "");
            setAddress(address || "");
            // Ensure dob is stored as date-only if it includes time
            setDob(dob ? new Date(dob).toISOString().split('T')[0] : "");
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch profile data.");
            setLoading(false);
        }
    };

    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!userEmail) {
            alert("User email not found. Please log in again.");
            return;
        }

        try {
            const res = await axios.put(`https://expensemanager-jite.onrender.com/api/auth/profile`, {
                name,
                email: userEmail,
                phoneno,
                address,
                dob,
            });
            
            // Update all states from the response
            setName(res.data.name);
            setPhoneno(res.data.phoneno || "");
            setAddress(res.data.address || "");
            setDob(res.data.dob ? new Date(res.data.dob).toISOString().split('T')[0] : "");
            
            alert("Profile updated successfully!");
            fetchProfile();
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

    if (loading) {
        return (
            <div className="p-6 bg-gray-900 min-h-screen text-white pt-24 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ کduration: 0.5 }}
                >
                    Loading...
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-900 min-h-screen text-white pt-24 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-red-400"
                >
                    {error}
                </motion.div>
            </div>
        );
    }

    // Format DOB for display (e.g., MM/DD/YYYY)
    const formatDob = (dob) => {
        if (!dob) return "Not provided";
        const date = new Date(dob);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white pt-24">
            <motion.h2 
                className="text-3xl font-bold text-center mb-6 text-blue-400"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Profile 🚀
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Details Section */}
                <motion.div 
                    className="bg-gray-800 p-6 rounded-lg shadow-md"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <FaUser className="text-4xl text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold">{name}</h3>
                        <p className="text-gray-400">{email}</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center">
                            <FaPhone className="text-blue-400 mr-2" />
                            <span>{phoneno ? phoneno : "Not provided"}</span>
                        </div>
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="text-blue-400 mr-2" />
                            <span>{address ? address : "Not provided"}</span>
                        </div>
                        <div className="flex items-center">
                            <FaBirthdayCake className="text-blue-400 mr-2" />
                            <span>{formatDob(dob)}</span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
                        >
                            <FaEdit className="mr-2" />
                            Edit Profile
                        </button>
                    </div>
                </motion.div>

                {/* Static Informational Section */}
                <motion.div 
                    className="bg-gray-800 p-6 rounded-lg shadow-md"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                        <FaInfoCircle className="mr-2 text-blue-400" />
                        Quick Information
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <h4 className="font-semibold">Account Security</h4>
                            <p className="text-sm text-gray-400">
                                Ensure your account is secure by using a strong password and enabling two-factor authentication.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <h4 className="font-semibold">Profile Completeness</h4>
                            <p className="text-sm text-gray-400">
                                Your profile is {phoneno && address && dob ? '100%' : '80%'} complete. {!phoneno || !address || !dob ? 'Add missing information to complete your profile.' : 'Your profile is complete!'}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-700 rounded-lg">
                            <h4 className="font-semibold">Support Equality</h4>
                            <p className="text-sm text-gray-400">
                                Need help? Contact our support team at <span className="text-blue-400">support@example.com</span>.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 pt-24"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <h3 className="text-xl font-bold mb-6">Update Profile</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        value={phoneno}
                                        onChange={(e) => setPhoneno(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Change Password Modal */}
            <AnimatePresence>
                {isChangePasswordOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <h3 className="text-xl font-bold mb-6">Change Password</h3>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                                >
                                    Change Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsChangePasswordOpen(false)}
                                    className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;