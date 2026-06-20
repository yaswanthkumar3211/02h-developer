import React from 'react';
import { Calendar, CheckCircle, Trash2, Clock, PlayCircle } from 'lucide-react';

export default function TaskCard({ task, onComplete, onDelete }) {
  const { id, title, description, status, created_at } = task;

  // Format the date nicely
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge colors
  const getStatusStyles = (taskStatus) => {
    switch (taskStatus) {
      case 'Completed':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30',
          icon: CheckCircle,
        };
      case 'In Progress':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/30',
          icon: PlayCircle,
        };
      case 'Pending':
      default:
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30',
          icon: Clock,
        };
    }
  };

  const statusStyle = getStatusStyles(status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-blue-500/20">
      {/* Dynamic light blur effect on hover */}
      <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl transition-all duration-500 group-hover:scale-150" />

      <div className="relative">
        {/* Card Header: Title & Status Badge */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {status}
          </span>
        </div>

        {/* Date Row */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>Created on {formatDate(created_at)}</span>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Buttons Footer */}
      <div className="relative mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4">
        {/* Conditional Complete button */}
        {status !== 'Completed' ? (
          <button
            onClick={() => onComplete(id)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Mark as Completed
          </button>
        ) : (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Tasks Finished
          </span>
        )}

        {/* Delete button */}
        <button
          onClick={() => onDelete(id)}
          className="inline-flex items-center gap-1.5 p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-300"
          title="Delete Task"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
