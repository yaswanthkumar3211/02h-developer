import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, PlusCircle, SearchX } from 'lucide-react';

export default function EmptyState({ hasFilters, onResetFilters }) {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
      {hasFilters ? (
        // Case: No tasks match the applied filters
        <div className="flex flex-col items-center max-w-sm animate-slide-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 mb-6">
            <SearchX className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No matching tasks found
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your search query or status filter didn't match any tasks on this board. Try adjusting your settings.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-6 inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-500/20 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        // Case: Truly empty database (no tasks exist yet)
        <div className="flex flex-col items-center max-w-sm animate-slide-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 mb-6">
            <ClipboardList className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No tasks registered yet
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your project management board is clean. Let's get things moving by adding your first project task.
          </p>
          <Link
            to="/add-task"
            className="mt-6 inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-500/20 transition-all duration-300"
          >
            <PlusCircle className="w-4 h-4" />
            Create Your First Task
          </Link>
        </div>
      )}
    </div>
  );
}
