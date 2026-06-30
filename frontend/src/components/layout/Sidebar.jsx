import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiCheckSquare, FiUser, FiX } from 'react-icons/fi';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/tasks', label: 'Tasks', icon: FiCheckSquare },
  { path: '/profile', label: 'Profile', icon: FiUser },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <motion.aside
        className={`sidebar glass ${isOpen ? 'sidebar-open' : ''}`}
        initial={false}
        animate={{ x: isOpen ? 0 : undefined }}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">👑</span>
            <span className="sidebar-logo-text">Royal Tasks</span>
          </div>
          <button className="sidebar-close btn-ghost" onClick={onClose} aria-label="Close sidebar">
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon className="sidebar-link-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Royal Task Manager v1.0</p>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
