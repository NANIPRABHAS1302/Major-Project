import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <motion.div
        className="not-found-content glass-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-text">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/dashboard" className="btn btn-primary">
          <FiHome /> Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
