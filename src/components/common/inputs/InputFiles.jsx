import React from 'react';

function InputFiles({ className = '', ...props }) {
    const combinedClasses = `
        inline-block 
        cursor-pointer 
        rounded-[10px] 
        border 
        border-accent1
        bg-neutral-800
        text-sm
        text-secondary
        hover:bg-neutral-700
        file:mr-3
        file:py-[6px]
        file:px-3
        file:rounded-md
        file:border-0
        file:text-sm
        file:font-medium
        file:bg-accent1
        file:text-primary
        hover:file:bg-accent2
        ${className}
    `;

    return (
        <input
            type="file"
            className={combinedClasses}
            accept=".csv"
            {...props}
        />
    );
}

export default InputFiles;
