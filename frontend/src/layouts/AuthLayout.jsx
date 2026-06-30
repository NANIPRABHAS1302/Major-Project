import { motion } from 'framer-motion';
import '../styles/auth.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-logo">
          <div className="auth-logo-icon">👑</div>
          <h1>Royal Task Manager</h1>
          <p>Organize your tasks with elegance</p>
        </div>
        <div className="auth-card glass-card">{children}</div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
