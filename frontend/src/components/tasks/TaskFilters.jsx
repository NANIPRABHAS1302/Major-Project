import { FiSearch, FiFilter } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import './TaskFilters.css';

const TaskFilters = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.categories)).catch(() => {});
  }, []);

  const handleChange = (name, value) => {
    onFilterChange({ [name]: value });
  };

  return (
    <div className="task-filters">
      <div className="filters-top">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
          <FiFilter /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel glass-card">
          <div className="filter-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={filters.completed} onChange={(e) => handleChange('completed', e.target.value)}>
              <option value="">All</option>
              <option value="false">Pending</option>
              <option value="true">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Priority</label>
            <select className="form-input" value={filters.priority} onChange={(e) => handleChange('priority', e.target.value)}>
              <option value="">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={filters.category} onChange={(e) => handleChange('category', e.target.value)}>
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Sort By</label>
            <select className="form-input" value={filters.sortBy} onChange={(e) => handleChange('sortBy', e.target.value)}>
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="updatedAt">Updated</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label">Order</label>
            <select className="form-input" value={filters.sortOrder} onChange={(e) => handleChange('sortOrder', e.target.value)}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
