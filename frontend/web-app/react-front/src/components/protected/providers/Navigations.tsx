import { useState } from "react";
import { Layout, Users, Activity, Laptop, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: <Layout />, text: "Dashboard" },
  { icon: <Users />, text: "Professionals" },
  { icon: <Activity />, text: "Patient" },
  { icon: <Laptop />, text: "Devices" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between p-4 bg-transparent z-50">
      <div className="flex items-center">
        <img src="/logo.png" alt="logo" className="w-20" />
        <div className="hidden md:flex items-center space-x-6 ml-8">
          {navItems.map((item, index) => (
            <NavItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              active={index === 0}
            />
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
            {isOpen ? <X size={24} /> : <Menu size={24} />}
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
              {navItems.map((item, index) => (
                <MobileNavItem
                  key={item.text}
                  icon={item.icon}
                  text={item.text}
                  active={index === 0}
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
  icon,
  text,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
      ${
        active
          ? "text-white bg-[#1d6cc3] font-bold"
          : "text-white/70 hover:text-white"
      }`}
  >
    <motion.span
      initial={{ rotate: 0 }}
      whileHover={{ rotate: 15, transition: { duration: 0.2 } }}
    >
      {icon}
    </motion.span>
    <span>{text}</span>
  </motion.button>
);

const MobileNavItem = ({
  icon,
  text,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center space-x-4 w-full px-4 py-3 rounded-lg transition-colors
      ${
        active
          ? "text-white bg-white/10"
          : "text-white/70 hover:text-white hover:bg-white/5"
      }`}
  >
    <motion.span
      initial={{ rotate: 0 }}
      whileHover={{ rotate: 15, transition: { duration: 0.2 } }}
    >
      {icon}
    </motion.span>
    <span>{text}</span>
  </motion.button>
);
