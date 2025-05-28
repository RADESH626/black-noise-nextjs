"use client";

import React from 'react';

function InputGeneral({
    label,
    name,
    type = 'text',
    value,
    onChange,
    required = false,
    min,
    step,
    className = '',
    ...props
}) {
    const inputClasses = `w-full p-3 bg-neutral-800 border border-accent1 rounded-[10px] text-secondary focus:ring-2 focus:ring-accent1 focus:border-accent1 outline-none ${className}`;

    if (type === 'textarea') {
        return (
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-neutral-300 mb-1">
                    {label}
                </label>
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={inputClasses}
                    rows={4}
                    {...props}
                />
            </div>
        );
    }

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                step={step}
                className={inputClasses}
                {...props}
            />
        </div>
    );
}

export default InputGeneral;
