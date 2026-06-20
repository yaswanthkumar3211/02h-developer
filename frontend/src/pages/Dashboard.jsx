import React, { useState, useEffect, useCallback } from 'react';
import { getTasks, updateTask, deleteTask } from '../services/api';
import { useToast } from '../components/Toast';
import TaskCard from '../components/TaskCard';
import TaskFilter from '../components/TaskFilter';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { ListTodo, Clock, PlayCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { showToast } = useToast();

  // Page level states
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [pagination, setPagination] = useState({ totalTasks: 0, totalPages: 1, currentPage: 1, limit: 5 });
  const [loading, setLoading] = useState(true);

  // Filters, Sorting & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });

  // Fetch tasks helper
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTasks({
        search,
        status: statusFilter,
        sort,
        page: currentPage,
        limit: 5,
      });

      if (response.success) {
        setTasks(response.data.tasks);
        setStats(response.data.statistics);
        setPagination(response.data.pagination);
      } else {
        showToast(response.message || 'Failed to fetch tasks', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error connecting to the server', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sort, currentPage, showToast]);

  // Trigger fetch on parameter changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset page to 1 when filters change
  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val) => {
    setSort(val);
    setCurrentPage(1);
  };

  // Complete task handler
  const handleCompleteTask = async (id) => {
    try {
      const response = await updateTask(id, { status: 'Completed' });
      if (response.success) {
        showToast('Task marked as Completed!', 'success');
        fetchTasks(); // Refresh list and stats
      }
    } catch (error) {
      showToast(error.message || 'Failed to update task status', 'error');
    }
  };

  // Delete modal triggers
  const triggerDeleteModal = (id) => {
    setDeleteModal({ isOpen: true, taskId: id });
  };

  const handleConfirmDelete = async () => {
    const { taskId } = deleteModal;
    setDeleteModal({ isOpen: false, taskId: null });
    
    try {
      const response = await deleteTask(taskId);
      if (response.success) {
        showToast('Task deleted successfully', 'success');
        
        // If we delete the last item on the current page, go to the previous page
        if (tasks.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchTasks();
        }
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete task', 'error');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setSort('newest');
    setCurrentPage(1);
  };

  // Check if search/status filters are active
  const hasFilters = search.trim() !== '' || statusFilter !== '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* 1. Statistics Cards Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <ListTodo className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Total Tasks</p>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</h4>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Pending</p>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.pending}</h4>
          </div>
        </div>

        {/* In Progress Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-500">
            <PlayCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">In Progress</p>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.inProgress}</h4>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Completed</p>
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.completed}</h4>
          </div>
        </div>
      </div>

      {/* 2. Filter Controls Component */}
      <TaskFilter
        search={search}
        onSearchChange={handleSearchChange}
        status={statusFilter}
        onStatusChange={handleStatusChange}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {/* 3. Task Listing Area */}
      {loading ? (
        <Loading />
      ) : tasks.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onResetFilters={handleResetFilters} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={triggerDeleteModal}
              />
            ))}
          </div>

          {/* 4. Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/60 pt-6">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalTasks} total tasks)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-900 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, taskId: null })}
      />
    </div>
  );
}
