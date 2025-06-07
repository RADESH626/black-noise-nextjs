// Archivo principal para exportar todos los datos de prueba
export { mockUsuarios } from './usuarios';
export { mockDesigns } from './designs';
export { mockPedidos } from './pedidos';
export { mockProveedores } from './proveedores';
export { mockVentas } from './ventas';
export { mockPagos } from './pagos';
export { mockSolicitudesProveedor } from './solicitudesProveedor';

// Importar todos los datos
import { mockUsuarios } from './usuarios';
import { mockDesigns } from './designs';
import { mockPedidos } from './pedidos';
import { mockProveedores } from './proveedores';
import { mockVentas } from './ventas';
import { mockPagos } from './pagos';
import { mockSolicitudesProveedor } from './solicitudesProveedor';

// Función para obtener todos los datos mock
export const getAllMockData = () => ({
  usuarios: mockUsuarios,
  designs: mockDesigns,
  pedidos: mockPedidos,
  proveedores: mockProveedores,
  ventas: mockVentas,
  pagos: mockPagos,
  solicitudesProveedor: mockSolicitudesProveedor
});

// =================== FUNCIONES DE UTILIDAD PARA USUARIOS ===================
export const getMockUsuariosByRol = (rol) => {
  return mockUsuarios.filter(usuario => usuario.rol === rol);
};

export const getMockUsuarioById = (id) => {
  return mockUsuarios.find(usuario => usuario._id === id);
};

export const getMockUsuariosHabilitados = () => {
  return mockUsuarios.filter(usuario => usuario.habilitado === true);
};

// =================== FUNCIONES DE UTILIDAD PARA DISEÑOS ===================
export const getMockDesignsByCategoria = (categoria) => {
  return mockDesigns.filter(design => design.categoria === categoria);
};

export const getMockDesignsByUsuario = (usuarioId) => {
  return mockDesigns.filter(design => design.creadorId === usuarioId);
};

export const getMockDesignsPublicos = () => {
  return mockDesigns.filter(design => design.esPublico === true);
};

export const getMockDesignById = (id) => {
  return mockDesigns.find(design => design.id === id);
};

export const getMockDesignsPopulares = (limit = 5) => {
  return mockDesigns
    .sort((a, b) => b.popularidad - a.popularidad)
    .slice(0, limit);
};

export const searchMockDesigns = (query) => {
  const lowerQuery = query.toLowerCase();
  return mockDesigns.filter(design => 
    design.nombre.toLowerCase().includes(lowerQuery) ||
    design.descripcion.toLowerCase().includes(lowerQuery) ||
    design.palabrasClave.some(palabra => palabra.toLowerCase().includes(lowerQuery))
  );
};

// =================== FUNCIONES DE UTILIDAD PARA PROVEEDORES ===================
export const getMockProveedorById = (id) => {
  return mockProveedores.find(proveedor => proveedor.id === id);
};

export const getMockProveedorByUsuarioId = (usuarioId) => {
  return mockProveedores.find(proveedor => proveedor.usuarioId === usuarioId);
};

export const getMockProveedoresByCategoria = (categoria) => {
  return mockProveedores.filter(proveedor => 
    proveedor.especialidades.includes(categoria)
  );
};

export const getMockProveedoresMejorCalificados = (limit = 5) => {
  return mockProveedores
    .sort((a, b) => b.calificacion - a.calificacion)
    .slice(0, limit);
};

export const getMockProveedoresPorExperiencia = (anosMinimos) => {
  return mockProveedores.filter(proveedor => proveedor.anosExperiencia >= anosMinimos);
};

export const getMockEstadisticasProveedores = () => {
  const total = mockProveedores.length;
  const calificacionPromedio = mockProveedores.reduce((sum, p) => sum + p.calificacion, 0) / total;
  const experienciaPromedio = mockProveedores.reduce((sum, p) => sum + p.anosExperiencia, 0) / total;
  
  return {
    total,
    calificacionPromedio: Math.round(calificacionPromedio * 10) / 10,
    experienciaPromedio: Math.round(experienciaPromedio * 10) / 10,
    conCertificaciones: mockProveedores.filter(p => p.certificaciones.length > 0).length
  };
};

// =================== FUNCIONES DE UTILIDAD PARA PEDIDOS ===================
export const getMockPedidosByEstado = (estado) => {
  return mockPedidos.filter(pedido => pedido.estado === estado);
};

export const getMockPedidosByProveedor = (proveedorId) => {
  return mockPedidos.filter(pedido => pedido.proveedorId === proveedorId);
};

export const getMockPedidosByCliente = (clienteId) => {
  return mockPedidos.filter(pedido => pedido.clienteId === clienteId);
};

export const getMockPedidoById = (id) => {
  return mockPedidos.find(pedido => pedido.id === id);
};

export const getMockEstadisticasPedidos = () => {
  const total = mockPedidos.length;
  const pendientes = getMockPedidosByEstado('PENDIENTE').length;
  const enProduccion = getMockPedidosByEstado('EN_PRODUCCION').length;
  const completados = getMockPedidosByEstado('COMPLETADO').length;
  
  return {
    total,
    pendientes,
    enProduccion,
    completados,
    valorTotal: mockPedidos.reduce((sum, p) => sum + p.valorTotal, 0)
  };
};

export const getMockPedidosRecientes = (limit = 5) => {
  return mockPedidos
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, limit);
};

export const getMockPedidosByRangoFechas = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  return mockPedidos.filter(pedido => {
    const fechaPedido = new Date(pedido.fechaCreacion);
    return fechaPedido >= inicio && fechaPedido <= fin;
  });
};

// =================== FUNCIONES DE UTILIDAD PARA VENTAS ===================
export const getMockVentasByEstado = (estado) => {
  return mockVentas.filter(venta => venta.estado === estado);
};

export const getMockVentasByCliente = (clienteId) => {
  return mockVentas.filter(venta => venta.clienteId === clienteId);
};

export const getMockVentaById = (id) => {
  return mockVentas.find(venta => venta.id === id);
};

export const getMockVentaByPedidoId = (pedidoId) => {
  return mockVentas.find(venta => venta.pedidoId === pedidoId);
};

export const getMockEstadisticasVentas = () => {
  const total = mockVentas.length;
  const ingresosBrutos = mockVentas.reduce((sum, v) => sum + v.montoTotal, 0);
  const comisionesTotal = mockVentas.reduce((sum, v) => sum + v.comisionPlataforma, 0);
  const gananciasProveedores = mockVentas.reduce((sum, v) => sum + v.gananciaProveedor, 0);
  
  return {
    total,
    ingresosBrutos,
    comisionesTotal,
    gananciasProveedores,
    promedioVenta: Math.round(ingresosBrutos / total)
  };
};

export const getMockVentasRecientes = (limit = 5) => {
  return mockVentas
    .sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta))
    .slice(0, limit);
};

export const getMockVentasByRangoFechas = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  return mockVentas.filter(venta => {
    const fechaVenta = new Date(venta.fechaVenta);
    return fechaVenta >= inicio && fechaVenta <= fin;
  });
};

export const getMockVentasByMetodoPago = (metodo) => {
  return mockVentas.filter(venta => venta.metodoPago === metodo);
};

export const getMockIngresosMensuales = () => {
  const ingresosPorMes = {};
  
  mockVentas.forEach(venta => {
    const fecha = new Date(venta.fechaVenta);
    const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!ingresosPorMes[mes]) {
      ingresosPorMes[mes] = 0;
    }
    ingresosPorMes[mes] += venta.montoTotal;
  });
  
  return ingresosPorMes;
};

// =================== FUNCIONES DE UTILIDAD PARA PAGOS ===================
export const getMockPagosByEstado = (estado) => {
  return mockPagos.filter(pago => pago.estado === estado);
};

export const getMockPagosByCliente = (clienteId) => {
  return mockPagos.filter(pago => pago.clienteId === clienteId);
};

export const getMockPagoById = (id) => {
  return mockPagos.find(pago => pago.id === id);
};

export const getMockPagoByVentaId = (ventaId) => {
  return mockPagos.find(pago => pago.ventaId === ventaId);
};

export const getMockPagosByMetodoPago = (metodo) => {
  return mockPagos.filter(pago => pago.metodoPago === metodo);
};

export const getMockEstadisticasPagos = () => {
  const total = mockPagos.length;
  const exitosos = getMockPagosByEstado('COMPLETADO').length;
  const fallidos = getMockPagosByEstado('FALLIDO').length;
  const pendientes = getMockPagosByEstado('PENDIENTE').length;
  
  return {
    total,
    exitosos,
    fallidos,
    pendientes,
    tasaExito: Math.round((exitosos / total) * 100),
    montoTotal: mockPagos.reduce((sum, p) => sum + p.monto, 0)
  };
};

export const getMockPagosRecientes = (limit = 5) => {
  return mockPagos
    .sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago))
    .slice(0, limit);
};

export const getMockPagosByRangoFechas = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  return mockPagos.filter(pago => {
    const fechaPago = new Date(pago.fechaPago);
    return fechaPago >= inicio && fechaPago <= fin;
  });
};

export const getMockReporteComisiones = () => {
  const pagosTarjeta = getMockPagosByMetodoPago('TARJETA_CREDITO');
  const pagosPSE = getMockPagosByMetodoPago('PSE');
  const pagosNequi = getMockPagosByMetodoPago('NEQUI');
  
  return {
    totalComisiones: mockPagos.reduce((sum, p) => sum + (p.comision || 0), 0),
    comisionesPorMetodo: {
      tarjeta: pagosTarjeta.reduce((sum, p) => sum + (p.comision || 0), 0),
      pse: pagosPSE.reduce((sum, p) => sum + (p.comision || 0), 0),
      nequi: pagosNequi.reduce((sum, p) => sum + (p.comision || 0), 0)
    }
  };
};

export const getMockPagosFallidos = () => {
  return getMockPagosByEstado('FALLIDO');
};

// Función para limpiar datos mock (útil para reset en desarrollo)
export const clearMockData = () => {
  console.log('Mock data cleared for development');
};
