import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { useTasks } from '../hooks/useTasks';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import '../components/tasks/TaskList.css';

const Tasks = () => {
  const {
    tasks,
    loading,
    pagination,
    filters,
    updateFilters,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, data);
      } else {
        await createTask(data);
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage and organize your tasks</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <FiPlus /> New Task
        </button>
      </div>

      <TaskFilters filters={filters} onFilterChange={updateFilters} />

      <TaskList
        tasks={tasks}
        loading={loading}
        onToggle={toggleComplete}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        page={pagination.page}
        pages={pagination.pages}
        total={pagination.total}
        onPageChange={(page) => updateFilters({ page })}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditingTask(null); }}
          loading={submitting}
        />
      </Modal>
    </motion.div>
  );
};

export default Tasks;
