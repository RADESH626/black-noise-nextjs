"use client"; // Add use client directive

import { useState, useEffect } from 'react'; // Import useState and useEffect
import Link from 'next/link';
import AdminPage from '../AdminLayout'; // Adjusted path, assuming AdminLayout is the correct component
import SeccionAcciones from '../secciones/acciones/SeccionAcciones';
import SeccionFooter from '../secciones/acciones/SeccionFooter';
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerDesigns } from '@/app/acciones/DesignActions.js';
import FormFiltrarDesigns from './designs/FormFiltrarDesigns';
import BotonAgregarDesigns from '../../../common/botones/BotonAgregarDesigns';

function DesignsDashboard() { // Remove async keyword
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDesigns() {
            try {
                setLoading(true);
                const result = await obtenerDesigns();
                if (result && result.designs && Array.isArray(result.designs)) {
                    setDesigns(result.designs);
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
        return <p>Cargando diseños...</p>;
    }

    if (error) {
        return <p>Error al cargar diseños: {error}</p>;
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Diseños</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <Link href="/admin/designs/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarDesigns />
                    </Link>
                </SeccionFooter>
            </SeccionAcciones>

            <FormFiltrarDesigns initialDesignsFromPage={designs} /> {/* Pass designs from state */}
        </AdminPage>
    );
}

export default DesignsDashboard;
