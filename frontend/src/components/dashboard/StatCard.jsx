import { motion } from 'framer-motion';
import './StatCard.css';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <motion.div
      className="stat-card glass-card"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: `${color}20`, color }}>
          <Icon />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </motion.div>
  );
};

export default StatCard;
