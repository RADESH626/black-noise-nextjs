"use client";

import React from 'react';

function Input({
    label,
    name,
    type = 'text',
    value,
    onChange,
    required = false,
    min,
    step,
    minLength,
    className = '',
    error,
    helperText,
    placeholder,
    ...props
}) {
    const baseInputClasses = `w-full p-3 bg-neutral-800 border rounded-[10px] text-secondary focus:ring-2 outline-none`;
    const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-accent1 focus:ring-accent1 focus:border-accent1';
    const combinedInputClasses = `${baseInputClasses} ${errorClasses} ${className}`;

    const labelClasses = `block text-sm font-medium mb-1 ${error ? 'text-red-500' : 'text-neutral-300'}`;
    const helperTextClasses = `text-xs mt-1 ${error ? 'text-red-500' : 'text-neutral-400'}`;

    if (type === 'textarea') {
        return (
            <div>
                {label && (
                    <label htmlFor={name} className={labelClasses}>
                        {label}
                    </label>
                )}
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    minLength={minLength}
                    className={combinedInputClasses}
                    rows={4}
                    placeholder={placeholder}
                    {...props}
                />
                {helperText && <p className={helperTextClasses}>{helperText}</p>}
            </div>
        );
    }

    return (
        <div>
            {label && (
                <label htmlFor={name} className={labelClasses}>
                    {label}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                step={step}
                minLength={minLength}
                className={combinedInputClasses}
                placeholder={placeholder}
                {...props}
            />
            {helperText && <p className={helperTextClasses}>{helperText}</p>}
        </div>
    );
}

export default Input;
