import { AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import SkeletonLoader from '../ui/SkeletonLoader';
import { FiInbox } from 'react-icons/fi';

const TaskList = ({ tasks, loading, onToggle, onEdit, onDelete }) => {
  if (loading) {
    return <SkeletonLoader type="list" count={5} />;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state glass-card">
        <FiInbox className="empty-state-icon" />
        <h3 className="empty-state-title">No tasks found</h3>
        <p>Create a new task or adjust your filters</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
