import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiCalendar, FiCheck, FiCircle } from 'react-icons/fi';
import { formatDate, isOverdue, priorityLabels } from '../../utils/helpers';
import './TaskCard.css';

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <motion.div
      className={`task-card glass-card ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="task-card-main">
        <button
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggle(task._id)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed ? <FiCheck /> : <FiCircle />}
        </button>

        <div className="task-content">
          <h4 className="task-title">{task.title}</h4>
          {task.description && <p className="task-description">{task.description}</p>}
          <div className="task-meta">
            <span className={`badge badge-${task.priority}`}>{priorityLabels[task.priority]}</span>
            {task.category && (
              <span className="task-category" style={{ borderColor: task.category.color }}>
                {task.category.name}
              </span>
            )}
            {task.dueDate && (
              <span className={`task-due ${overdue ? 'overdue' : ''}`}>
                <FiCalendar /> {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(task)} aria-label="Edit task">
          <FiEdit2 />
        </button>
        <button className="btn btn-ghost btn-sm danger" onClick={() => onDelete(task._id)} aria-label="Delete task">
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
