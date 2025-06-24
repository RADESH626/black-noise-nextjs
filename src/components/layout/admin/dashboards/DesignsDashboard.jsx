"use client"; // Add use client directive

import { useState, useEffect } from 'react'; // Import useState and useEffect
import Link from 'next/link';
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerDesigns } from '@/app/acciones/DesignActions.js';
import FormFiltrarDesigns from './designs/FormFiltrarDesigns';
import DesignsTable from './designs/DesignsTable'; // Import DesignsTable
import BotonAgregarDesigns from '../../../common/botones/BotonAgregarDesigns';
import Loader from '@/components/Loader';

function DesignsDashboard() { // Remove async keyword
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDesigns() {
            try {
                setLoading(true);
                const result = await obtenerDesigns();
                if (result && result.data && Array.isArray(result.data)) {
                    setDesigns(result.data);
                } else {
                    setError(result?.error || "No se recibió un array de diseños.");
                    console.error("Error al cargar diseños en DesignsDashboard.jsx:", result?.error || "No se recibió un array de diseños.");
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching designs:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDesigns();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error al cargar diseños: {error}</p>;
    }

    return (
        <>
            <SeccionHeader>
                <div className="flex justify-between items-center w-full">
                    <h4 className='font-bold text-2xl text-black'>Gestión de Diseños</h4>
                </div>
            </SeccionHeader>

            <FormFiltrarDesigns /> {/* No longer needs initialDesignsFromPage */}

            <DesignsTable designs={designs} /> {/* Pass designs to DesignsTable */}
        </>
    );
}

export default DesignsDashboard;
