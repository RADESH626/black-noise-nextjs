"use server"

import connectDB from '@/utils/DBconection';
import Pedido from '@/models/Pedido';
import Design from '@/models/Design';     // Necesario para popular
import Proveedor from '@/models/Proveedor'; // Necesario para popular
import { revalidatePath } from 'next/cache';
<<<<<<< HEAD
=======
import { mockPedidos, getMockPedidoById, getMockPedidosByCliente } from '@/data/mock/pedidos'; // Import mock data for pedidos
import { mockDesigns } from '@/data/mock/designs'; // Import mock data for designs to simulate populate
import { mockProveedores } from '@/data/mock/proveedores'; // Import mock data for proveedores to simulate populate
import { mockUsuarios } from '@/data/mock/usuarios'; // Import mock data for users to simulate populate

const isMockModeEnabled = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// Helper para generar IDs únicos (simulado)
const generateUniqueId = (prefix = 'mock') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper para simular populate (re-using or adapting from PagoActions)
const simulatePopulate = (item, field, mockDataArray, selectFields) => {
    if (!item || !item[field]) return item;

    // Handle array population (e.g., designIds)
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
                    if (foundItem.name) selected.name = foundItem.name; // Example for design name
                    if (foundItem.imageUrl) selected.imageUrl = foundItem.imageUrl; // Example for design image
                }
                return selected;
            }
            return id; // Return original ID if not found
        }).filter(Boolean); // Filter out nulls if any
        return { ...item, [field]: populatedArray };
    }

    // Handle single item population
    const populatedItem = mockDataArray.find(mock => mock._id === item[field] || item.id === item[field]);
    if (populatedItem) {
        const selected = {};
        if (selectFields) {
            selectFields.split(' ').forEach(f => {
                if (populatedItem[f]) selected[f] = populatedItem[f];
            });
        } else {
            selected._id = populatedItem._id || populatedItem.id;
            if (populatedItem.nombreUsuario) selected.nombreUsuario = populatedItem.nombreUsuario;
            if (populatedItem.correo) selected.correo = populatedItem.correo;
            if (populatedItem.name) selected.name = populatedItem.name;
            if (populatedItem.email) selected.email = populatedItem.email;
            if (populatedItem.nombreProveedor) selected.nombreProveedor = populatedItem.nombreProveedor;
            if (populatedItem.contactoPrincipal) selected.contactoPrincipal = populatedItem.contactoPrincipal;
        }
        return { ...item, [field]: selected };
    }
    return item;
};

>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d

// Crear un nuevo pedido
async function guardarPedido(data) {
    console.log('DEBUG: Entering guardarPedido with data:', data);
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Simulando guardarPedido.');
        // Ensure designIds and detallesPedido are arrays for mock data
        if (data.designIds && typeof data.designIds === 'string') {
            data.designIds = data.designIds.split(',').map(id => id.trim()).filter(id => id);
        }
        if (data.detallesPedido && typeof data.detallesPedido === 'string') {
            data.detallesPedido = data.detallesPedido.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
        }

        const newPedido = {
            ...data,
            id: generateUniqueId('order'), // Use 'id' as per mock data structure
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estado: data.estado || 'PENDIENTE', // Default state for new orders
            valorTotal: data.valorTotal || 0, // Default value
        };
        revalidatePath('/admin/pedidos');
        revalidatePath('/perfil');
        return { success: true, message: "Pedido creado exitosamente (simulado)", data: newPedido };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        await connectDB();
        console.log('DEBUG: Database connected for guardarPedido.');
        // Convertir desingIds y detallesPedido a arrays si vienen como strings separados por comas
        if (data.desingIds && typeof data.desingIds === 'string') {
            data.desingIds = data.desingIds.split(',').map(id => id.trim()).filter(id => id);
            console.log('DEBUG: Converted desingIds to array:', data.desingIds);
        }
        if (data.detallesPedido && typeof data.detallesPedido === 'string') {
            data.detallesPedido = data.detallesPedido.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            console.log('DEBUG: Converted detallesPedido to array:', data.detallesPedido);
        }

        const nuevoPedido = new Pedido(data);
        console.log('DEBUG: New Pedido instance created:', nuevoPedido);
        const pedidoGuardado = await nuevoPedido.save();
        console.log('DEBUG: Pedido saved to DB:', pedidoGuardado);
        revalidatePath('/admin/pedidos');
        console.log('DEBUG: Revalidated path /admin/pedidos.');
        return { success: true, data: JSON.parse(JSON.stringify(pedidoGuardado)) };
    } catch (error) {
        console.error('ERROR in guardarPedido:', error);
        return { error: 'Error al guardar el pedido: ' + error.message };
    }
}

// Obtener todos los pedidos
async function obtenerPedidos() {
    console.log('DEBUG: Entering obtenerPedidos.');
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo todos los pedidos mock.');
        let pedidosSimulados = mockPedidos.map(pedido => ({ ...pedido }));

        // Simulate populate for designIds, usuarioId, proveedorId
        pedidosSimulados = pedidosSimulados.map(pedido => simulatePopulate(pedido, 'designIds', mockDesigns, 'name imageUrl'));
        pedidosSimulados = pedidosSimulados.map(pedido => simulatePopulate(pedido, 'usuarioId', mockUsuarios, 'name email'));
        pedidosSimulados = pedidosSimulados.map(pedido => simulatePopulate(pedido, 'proveedorId', mockProveedores, 'nombreProveedor contactoPrincipal'));

        return { pedidos: pedidosSimulados };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        await connectDB();
        console.log('DEBUG: Database connected for obtenerPedidos.');
        const pedidos = await Pedido.find({})
            .populate('desingIds', 'nombreDesing') // Popula nombre de los diseños
            .populate('proveedorId', 'nombreProveedor contactoPrincipal') // Popula algunos campos de Proveedor
            .lean();
        console.log('DEBUG: Orders retrieved from DB:', pedidos.length, 'orders found.');
        return { pedidos: JSON.parse(JSON.stringify(pedidos)) };
    } catch (error) {
        console.error('ERROR in obtenerPedidos:', error);
        return { error: 'Error al obtener los pedidos: ' + error.message };
    }
}

<<<<<<< HEAD
// Obtener pedido por ID
async function ObtenerPedidoPorId(id) {
    console.log('DEBUG: Entering ObtenerPedidoPorId with ID:', id);
=======
// Obtener pedidos por usuario ID
async function obtenerPedidosPorUsuarioId(usuarioId) {
    console.log('DEBUG: Entering obtenerPedidosPorUsuarioId with usuarioId:', usuarioId);
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo pedidos mock por usuario ID:', usuarioId);
        let pedidosSimulados = getMockPedidosByCliente(usuarioId).map(pedido => ({ ...pedido }));

        // Simulate populate for designIds, proveedorId
        pedidosSimulados = pedidosSimulados.map(pedido => simulatePopulate(pedido, 'designIds', mockDesigns, 'name imageUrl'));
        pedidosSimulados = pedidosSimulados.map(pedido => simulatePopulate(pedido, 'proveedorId', mockProveedores, 'nombreProveedor contactoPrincipal'));

        return { pedidos: pedidosSimulados };
    }
    try {
        await connectDB();
        console.log('DEBUG: Database connected for obtenerPedidosPorUsuarioId.');
        const pedidos = await Pedido.find({ usuarioId })
            .populate('designIds', 'name imageUrl')
            .populate('proveedorId', 'nombreProveedor contactoPrincipal')
            .lean();
        console.log('DEBUG: Orders retrieved for user ID:', usuarioId, 'count:', pedidos.length);
        return { pedidos: JSON.parse(JSON.stringify(pedidos)) };
    } catch (error) {
        console.error('ERROR in obtenerPedidosPorUsuarioId:', error);
        return { error: 'Error al obtener los pedidos del usuario: ' + error.message };
    }
}

// Obtener pedido por ID
async function ObtenerPedidoPorId(id) {
    console.log('DEBUG: Entering ObtenerPedidoPorId with ID:', id);
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Obteniendo pedido mock por ID:', id);
        let pedido = getMockPedidoById(id);
        if (pedido) {
            pedido = simulatePopulate(pedido, 'designIds', mockDesigns, 'name imageUrl');
            pedido = simulatePopulate(pedido, 'usuarioId', mockUsuarios, 'name email');
            pedido = simulatePopulate(pedido, 'proveedorId', mockProveedores, 'nombreProveedor contactoPrincipal');
            return pedido;
        }
        return { error: 'Pedido no encontrado (simulado)' };
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        await connectDB();
        console.log('DEBUG: Database connected for ObtenerPedidoPorId.');
        const pedido = await Pedido.findById(id)
            .populate('desingIds', 'nombreDesing imagenDesing')
            .populate('proveedorId', 'nombreProveedor contactoPrincipal')
            .lean();
        console.log('DEBUG: Order retrieved from DB:', pedido);
        if (!pedido) {
            console.log('DEBUG: Order not found for ID:', id);
            return { error: 'Pedido no encontrado' };
        }
        console.log('DEBUG: Exiting ObtenerPedidoPorId with order:', JSON.parse(JSON.stringify(pedido)));
        return JSON.parse(JSON.stringify(pedido));
    } catch (error) {
        console.error('ERROR in ObtenerPedidoPorId:', error);
        return { error: 'Error al obtener el pedido: ' + error.message };
    }
}

// Editar pedido (principalmente para cambiar estado, fecha estimada, detalles)
async function EditarPedido(id, data) {
    console.log('DEBUG: Entering EditarPedido with ID:', id, 'and data:', data);
<<<<<<< HEAD
=======
    if (isMockModeEnabled) {
        console.log('🎭 Mock Mode: Simulando edición de pedido ID:', id);
        const existingPedido = getMockPedidoById(id);
        if (existingPedido) {
            const updatedPedido = {
                ...existingPedido,
                ...data,
                updatedAt: new Date().toISOString()
            };
            revalidatePath('/admin/pedidos');
            revalidatePath(`/admin/pedidos/editar/${id}`);
            return { success: true, message: "Pedido actualizado exitosamente (simulado)", data: updatedPedido };
        } else {
            return { error: 'Pedido no encontrado para actualizar (simulado)' };
        }
    }
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    try {
        await connectDB();
        console.log('DEBUG: Database connected for EditarPedido.');
        
        const updateData = { ...data };
        if (updateData.desingIds && typeof updateData.desingIds === 'string') {
            updateData.desingIds = updateData.desingIds.split(',').map(id => id.trim()).filter(id => id);
            console.log('DEBUG: Converted updateData.desingIds to array:', updateData.desingIds);
        }
        if (updateData.detallesPedido && typeof updateData.detallesPedido === 'string') {
            updateData.detallesPedido = updateData.detallesPedido.split(',').map(detalle => detalle.trim()).filter(detalle => detalle);
            console.log('DEBUG: Converted updateData.detallesPedido to array:', updateData.detallesPedido);
        }
        // No permitir cambiar proveedorId o valorPedido fácilmente desde aquí, podría requerir lógica de negocio más compleja.
        // delete updateData.proveedorId; 
        // delete updateData.valorPedido;
        console.log('DEBUG: Update data prepared:', updateData);

        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, updateData, { new: true }).lean();
        console.log('DEBUG: Order updated in DB:', pedidoActualizado);
        if (!pedidoActualizado) {
            console.log('DEBUG: Order not found for update with ID:', id);
            return { error: 'Pedido no encontrado para actualizar' };
        }
        revalidatePath('/admin/pedidos');
        revalidatePath(`/admin/pedidos/editar/${id}`);
        console.log('DEBUG: Revalidated paths /admin/pedidos and /admin/pedidos/editar/${id}.');
        return { success: true, data: JSON.parse(JSON.stringify(pedidoActualizado)) };
    } catch (error) {
        console.error('ERROR in EditarPedido:', error);
        return { error: 'Error al editar el pedido: ' + error.message };
    }
}

// No se implementa EliminarPedido directamente, los pedidos suelen cambiar de estado (ej. CANCELADO)

export {
    guardarPedido,
    obtenerPedidos,
<<<<<<< HEAD
=======
    obtenerPedidosPorUsuarioId,
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    ObtenerPedidoPorId,
    EditarPedido
};
