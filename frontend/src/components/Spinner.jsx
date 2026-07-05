import React from 'react';

const Spinner = ({ size = 'md', color = 'indigo' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    indigo: 'border-indigo-600 dark:border-indigo-500',
    white: 'border-white',
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
