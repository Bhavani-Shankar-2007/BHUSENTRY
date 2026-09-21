import React from 'react';

/**
 * Reusable Card Container
 */
export const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = 'p-5',
  headerClassName = 'px-5 py-4 border-b border-slate-100'
}) => {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow overflow-hidden ${className}`}>
      {(title || action) && (
        <div className={`flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 ${headerClassName.replace('px-5 py-4 border-b border-slate-100', '')}`}>
          <div>
            {title && <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};
