import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckSquare, FiClock, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';
import { taskService } from '../services/taskService';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/dashboard/StatCard';
import { PriorityChart, WeeklyChart } from '../components/dashboard/Charts';
import TaskCard from '../components/tasks/TaskCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    try {
      const response = await taskService.getDashboardStats();
      setStats(response.stats);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleToggle = async (id) => {
    try {
      await taskService.toggleComplete(id);
      success('Task updated');
      await fetchStats();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      success('Task deleted');
      await fetchStats();
    } catch (err) {
      showError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <SkeletonLoader type="stats" />
        <div style={{ marginTop: '24px' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="page-container dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your task management</p>
      </div>

      <div className="grid grid-4">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={FiCheckSquare} color="#6366f1" />
        <StatCard title="Completed" value={stats.completedTasks} icon={FiTrendingUp} color="#22c55e" subtitle={`${stats.completionRate}% completion rate`} />
        <StatCard title="Pending" value={stats.pendingTasks} icon={FiClock} color="#f59e0b" />
        <StatCard title="Overdue" value={stats.overdueTasks} icon={FiAlertTriangle} color="#ef4444" />
      </div>

      <div className="grid grid-2 dashboard-charts" style={{ marginTop: '24px' }}>
        <div className="glass-card">
          <PriorityChart data={stats.priorityStats} />
        </div>
        <div className="glass-card">
          <WeeklyChart data={stats.weeklyProductivity} />
        </div>
      </div>

      <div className="recent-tasks glass-card" style={{ marginTop: '24px' }}>
        <h3 className="section-title">Recent Tasks</h3>
        {stats.recentTasks.length === 0 ? (
          <p className="empty-text">No tasks yet. Create your first task!</p>
        ) : (
          <div className="recent-tasks-list">
            {stats.recentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={() => navigate('/tasks')}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
