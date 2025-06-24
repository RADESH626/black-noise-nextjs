import React from 'react';

const MetricCard = ({ title, value }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{value}</p>
        </div>
    );
};

export default MetricCard;
