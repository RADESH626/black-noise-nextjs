"use client";

import { useMockDataContext } from '@/context/MockDataContext';

export function useMockData() {
    const { mockDataEnabled, toggleMockData } = useMockDataContext();
    return { mockDataEnabled, toggleMockData };
}
