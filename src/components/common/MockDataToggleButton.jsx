"use client";

import React from 'react';
import { useMockData } from '@/hooks/useMockData';
import BotonGeneral from './botones/BotonGeneral';

function MockDataToggleButton() {
    const { mockDataEnabled, toggleMockData } = useMockData();

    console.log("MockDataToggleButton re-rendered. mockDataEnabled:", mockDataEnabled);

    return (
        <BotonGeneral onClick={toggleMockData}>
            {mockDataEnabled ? 'Desactivar Datos Mock' : 'Activar Datos Mock'}
        </BotonGeneral>
    );
}

export default MockDataToggleButton;
