"use server"

import connectDB from '@/utils/DBconection';
import Venta from '@/models/Venta';
import Pago from '@/models/Pago';     // Necesario para popular
import Pedido from '@/models/Pedido'; // Necesario para popular
import { revalidatePath } from 'next/cache';
<<<<<<< HEAD
=======
import { mockVentas, getMockVentaById } from '@/data/mock/ventas'; // Import mock data for ventas
import { mockPagos } from '@/data/mock/pagos'; // Import mock data for pagos to simulate populate
import { mockPedidos } from '@/data/mock/pedidos'; // Import mock data for pedidos to simulate populate
import { mockProveedores } from '@/data/mock/proveedores'; // Import mock data for proveedores to simulate populate
import { mockDesigns } from '@/data/mock/designs'; // Import mock data for designs to simulate populate

const isMockModeEnabled = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// Helper para generar IDs únicos (simulado)
const generateUniqueId = (prefix = 'mock') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper para simular populate (re-using or adapting from previous actions)
const simulatePopulate = (item, field, mockDataArray, selectFields) => {
    if (!item || !item[field]) return item;

    // Handle array population (e.g., pagoIds, desingIds)
    if (Array.isArray(item[field])) {
        const populatedArray = item[field].map(id => {
            const foundItem = mockDataArray.find(mock => mock._id === id || mock.id === id);
            if (foundItem) {
                const selected = {};
                if (selectFields) {
                    selectFields.split(' ').forEach(f => {
                        if (foundItem[f]) selected[f] = foundItem[f];
                    });
                } else {
                    selected._id = foundItem._id || foundItem.id;
                    if (foundItem.valorPago) selected.valorPago = foundItem.valorPago;
                    if (foundItem.metodoPago) selected.metodoPago = foundItem.metodoPago;
                    if (foundItem.estadoPago) selected.estadoPago = foundItem.estadoPago;
                    if (foundItem.createdAt) selected.createdAt = foundItem.createdAt;
                    if (foundItem.nombreDesing) selected.nombreDesing = foundItem.nombreDesing;
                }
                return selected;
            }
            return id; // Return original ID if not found
        }).filter(Boolean); // Filter out nulls if any
        return { ...item, [field]: populatedArray };
    }

    // Handle single item population
    const populatedItem = mockDataArray.find(mock => mock._id === item[field] || mock.id === item[field]);
    if (populatedItem) {
        const selected = {};
        if (selectFields) {
            selectFields.split(' ').forEach(f => {
                if (populatedItem[f]) selected[f] = populatedItem[f];
            });
        } else {
            selected._id = populatedItem._id || populatedItem.id;
            if (populatedItem.valorPedido) selected.valorPedido = populatedItem.valorPedido;
            if (populatedItem.estadoPedido) selected.estadoPedido = populatedItem.estadoPedido;
            if (populatedItem.proveedorId) selected.proveedorId = populatedItem.proveedorId;
            if (populatedItem.nombreProveedor) selected.nombreProveedor = populatedItem.nombreProveedor;
            if (populatedItem.fechaEstimadaEntrega) selected.fechaEstimadaEntrega = populatedItem.fechaEstimadaEntrega;
            if (populatedItem.desingIds) selected.desingIds = populatedItem.desingIds;
        }
        return { ...item, [field]: selected };
    }
    return item;
};

>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d

// Crear una nueva venta
async function guardarVenta(data) {
    console.log('DEBUG: Entering guardarVenta with data:', data);
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Simulando guardarVenta.');
        // Convertir pagoIds y detallesVenta a arrays si vienen como strings
        if (data.pagoIds && typeof data.pagoIds === 'string') {
            data.pagoIds = data.pagoIds.split(',').map(id => id.trim()).filter(id => id);
        } else if (!data.pagoIds) {
            data.pagoIds = [];
        }
        if (data.detallesVenta && typeof data.detallesVenta === 'string') {
            data.detallesVenta = data.detallesVenta.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
        } else if (!data.detallesVenta) {
            data.detallesVenta = [];
        }

        const newVenta = {
            ...data,
            id: generateUniqueId('sale'), // Use 'id' as per mock data structure
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estado: data.estado || 'COMPLETADA', // Default state for new sales
            montoTotal: data.montoTotal || 0,
            comisionPlataforma: data.comisionPlataforma || 0,
            gananciaProveedor: data.gananciaProveedor || 0,
        };
        revalidatePath('/admin/ventas');
        return { success: true, message: "Venta creada exitosamente (simulado)", data: newVenta };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        await connectDB();
        console.log('DEBUG: Database connected for guardarVenta.');
        // Convertir pagoIds y detallesVenta a arrays si vienen como strings
        if (data.pagoIds && typeof data.pagoIds === 'string') {
            data.pagoIds = data.pagoIds.split(',').map(id => id.trim()).filter(id => id);
            console.log('DEBUG: Converted pagoIds to array:', data.pagoIds);
        } else if (!data.pagoIds) {
            data.pagoIds = [];
            console.log('DEBUG: pagoIds was empty, initialized as empty array.');
        }
        if (data.detallesVenta && typeof data.detallesVenta === 'string') {
            data.detallesVenta = data.detallesVenta.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            console.log('DEBUG: Converted detallesVenta to array:', data.detallesVenta);
        } else if (!data.detallesVenta) {
            data.detallesVenta = [];
            console.log('DEBUG: detallesVenta was empty, initialized as empty array.');
        }

        const nuevaVenta = new Venta(data);
        console.log('DEBUG: New Venta instance created:', nuevaVenta);
        const ventaGuardada = await nuevaVenta.save();
        console.log('DEBUG: Venta saved to DB:', ventaGuardada);
        revalidatePath('/admin/ventas');
        console.log('DEBUG: Revalidated path /admin/ventas.');
        return { success: true, data: JSON.parse(JSON.stringify(ventaGuardada)) };
    } catch (error) {
        console.error('ERROR in guardarVenta:', error);
        return { error: 'Error al guardar la venta: ' + error.message };
    }
}

// Obtener todas las ventas
async function obtenerVentas() {
    console.log('DEBUG: Entering obtenerVentas.');
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo todas las ventas mock.');
        let ventasSimuladas = mockVentas.map(venta => ({ ...venta }));

        // Simulate populate for pagoIds, pedidoId, proveedorId, desingIds
        ventasSimuladas = ventasSimuladas.map(venta => simulatePopulate(venta, 'pagoIds', mockPagos, 'valorPago metodoPago estadoPago createdAt'));
        ventasSimuladas = ventasSimuladas.map(venta => {
            let populatedVenta = simulatePopulate(venta, 'pedidoId', mockPedidos, 'valorPedido estadoPedido proveedorId fechaEstimadaEntrega designIds');
            if (populatedVenta.pedidoId && populatedVenta.pedidoId.proveedorId) {
                populatedVenta.pedidoId = simulatePopulate(populatedVenta.pedidoId, 'proveedorId', mockProveedores, 'nombreProveedor');
            }
            if (populatedVenta.pedidoId && populatedVenta.pedidoId.designIds) {
                populatedVenta.pedidoId = simulatePopulate(populatedVenta.pedidoId, 'designIds', mockDesigns, 'name imageUrl');
            }
            return populatedVenta;
        });

        return { ventas: ventasSimuladas };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        await connectDB();
        console.log('DEBUG: Database connected for obtenerVentas.');
        const ventas = await Venta.find({})
            .populate('pagoIds', 'valorPago metodoPago estadoPago') 
            .populate({
                path: 'pedidoId',
                select: 'valorPedido estadoPedido proveedorId',
                populate: { path: 'proveedorId', select: 'nombreProveedor' } 
            })
            .lean();
        console.log('DEBUG: Sales retrieved from DB:', ventas.length, 'sales found.');
        return { ventas: JSON.parse(JSON.stringify(ventas)) };
    } catch (error) {
        console.error('ERROR in obtenerVentas:', error);
        return { error: 'Error al obtener las ventas: ' + error.message };
    }
}

// Obtener venta por ID
async function ObtenerVentaPorId(id) {
    console.log('DEBUG: Entering ObtenerVentaPorId with ID:', id);
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo venta mock por ID:', id);
        let venta = getMockVentaById(id);
        if (venta) {
            venta = simulatePopulate(venta, 'pagoIds', mockPagos, 'valorPago metodoPago estadoPago createdAt');
            venta = simulatePopulate(venta, 'pedidoId', mockPedidos, 'valorPedido estadoPedido proveedorId fechaEstimadaEntrega designIds');
            if (venta.pedidoId && venta.pedidoId.proveedorId) {
                venta.pedidoId = simulatePopulate(venta.pedidoId, 'proveedorId', mockProveedores, 'nombreProveedor');
            }
            if (venta.pedidoId && venta.pedidoId.designIds) {
                venta.pedidoId = simulatePopulate(venta.pedidoId, 'designIds', mockDesigns, 'name imageUrl');
            }
            return venta;
        }
        return { error: 'Venta no encontrada (simulado)' };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        await connectDB();
        console.log('DEBUG: Database connected for ObtenerVentaPorId.');
        const venta = await Venta.findById(id)
            .populate('pagoIds', 'valorPago metodoPago estadoPago createdAt')
            .populate({
                path: 'pedidoId',
                select: 'valorPedido estadoPedido proveedorId fechaEstimadaEntrega desingIds',
                populate: [
                    { path: 'proveedorId', select: 'nombreProveedor' },
                    { path: 'desingIds', select: 'nombreDesing' }
                ]
            })
            .lean();
        console.log('DEBUG: Sale retrieved from DB:', venta);
        if (!venta) {
            console.log('DEBUG: Sale not found for ID:', id);
            return { error: 'Venta no encontrada' };
        }
        console.log('DEBUG: Exiting ObtenerVentaPorId with sale:', JSON.parse(JSON.stringify(venta)));
        return JSON.parse(JSON.stringify(venta));
    } catch (error) {
        console.error('ERROR in ObtenerVentaPorId:', error);
        return { error: 'Error al obtener la venta: ' + error.message };
    }
}

// Editar venta (principalmente para cambiar estado, detalles, o asociar/desasociar pagos)
async function EditarVenta(id, data) {
    console.log('DEBUG: Entering EditarVenta with ID:', id, 'and data:', data);
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Simulando edición de venta ID:', id);
        const existingVenta = getMockVentaById(id);
        if (existingVenta) {
            const updatedVenta = {
                ...existingVenta,
                ...data,
                updatedAt: new Date().toISOString()
            };
            revalidatePath('/admin/ventas');
            revalidatePath(`/admin/ventas/editar/${id}`);
            return { success: true, message: "Venta actualizada exitosamente (simulado)", data: updatedVenta };
        } else {
            return { error: 'Venta no encontrada para actualizar (simulado)' };
        }
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        await connectDB();
        console.log('DEBUG: Database connected for EditarVenta.');
        
        const updateData = { ...data };
        if (updateData.pagoIds && typeof updateData.pagoIds === 'string') {
            updateData.pagoIds = updateData.pagoIds.split(',').map(id => id.trim()).filter(id => id);
            console.log('DEBUG: Converted updateData.pagoIds to array:', updateData.pagoIds);
        } else if (updateData.hasOwnProperty('pagoIds') && !updateData.pagoIds) {
            updateData.pagoIds = [];
            console.log('DEBUG: updateData.pagoIds was empty, initialized as empty array.');
        }

        if (updateData.detallesVenta && typeof updateData.detallesVenta === 'string') {
            updateData.detallesVenta = updateData.detallesVenta.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            console.log('DEBUG: Converted updateData.detallesVenta to array:', updateData.detallesVenta);
        } else if (updateData.hasOwnProperty('detallesVenta') && !updateData.detallesVenta) {
            updateData.detallesVenta = [];
            console.log('DEBUG: updateData.detallesVenta was empty, initialized as empty array.');
        }
        
        // Campos como pedidoId, comisionAplicacion, valorVenta no deberían cambiar fácilmente desde una edición simple.
        // delete updateData.pedidoId;
        // delete updateData.comisionAplicacion;
        // delete updateData.valorVenta;
        console.log('DEBUG: Update data prepared:', updateData);

        const ventaActualizada = await Venta.findByIdAndUpdate(id, updateData, { new: true }).lean();
        console.log('DEBUG: Sale updated in DB:', ventaActualizada);
        if (!ventaActualizada) {
            console.log('DEBUG: Sale not found for update with ID:', id);
            return { error: 'Venta no encontrada para actualizar' };
        }
        revalidatePath('/admin/ventas');
        revalidatePath(`/admin/ventas/editar/${id}`);
        console.log('DEBUG: Revalidated paths /admin/ventas and /admin/ventas/editar/${id}.');
        return { success: true, data: JSON.parse(JSON.stringify(ventaActualizada)) };
    } catch (error) {
        console.error('ERROR in EditarVenta:', error);
        return { error: 'Error al editar la venta: ' + error.message };
    }
}

// No se implementa EliminarVenta directamente.

export {
    guardarVenta,
    obtenerVentas,
    ObtenerVentaPorId,
    EditarVenta
};
