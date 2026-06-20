import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTask } from '../services/api';
import { useToast } from '../components/Toast';
import { ArrowLeft, ClipboardPlus, FileText, CheckCircle } from 'lucide-react';

export default function AddTask() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');

  // Validation/loading states
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Real-time validation checks
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 20) {
      newErrors.description = `Description must be at least 20 characters (current: ${description.trim().length})`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct validation errors first.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
      });

      if (response.success) {
        showToast('Task created successfully!', 'success');
        navigate('/'); // Redirect to Dashboard
      } else {
        showToast(response.message || 'Failed to create task', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Error creating task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-slide-in">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Form Card Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-850 pb-5 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400">
            <ClipboardPlus className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Create New Task</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Add a new deliverable to your project scope.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="title">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              placeholder="e.g., Integrate Auth Middleware"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-200 ${
                errors.title 
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            {errors.title && (
              <p className="text-xs font-semibold text-rose-500 mt-1 animate-slide-in">{errors.title}</p>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="status">
              Initial Status
            </label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 hover:bg-slate-100/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-300 appearance-none"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </select>
              {/* Custom indicator */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="description">
                Description <span className="text-rose-500">*</span>
              </label>
              <span className={`text-xs font-semibold ${description.trim().length >= 20 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {description.trim().length} / 20+ chars
              </span>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
              }}
              rows="5"
              placeholder="Provide a detailed overview of the task requirements (min 20 characters)..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-200 resize-y ${
                errors.description 
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            {errors.description && (
              <p className="text-xs font-semibold text-rose-500 mt-1 animate-slide-in">{errors.description}</p>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-2.5 text-center rounded-xl text-sm font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-slate-200 border-t-transparent animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
