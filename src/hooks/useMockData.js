"use client";

<<<<<<< HEAD
import { useState, useEffect } from 'react';
import {
  getAllMockData,
  mockUsuarios,
  getMockUsuariosByRol,
  getMockUsuarioById,
  getMockUsuariosHabilitados,
  mockDesigns,
  getMockDesignsByCategoria,
  getMockDesignsByUsuario,
  getMockDesignsPublicos,
  getMockDesignById,
  getMockDesignsPopulares,
  searchMockDesigns,
  mockProveedores,
  getMockProveedorById,
  getMockProveedorByUsuarioId,
  getMockProveedoresByCategoria,
  getMockProveedoresMejorCalificados,
  getMockProveedoresPorExperiencia,
  getMockEstadisticasProveedores,
  mockPedidos,
  getMockPedidosByEstado,
  getMockPedidosByProveedor,
  getMockPedidosByCliente,
  getMockPedidoById,
  getMockEstadisticasPedidos,
  getMockPedidosRecientes,
  getMockPedidosByRangoFechas,
  mockVentas,
  getMockVentasByEstado,
  getMockVentasByCliente,
  getMockVentaById,
  getMockVentaByPedidoId,
  getMockEstadisticasVentas,
  getMockVentasRecientes,
  getMockVentasByRangoFechas,
  getMockVentasByMetodoPago,
  getMockIngresosMensuales,
  mockPagos,
  getMockPagosByEstado,
  getMockPagosByCliente,
  getMockPagoById,
  getMockPagoByVentaId,
  getMockPagosByMetodoPago,
  getMockEstadisticasPagos,
  getMockPagosRecientes,
  getMockPagosByRangoFechas,
  getMockReporteComisiones,
  getMockPagosFallidos
} from '@/data/mock';

// Configuración para activar/desactivar modo mock
const MOCK_MODE_CONFIG = {
  enabled: process.env.NODE_ENV === 'development', // Solo en desarrollo por defecto
  // También se puede controlar con variables de entorno
  forceEnabled: process.env.NEXT_PUBLIC_MOCK_MODE === 'true'
};

/**
 * Hook personalizado para manejar datos mock
 * Proporciona una interfaz unificada para acceder a datos de prueba
 */
export const useMockData = () => {
  const [mockModeEnabled, setMockModeEnabled] = useState(false);

  useEffect(() => {
    const isEnabled = MOCK_MODE_CONFIG.enabled || MOCK_MODE_CONFIG.forceEnabled;
    setMockModeEnabled(isEnabled);
    
    if (isEnabled) {
      console.log('🎭 Mock Mode activado - Usando datos de prueba');
    }
  }, []);

  // Función para alternar modo mock manualmente
  const toggleMockMode = () => {
    setMockModeEnabled(!mockModeEnabled);
    console.log(`🎭 Mock Mode ${!mockModeEnabled ? 'activado' : 'desactivado'}`);
  };

  // Función para verificar si el modo mock está activo
  const isMockMode = () => mockModeEnabled;

  // =================== USUARIOS ===================
  const usuarios = {
    getAll: () => mockModeEnabled ? mockUsuarios : [],
    getByRol: (rol) => mockModeEnabled ? getMockUsuariosByRol(rol) : [],
    getById: (id) => mockModeEnabled ? getMockUsuarioById(id) : null,
    getHabilitados: () => mockModeEnabled ? getMockUsuariosHabilitados() : [],
    count: () => mockModeEnabled ? mockUsuarios.length : 0
  };

  // =================== DISEÑOS ===================
  const designs = {
    getAll: () => mockModeEnabled ? mockDesigns : [],
    getByCategoria: (categoria) => mockModeEnabled ? getMockDesignsByCategoria(categoria) : [],
    getByUsuario: (usuarioId) => mockModeEnabled ? getMockDesignsByUsuario(usuarioId) : [],
    getPublicos: () => mockModeEnabled ? getMockDesignsPublicos() : [],
    getById: (id) => mockModeEnabled ? getMockDesignById(id) : null,
    getPopulares: (limit = 5) => mockModeEnabled ? getMockDesignsPopulares(limit) : [],
    search: (query) => mockModeEnabled ? searchMockDesigns(query) : [],
    count: () => mockModeEnabled ? mockDesigns.length : 0
  };

  // =================== PROVEEDORES ===================
  const proveedores = {
    getAll: () => mockModeEnabled ? mockProveedores : [],
    getById: (id) => mockModeEnabled ? getMockProveedorById(id) : null,
    getByUsuarioId: (usuarioId) => mockModeEnabled ? getMockProveedorByUsuarioId(usuarioId) : null,
    getByCategoria: (categoria) => mockModeEnabled ? getMockProveedoresByCategoria(categoria) : [],
    getMejorCalificados: (limit = 5) => mockModeEnabled ? getMockProveedoresMejorCalificados(limit) : [],
    getPorExperiencia: (anos) => mockModeEnabled ? getMockProveedoresPorExperiencia(anos) : [],
    getEstadisticas: () => mockModeEnabled ? getMockEstadisticasProveedores() : {},
    count: () => mockModeEnabled ? mockProveedores.length : 0
  };

  // =================== PEDIDOS ===================
  const pedidos = {
    getAll: () => mockModeEnabled ? mockPedidos : [],
    getByEstado: (estado) => mockModeEnabled ? getMockPedidosByEstado(estado) : [],
    getByProveedor: (proveedorId) => mockModeEnabled ? getMockPedidosByProveedor(proveedorId) : [],
    getByCliente: (clienteId) => mockModeEnabled ? getMockPedidosByCliente(clienteId) : [],
    getById: (id) => mockModeEnabled ? getMockPedidoById(id) : null,
    getEstadisticas: () => mockModeEnabled ? getMockEstadisticasPedidos() : {},
    getRecientes: (limit = 5) => mockModeEnabled ? getMockPedidosRecientes(limit) : [],
    getByRangoFechas: (inicio, fin) => mockModeEnabled ? getMockPedidosByRangoFechas(inicio, fin) : [],
    count: () => mockModeEnabled ? mockPedidos.length : 0
  };

  // =================== VENTAS ===================
  const ventas = {
    getAll: () => mockModeEnabled ? mockVentas : [],
    getByEstado: (estado) => mockModeEnabled ? getMockVentasByEstado(estado) : [],
    getByCliente: (clienteId) => mockModeEnabled ? getMockVentasByCliente(clienteId) : [],
    getById: (id) => mockModeEnabled ? getMockVentaById(id) : null,
    getByPedidoId: (pedidoId) => mockModeEnabled ? getMockVentaByPedidoId(pedidoId) : null,
    getEstadisticas: () => mockModeEnabled ? getMockEstadisticasVentas() : {},
    getRecientes: (limit = 5) => mockModeEnabled ? getMockVentasRecientes(limit) : [],
    getByRangoFechas: (inicio, fin) => mockModeEnabled ? getMockVentasByRangoFechas(inicio, fin) : [],
    getByMetodoPago: (metodo) => mockModeEnabled ? getMockVentasByMetodoPago(metodo) : [],
    getIngresosMensuales: () => mockModeEnabled ? getMockIngresosMensuales() : {},
    count: () => mockModeEnabled ? mockVentas.length : 0
  };

  // =================== PAGOS ===================
  const pagos = {
    getAll: () => mockModeEnabled ? mockPagos : [],
    getByEstado: (estado) => mockModeEnabled ? getMockPagosByEstado(estado) : [],
    getByCliente: (clienteId) => mockModeEnabled ? getMockPagosByCliente(clienteId) : [],
    getById: (id) => mockModeEnabled ? getMockPagoById(id) : null,
    getByVentaId: (ventaId) => mockModeEnabled ? getMockPagoByVentaId(ventaId) : null,
    getByMetodoPago: (metodo) => mockModeEnabled ? getMockPagosByMetodoPago(metodo) : [],
    getEstadisticas: () => mockModeEnabled ? getMockEstadisticasPagos() : {},
    getRecientes: (limit = 5) => mockModeEnabled ? getMockPagosRecientes(limit) : [],
    getByRangoFechas: (inicio, fin) => mockModeEnabled ? getMockPagosByRangoFechas(inicio, fin) : [],
    getReporteComisiones: () => mockModeEnabled ? getMockReporteComisiones() : {},
    getFallidos: () => mockModeEnabled ? getMockPagosFallidos() : [],
    count: () => mockModeEnabled ? mockPagos.length : 0
  };

  // =================== DASHBOARD ===================
  const dashboard = {
    getResumenGeneral: () => {
      if (!mockModeEnabled) return {};
      
      return {
        totalUsuarios: usuarios.count(),
        totalDesigns: designs.count(),
        totalProveedores: proveedores.count(),
        totalPedidos: pedidos.count(),
        totalVentas: ventas.count(),
        totalPagos: pagos.count(),
        estadisticasVentas: ventas.getEstadisticas(),
        estadisticasPedidos: pedidos.getEstadisticas(),
        estadisticasPagos: pagos.getEstadisticas(),
        designsPopulares: designs.getPopulares(3),
        pedidosRecientes: pedidos.getRecientes(5),
        ventasRecientes: ventas.getRecientes(5)
      };
    }
  };

  return {
    // Estado del modo mock
    isMockMode,
    toggleMockMode,
    mockModeEnabled,

    // Acceso a datos organizados por entidad
    usuarios,
    designs,
    proveedores,
    pedidos,
    ventas,
    pagos,
    dashboard,

    // Acceso directo a todos los datos (útil para debugging)
    getAllData: () => mockModeEnabled ? getAllMockData() : {}
  };
};

export default useMockData;
=======
import { useMockDataContext } from '@/context/MockDataContext';

export function useMockData() {
    const { mockDataEnabled, toggleMockData } = useMockDataContext();
    return { mockDataEnabled, toggleMockData };
}
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
