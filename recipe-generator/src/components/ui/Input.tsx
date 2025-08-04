import React, { forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, ...props }, ref) => {
    const inputClasses = clsx(
      "w-full px-4 py-3 border rounded-lg transition-colors duration-200",
      "focus:ring-2 focus:border-transparent focus:outline-none",
      {
        "border-gray-300 focus:ring-orange-500": !error,
        "border-red-500 focus:ring-red-500": error,
      },
      "dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400",
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helpText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
