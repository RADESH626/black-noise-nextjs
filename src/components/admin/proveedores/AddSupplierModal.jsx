"use client";

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { crearProveedor } from '@/app/acciones/ProveedorActions'; // Import the server action
import { useSession } from 'next-auth/react'; // Import useSession
import { useDialog } from '@/context/DialogContext'; // Import useDialog
import { CategoriaProducto } from '@/models/enums/CategoriaProducto'; // Import CategoriaProducto enum
import { MetodoPago } from '@/models/enums/pago/MetodoPago'; // Import MetodoPago enum
import BotonGeneral from '@/components/common/botones/BotonGeneral';

const AddSupplierModal = ({ onSuccess, onModalClose }) => { // Removed isOpen, onClose
    const { data: session } = useSession(); // Get session data
    const { showPopUp } = useDialog(); // Use the dialog context
    const localStorageKey = 'addSupplierFormData';

    const [formData, setFormData] = useState(() => {
        // Initialize state from localStorage or with default values
        if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem(localStorageKey);
            if (savedData) {
                return JSON.parse(savedData);
            }
        }
        return {
            nombre: '', // User's first name
            primerApellido: '', // User's first last name
            numeroDocumento: '', // User's document number
            numeroTelefono: '', // User's phone number
            nombreEmpresa: '',
            emailContacto: '',
            telefonoContacto: '', // This will be the supplier's contact phone, distinct from user's numeroTelefono
            direccionEmpresa: '',
            nit: '', // New: Supplier's NIT
            especialidad: [], // New: Supplier's specialties (array of strings)
            comision: 0, // New: Supplier's commission (number)
            metodosPagoAceptados: [], // New: Accepted payment methods (array of strings)
            habilitado: true,
        };
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Reset form and clear localStorage when the modal is closed via onModalClose
        // This effect now depends on onModalClose being called when the parent modal closes
        return () => { // Cleanup function
            setFormData({
                nombre: '',
                primerApellido: '',
                numeroDocumento: '',
                numeroTelefono: '',
                nombreEmpresa: '',
                emailContacto: '',
                telefonoContacto: '',
                direccionEmpresa: '',
                nit: '',
                especialidad: [],
                comision: 0,
                metodosPagoAceptados: [],
                habilitado: true,
            });
            if (typeof window !== 'undefined') {
                localStorage.removeItem(localStorageKey); // Clear localStorage on close
            }
        };
    }, [onModalClose]); // Depend on onModalClose to trigger reset

    useEffect(() => {
        // Save form data to localStorage whenever it changes
        if (typeof window !== 'undefined') {
            localStorage.setItem(localStorageKey, JSON.stringify(formData));
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked, options } = e.target;

        if (name === 'especialidad') {
            const selectedOptions = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            setFormData((prevData) => ({
                ...prevData,
                [name]: selectedOptions,
            }));
        } else if (name === 'metodosPagoAceptados') {
            setFormData((prevData) => {
                const newMethods = checked
                    ? [...prevData.metodosPagoAceptados, value]
                    : prevData.metodosPagoAceptados.filter((method) => method !== value);
                return {
                    ...prevData,
                    [name]: newMethods,
                };
            });
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleFillWithMyPhone = () => {
        if (formData.numeroTelefono) { // Use the personal phone number from the form
            setFormData((prevData) => ({
                ...prevData,
                telefonoContacto: prevData.numeroTelefono, // Copy from personal phone
            }));
        } else {
            showPopUp("Por favor, ingresa el 'Teléfono del Contacto (Personal)' primero.", 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create a FormData object from the state
            const form = new FormData();
            for (const key in formData) {
                form.append(key, formData[key]);
            }

            const result = await crearProveedor(null, form); // Pass null for prevState as it's not used here

            if (result.success) {
                showPopUp(result.message, 'success'); // Use showPopUp for success
                onSuccess(); // Call the success callback to re-fetch data in parent
                // Optionally close modal after a short delay
                setTimeout(() => {
                    onModalClose(); // Use onModalClose to close the DialogContext modal
                }, 1500);
            } else {
                showPopUp(result.message || 'Error al agregar el proveedor.', 'error'); // Use showPopUp for error
            }
        } catch (err) {
            console.error("Error adding supplier:", err);
            showPopUp('Error al agregar el proveedor. Inténtalo de nuevo.', 'error'); // Use showPopUp for catch error
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <LoadingSpinner />}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Information Fields */}
                <div>
                    <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
                        Nombre del Contacto:
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="primerApellido" className="block text-gray-700 text-sm font-bold mb-2">
                        Apellido del Contacto:
                    </label>
                    <input
                        type="text"
                        id="primerApellido"
                        name="primerApellido"
                        value={formData.primerApellido}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="numeroDocumento" className="block text-gray-700 text-sm font-bold mb-2">
                        Número de Documento:
                    </label>
                    <input
                        type="text"
                        id="numeroDocumento"
                        name="numeroDocumento"
                        value={formData.numeroDocumento}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="numeroTelefono" className="block text-gray-700 text-sm font-bold mb-2">
                        Teléfono del Contacto (Personal):
                    </label>
                    <input
                        type="text"
                        id="numeroTelefono"
                        name="numeroTelefono"
                        value={formData.numeroTelefono}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                {/* Supplier Information Fields */}
                <div>
                    <label htmlFor="nombreEmpresa" className="block text-gray-700 text-sm font-bold mb-2">
                        Nombre de la Empresa:
                    </label>
                    <input
                        type="text"
                        id="nombreEmpresa"
                        name="nombreEmpresa"
                        value={formData.nombreEmpresa}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="emailContacto" className="block text-gray-700 text-sm font-bold mb-2">
                        Correo de Contacto (Empresa):
                    </label>
                    <input
                        type="email"
                        id="emailContacto"
                        name="emailContacto"
                        value={formData.emailContacto}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="telefonoContacto" className="block text-gray-700 text-sm font-bold mb-2">
                        Teléfono de Contacto (Empresa):
                    </label>
                    <div className="flex items-center">
                        <input
                            type="text"
                            id="telefonoContacto"
                            name="telefonoContacto"
                            value={formData.telefonoContacto}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <BotonGeneral
                            type="button"
                            onClick={handleFillWithMyPhone}
                            variant="info"
                            className="ml-2 text-sm"
                        >
                            Llenar con mis datos
                        </BotonGeneral>
                    </div>
                </div>
                <div>
                    <label htmlFor="direccionEmpresa" className="block text-gray-700 text-sm font-bold mb-2">
                        Dirección de la Empresa:
                    </label>
                    <input
                        type="text"
                        id="direccionEmpresa"
                        name="direccionEmpresa"
                        value={formData.direccionEmpresa}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                {/* New fields for Proveedor model */}
                <div>
                    <label htmlFor="nit" className="block text-gray-700 text-sm font-bold mb-2">
                        NIT:
                    </label>
                    <input
                        type="text"
                        id="nit"
                        name="nit"
                        value={formData.nit}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="comision" className="block text-gray-700 text-sm font-bold mb-2">
                        Comisión (%):
                    </label>
                    <input
                        type="number"
                        id="comision"
                        name="comision"
                        value={formData.comision}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                <div>
                    <label htmlFor="especialidad" className="block text-gray-700 text-sm font-bold mb-2">
                        Especialidad (Categorías de Producto):
                    </label>
                    <select
                        id="especialidad"
                        name="especialidad"
                        multiple
                        value={formData.especialidad}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                        required
                    >
                        {Object.values(CategoriaProducto).map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Métodos de Pago Aceptados:
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {Object.values(MetodoPago).map((method) => (
                            <label key={method} className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="metodosPagoAceptados"
                                    value={method}
                                    checked={formData.metodosPagoAceptados.includes(method)}
                                    onChange={handleChange}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">{method}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="habilitado" className="flex items-center text-gray-700 text-sm font-bold">
                        <input
                            type="checkbox"
                            id="habilitado"
                            name="habilitado"
                            checked={formData.habilitado}
                            onChange={handleChange}
                            className="mr-2 leading-tight"
                        />
                        Habilitado
                    </label>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <BotonGeneral
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Agregando...' : 'Agregar Proveedor'}
                    </BotonGeneral>
                    <BotonGeneral
                        type="button"
                        onClick={onModalClose} // Use onModalClose here
                        variant="secondary"
                        disabled={loading}
                    >
                        Cancelar
                    </BotonGeneral>
                </div>
            </form>
        </>
    );
};

export default AddSupplierModal;
