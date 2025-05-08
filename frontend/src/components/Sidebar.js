import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import './Sidebar.css';

// SVG Icons (Heroicons-inspired)
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const TransactionIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AdviceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const BudgetSuggestionIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const closeSidebar = () => {
    console.log("Sidebar close called");
    toggleSidebar();
  };

  // Animation variants for sidebar
  const sidebarVariants = {
    open: {
      x: 0,
      transition: { duration: 0.5, ease: [0.6, 0.05, 0.36, 0.95] },
    },
    closed: {
      x: "-100%",
      transition: { duration: 0.5, ease: [0.6, 0.05, 0.36, 0.95] },
    },
  };

  // Animation variants for links
  const linkVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`sidebar ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <motion.h2
          className="text-3xl font-bold text-blue-200 mb-10 tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          User Dashboard
        </motion.h2>
        <ul>
          {[
            { to: "/user/", label: "Dashboard", Icon: DashboardIcon },
            { to: "/user/add-transaction", label: "Add Transaction", Icon: TransactionIcon },
            { to: "/user/profile", label: "Profile", Icon: ProfileIcon },
            { to: "/user/advice", label: "Finance Advice", Icon: AdviceIcon },
            { to: "/user/budget", label: "Budget Suggestions", Icon: BudgetSuggestionIcon },
          ].map((item, index) => (
            <motion.li
              key={item.to}
              className="mb-4"
              custom={index}
              variants={linkVariants}
              initial="hidden"
              animate="visible"
            >
              <NavLink
                to={item.to}
                className="sidebar-link"
                activeClassName="active-link"
                onClick={closeSidebar}
              >
                <item.Icon />
                <span>{item.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </>
  );
};

export default Sidebar;