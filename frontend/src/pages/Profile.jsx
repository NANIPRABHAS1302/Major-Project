import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { categoryService } from '../services/categoryService';
import { getInitials } from '../utils/helpers';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { theme, setThemeMode } = useTheme();
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6366f1' });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
    }
  }, [user]);

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.categories)).catch(() => {});
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ ...profileData, preferences: { theme } });
    } catch {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    setPasswordLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      // Error handled by context
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    try {
      const response = await categoryService.createCategory(newCategory);
      setCategories((prev) => [...prev, response.category]);
      setNewCategory({ name: '', color: '#6366f1' });
    } catch {
      // Error handled by service
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category? Tasks will be uncategorized.')) {
      try {
        await categoryService.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } catch {
        // Error handled by service
      }
    }
  };

  return (
    <motion.div className="page-container profile-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account settings</p>
      </div>

      <div className="grid grid-2">
        <div className="glass-card profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">{getInitials(user?.name)}</div>
            <div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Theme</label>
              <div className="theme-toggle">
                <button type="button" className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleThemeChange('dark')}>Dark</button>
                <button type="button" className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleThemeChange('light')}>Light</button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        <div className="glass-card profile-card">
          <h3 className="section-title">Change Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
            </div>
            {passwordError && <p className="form-error">{passwordError}</p>}
            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      <div className="glass-card profile-card" style={{ marginTop: '24px' }}>
        <h3 className="section-title">Categories</h3>
        <form onSubmit={handleAddCategory} className="category-form">
          <input className="form-input" placeholder="Category name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
          <input type="color" className="color-input" value={newCategory.color} onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })} />
          <button type="submit" className="btn btn-primary btn-sm"><FiPlus /> Add</button>
        </form>
        <div className="category-list">
          {categories.map((cat) => (
            <div key={cat._id} className="category-item">
              <span className="category-dot" style={{ background: cat.color }} />
              <span>{cat.name}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteCategory(cat._id)} aria-label="Delete category">
                <FiTrash2 />
              </button>
            </div>
          ))}
          {categories.length === 0 && <p className="empty-text">No categories yet</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
