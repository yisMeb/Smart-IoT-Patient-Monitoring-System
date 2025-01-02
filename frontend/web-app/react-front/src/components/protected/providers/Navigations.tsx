import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/institutes/h-provider/", text: "Dashboard" },
  { path: "/institutes/h-provider/professionals", text: "Professionals" },
  { path: "/institutes/h-provider/patient", text: "Patient" },
  { path: "/institutes/h-provider/devices", text: "Devices" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between p-4 bg-transparent z-50">
      <div className="flex items-center">
        <img src="/logo1.png" alt="logo" className="w-20" />
        <div className="hidden md:flex items-center space-x-6 ml-8">
          {navItems.map((item) => (
            <NavItem key={item.text} path={item.path} text={item.text} />
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden z-50 text-white hover:text-white/70 transition-colors"
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "close" : "menu"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? "X" : "☰"}
          </motion.div>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-[#046ab2] py-4 px-4 md:hidden z-40"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <MobileNavItem
                  key={item.text}
                  path={item.path}
                  text={item.text}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-10 h-10 rounded-xl bg-white overflow-hidden">
        <img
          src="/thegirl.png"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </nav>
  );
};

const NavItem = ({
  path,
  text,
}: {
  path: string;
  text: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-3 py-2 rounded-lg transition-colors text-white/70 hover:text-white"
  >
    <Link to={path}>{text}</Link>
  </motion.div>
);

const MobileNavItem = ({
  path,
  text,
  onClick,
}: {
  path: string;
  text: string;
  onClick: () => void;
}) => (
  <motion.div
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="w-full px-4 py-3 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/5"
  >
    <Link to={path}>{text}</Link>
  </motion.div>
);
