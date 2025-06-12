import React from 'react';

function Tabla({ headers, data, renderRow }) {
    return (
        <table className="text-left w-full border-gray-400">
            <thead className='border-b border-gray-400 sticky top-0 z-10 bg-white ring ring-gray-500 ring-inset'>
                <tr className='ring ring-gray-500 ring-inset'>
                    {headers.map((header, index) => (
                        <th key={index} className="border border-gray-400 px-4 py-2 tracking-wider">
                            {typeof header === 'object' ? header.label : header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100">
                        {renderRow ? renderRow(item, rowIndex) : (
                            Object.values(item).map((value, colIndex) => (
                                <td key={colIndex} className="border border-gray-400 px-4 py-2">
                                    {value}
                                </td>
                            ))
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Tabla;
