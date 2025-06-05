"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const MockDataContext = createContext(null);

export function MockDataProvider({ children }) {
    const [mockDataEnabled, setMockDataEnabled] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setMockDataEnabled(localStorage.getItem('mockDataEnabled') === 'true');
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('mockDataEnabled', mockDataEnabled);
        }
    }, [mockDataEnabled]);

    const toggleMockData = () => {
        setMockDataEnabled(prev => {
            const newState = !prev;
            console.log(`Mock Data Toggled: ${newState}`);
            return newState;
        });
    };

    return (
        <MockDataContext.Provider value={{ mockDataEnabled, toggleMockData }}>
            {children}
        </MockDataContext.Provider>
    );
}

export function useMockDataContext() {
    const context = useContext(MockDataContext);
    if (context === null) {
        throw new Error('useMockDataContext must be used within a MockDataProvider');
    }
    return context;
}
