import React from 'react';

export default function Loading() {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Outer ring */}
        <div className="absolute h-full w-full rounded-full border-4 border-slate-200 dark:border-slate-800" />
        {/* Spinning indicator */}
        <div className="absolute h-full w-full rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 animate-spin" />
        {/* Center core pulse */}
        <div className="h-6 w-6 rounded-full bg-blue-500/10 dark:bg-blue-400/10 animate-ping" />
      </div>
      <h3 className="mt-6 text-base font-semibold text-slate-800 dark:text-slate-200">
        Loading tasks...
      </h3>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        Synchronizing with database records.
      </p>
    </div>
  );
}
