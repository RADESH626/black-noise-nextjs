"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getAllMockData,
  mockUsuarios as initialMockUsuarios,
  getMockUsuariosByRol,
  getMockUsuarioById,
  getMockUsuariosHabilitados,
  mockDesigns as initialMockDesigns,
  getMockDesignsByCategoria,
  getMockDesignsByUsuario,
  getMockDesignsPublicos,
  getMockDesignById,
  getMockDesignsPopulares,
  searchMockDesigns,
  mockProveedores as initialMockProveedores,
  getMockProveedorById,
  getMockProveedorByUsuarioId,
  getMockProveedoresByCategoria,
  getMockProveedoresMejorCalificados,
  getMockProveedoresPorExperiencia,
  getMockEstadisticasProveedores,
  mockPedidos as initialMockPedidos,
  getMockPedidosByEstado,
  getMockPedidosByProveedor,
  getMockPedidosByCliente,
  getMockPedidoById,
  getMockEstadisticasPedidos,
  getMockPedidosRecientes,
  getMockPedidosByRangoFechas,
  mockVentas as initialMockVentas,
  getMockVentasByEstado,
  getMockVentasByCliente,
  getMockVentaById,
  getMockVentaByPedidoId,
  getMockEstadisticasVentas,
  getMockVentasRecientes,
  getMockVentasByRangoFechas,
  getMockVentasByMetodoPago,
  getMockIngresosMensuales,
  mockPagos as initialMockPagos,
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

// Helper para generar IDs únicos
const generateUniqueId = (prefix = 'mock') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook personalizado para manejar datos mock
 * Proporciona una interfaz unificada para acceder y manipular datos de prueba en el cliente
 */
export const useMockData = () => {
  const [mockModeEnabled, setMockModeEnabled] = useState(false);

  // Estados para cada entidad de datos mock
  const [usuariosState, setUsuariosState] = useState(initialMockUsuarios);
  const [designsState, setDesignsState] = useState(initialMockDesigns);
  const [pedidosState, setPedidosState] = useState(initialMockPedidos);
  const [proveedoresState, setProveedoresState] = useState(initialMockProveedores);
  const [ventasState, setVentasState] = useState(initialMockVentas);
  const [pagosState, setPagosState] = useState(initialMockPagos);

  useEffect(() => {
    const isEnabled = MOCK_MODE_CONFIG.enabled || MOCK_MODE_CONFIG.forceEnabled;
    setMockModeEnabled(isEnabled);
    
    if (isEnabled) {
      console.log('🎭 Mock Mode activado - Usando datos de prueba');
    }
  }, []);

  // Función para alternar modo mock manualmente
  const toggleMockMode = useCallback(() => {
    setMockModeEnabled(prev => !prev);
    console.log(`🎭 Mock Mode ${!mockModeEnabled ? 'activado' : 'desactivado'}`);
  }, [mockModeEnabled]);

  // Función para verificar si el modo mock está activo
  const isMockMode = useCallback(() => mockModeEnabled, [mockModeEnabled]);

  // Función para resetear todos los datos mock a su estado inicial
  const resetAllMockData = useCallback(() => {
    setUsuariosState(initialMockUsuarios);
    setDesignsState(initialMockDesigns);
    setPedidosState(initialMockPedidos);
    setProveedoresState(initialMockProveedores);
    setVentasState(initialMockVentas);
    setPagosState(initialMockPagos);
    console.log('🎭 Todos los datos mock han sido reseteados.');
  }, []);

  // =================== USUARIOS ===================
  const usuarios = useMemo(() => ({
    getAll: () => mockModeEnabled ? usuariosState : [],
    getByRol: (rol) => mockModeEnabled ? usuariosState.filter(usuario => usuario.rol === rol) : [],
    getById: (id) => mockModeEnabled ? usuariosState.find(usuario => usuario._id === id) : null,
    getHabilitados: () => mockModeEnabled ? usuariosState.filter(usuario => usuario.habilitado === true) : [],
    count: () => mockModeEnabled ? usuariosState.length : 0,

    create: (newData) => {
      if (!mockModeEnabled) return null;
      const newUsuario = {
        ...newData,
        _id: generateUniqueId('user'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsuariosState(prev => [...prev, newUsuario]);
      return newUsuario;
    },
    update: (id, updatedData) => {
      if (!mockModeEnabled) return null;
      let updatedUsuario = null;
      setUsuariosState(prev => prev.map(usuario => {
        if (usuario._id === id) {
          updatedUsuario = { ...usuario, ...updatedData, updatedAt: new Date().toISOString() };
          return updatedUsuario;
        }
        return usuario;
      }));
      return updatedUsuario;
    },
    delete: (id) => {
      if (!mockModeEnabled) return false;
      const initialLength = usuariosState.length;
      setUsuariosState(prev => prev.filter(usuario => usuario._id !== id));
      return usuariosState.length < initialLength; // True if an item was removed
    }
  }), [mockModeEnabled, usuariosState]);

  // =================== DISEÑOS ===================
  const designs = useMemo(() => ({
    getAll: () => mockModeEnabled ? designsState : [],
    getByCategoria: (categoria) => mockModeEnabled ? designsState.filter(design => design.categoria === categoria) : [],
    getByUsuario: (usuarioId) => mockModeEnabled ? designsState.filter(design => design.creadorId === usuarioId) : [],
    getPublicos: () => mockModeEnabled ? designsState.filter(design => design.esPublico === true) : [],
    getById: (id) => mockModeEnabled ? designsState.find(design => design.id === id) : null,
    getPopulares: (limit = 5) => mockModeEnabled ? [...designsState].sort((a, b) => b.popularidad - a.popularidad).slice(0, limit) : [],
    search: (query) => {
      if (!mockModeEnabled) return [];
      const lowerQuery = query.toLowerCase();
      return designsState.filter(design => 
        design.nombre.toLowerCase().includes(lowerQuery) ||
        design.descripcion.toLowerCase().includes(lowerQuery) ||
        (design.palabrasClave && design.palabrasClave.some(palabra => palabra.toLowerCase().includes(lowerQuery)))
      );
    },
    count: () => mockModeEnabled ? designsState.length : 0,

    create: (newData) => {
      if (!mockModeEnabled) return null;
      const newDesign = {
        ...newData,
        id: generateUniqueId('design'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDesignsState(prev => [...prev, newDesign]);
      return newDesign;
    },
    update: (id, updatedData) => {
      if (!mockModeEnabled) return null;
      let updatedDesign = null;
      setDesignsState(prev => prev.map(design => {
        if (design.id === id) {
          updatedDesign = { ...design, ...updatedData, updatedAt: new Date().toISOString() };
          return updatedDesign;
        }
        return design;
      }));
      return updatedDesign;
    },
    delete: (id) => {
      if (!mockModeEnabled) return false;
      const initialLength = designsState.length;
      setDesignsState(prev => prev.filter(design => design.id !== id));
      return designsState.length < initialLength;
    }
  }), [mockModeEnabled, designsState]);

  // =================== PROVEEDORES ===================
  const proveedores = useMemo(() => ({
    getAll: () => mockModeEnabled ? proveedoresState : [],
    getById: (id) => mockModeEnabled ? proveedoresState.find(proveedor => proveedor.id === id) : null,
    getByUsuarioId: (usuarioId) => mockModeEnabled ? proveedoresState.find(proveedor => proveedor.usuarioId === usuarioId) : null,
    getByCategoria: (categoria) => mockModeEnabled ? proveedoresState.filter(proveedor => 
      proveedor.especialidades && proveedor.especialidades.includes(categoria)
    ) : [],
    getMejorCalificados: (limit = 5) => mockModeEnabled ? [...proveedoresState].sort((a, b) => b.calificacion - a.calificacion).slice(0, limit) : [],
    getPorExperiencia: (anos) => mockModeEnabled ? proveedoresState.filter(proveedor => proveedor.anosExperiencia >= anos) : [],
    getEstadisticas: () => {
      if (!mockModeEnabled) return {};
      const total = proveedoresState.length;
      const calificacionPromedio = proveedoresState.reduce((sum, p) => sum + p.calificacion, 0) / total;
      const experienciaPromedio = proveedoresState.reduce((sum, p) => sum + p.anosExperiencia, 0) / total;
      
      return {
        total,
        calificacionPromedio: Math.round(calificacionPromedio * 10) / 10,
        experienciaPromedio: Math.round(experienciaPromedio * 10) / 10,
        conCertificaciones: proveedoresState.filter(p => p.certificaciones && p.certificaciones.length > 0).length
      };
    },
    count: () => mockModeEnabled ? proveedoresState.length : 0,

    create: (newData) => {
      if (!mockModeEnabled) return null;
      const newProveedor = {
        ...newData,
        id: generateUniqueId('supplier'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProveedoresState(prev => [...prev, newProveedor]);
      return newProveedor;
    },
    update: (id, updatedData) => {
      if (!mockModeEnabled) return null;
      let updatedProveedor = null;
      setProveedoresState(prev => prev.map(proveedor => {
        if (proveedor.id === id) {
          updatedProveedor = { ...proveedor, ...updatedData, updatedAt: new Date().toISOString() };
          return updatedProveedor;
        }
        return proveedor;
      }));
      return updatedProveedor;
    },
    delete: (id) => {
      if (!mockModeEnabled) return false;
      const initialLength = proveedoresState.length;
      setProveedoresState(prev => prev.filter(proveedor => proveedor.id !== id));
      return proveedoresState.length < initialLength;
    }
  }), [mockModeEnabled, proveedoresState]);

  // =================== PEDIDOS ===================
  const pedidos = useMemo(() => ({
    getAll: () => mockModeEnabled ? pedidosState : [],
    getByEstado: (estado) => mockModeEnabled ? pedidosState.filter(pedido => pedido.estado === estado) : [],
    getByProveedor: (proveedorId) => mockModeEnabled ? pedidosState.filter(pedido => pedido.proveedorId === proveedorId) : [],
    getByCliente: (clienteId) => mockModeEnabled ? pedidosState.filter(pedido => pedido.clienteId === clienteId) : [],
    getById: (id) => mockModeEnabled ? pedidosState.find(pedido => pedido.id === id) : null,
    getEstadisticas: () => {
      if (!mockModeEnabled) return {};
      const total = pedidosState.length;
      const pendientes = pedidosState.filter(pedido => pedido.estado === 'PENDIENTE').length;
      const enProduccion = pedidosState.filter(pedido => pedido.estado === 'EN_PRODUCCION').length;
      const completados = pedidosState.filter(pedido => pedido.estado === 'COMPLETADO').length;
      
      return {
        total,
        pendientes,
        enProduccion,
        completados,
        valorTotal: pedidosState.reduce((sum, p) => sum + p.valorTotal, 0)
      };
    },
    getRecientes: (limit = 5) => mockModeEnabled ? [...pedidosState].sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)).slice(0, limit) : [],
    getByRangoFechas: (fechaInicio, fechaFin) => {
      if (!mockModeEnabled) return [];
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      
      return pedidosState.filter(pedido => {
        const fechaPedido = new Date(pedido.fechaCreacion);
        return fechaPedido >= inicio && fechaPedido <= fin;
      });
    },
    count: () => mockModeEnabled ? pedidosState.length : 0,

    create: (newData) => {
      if (!mockModeEnabled) return null;
      const newPedido = {
        ...newData,
        id: generateUniqueId('order'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPedidosState(prev => [...prev, newPedido]);
      return newPedido;
    },
    update: (id, updatedData) => {
      if (!mockModeEnabled) return null;
      let updatedPedido = null;
      setPedidosState(prev => prev.map(pedido => {
        if (pedido.id === id) {
          updatedPedido = { ...pedido, ...updatedData, updatedAt: new Date().toISOString() };
          return updatedPedido;
        }
        return pedido;
      }));
      return updatedPedido;
    },
    delete: (id) => {
      if (!mockModeEnabled) return false;
      const initialLength = pedidosState.length;
      setPedidosState(prev => prev.filter(pedido => pedido.id !== id));
      return pedidosState.length < initialLength;
    }
  }), [mockModeEnabled, pedidosState]);

  // =================== VENTAS ===================
  const ventas = useMemo(() => ({
    getAll: () => mockModeEnabled ? ventasState : [],
    getByEstado: (estado) => mockModeEnabled ? ventasState.filter(venta => venta.estado === estado) : [],
    getByCliente: (clienteId) => mockModeEnabled ? ventasState.filter(venta => venta.clienteId === clienteId) : [],
    getById: (id) => mockModeEnabled ? ventasState.find(venta => venta.id === id) : null,
    getByPedidoId: (pedidoId) => mockModeEnabled ? ventasState.find(venta => venta.pedidoId === pedidoId) : null,
    getEstadisticas: () => {
      if (!mockModeEnabled) return {};
      const total = ventasState.length;
      const ingresosBrutos = ventasState.reduce((sum, v) => sum + v.montoTotal, 0);
      const comisionesTotal = ventasState.reduce((sum, v) => sum + v.comisionPlataforma, 0);
      const gananciasProveedores = ventasState.reduce((sum, v) => sum + v.gananciaProveedor, 0);
      
      return {
        total,
        ingresosBrutos,
        comisionesTotal,
        gananciasProveedores,
        promedioVenta: Math.round(ingresosBrutos / total)
      };
    },
    getRecientes: (limit = 5) => mockModeEnabled ? [...ventasState].sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta)).slice(0, limit) : [],
    getByRangoFechas: (fechaInicio, fechaFin) => {
      if (!mockModeEnabled) return [];
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      
      return ventasState.filter(venta => {
        const fechaVenta = new Date(venta.fechaVenta);
        return fechaVenta >= inicio && fechaVenta <= fin;
      });
    },
    getByMetodoPago: (metodo) => mockModeEnabled ? ventasState.filter(venta => venta.metodoPago === metodo) : [],
    getIngresosMensuales: () => {
      if (!mockModeEnabled) return {};
      const ingresosPorMes = {};
      
      ventasState.forEach(venta => {
        const fecha = new Date(venta.fechaVenta);
        const mes = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!ingresosPorMes[mes]) {
          ingresosPorMes[mes] = 0;
        }
        ingresosPorMes[mes] += venta.montoTotal;
      });
      
      return ingresosPorMes;
    },
    count: () => mockModeEnabled ? ventasState.length : 0,

    create: (newData) => {
      if (!mockModeEnabled) return null;
      const newVenta = {
        ...newData,
        id: generateUniqueId('sale'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVentasState(prev => [...prev, newVenta]);
      return newVenta;
    },
    update: (id, updatedData) => {
      if (!mockModeEnabled) return null;
      let updatedVenta = null;
      setVentasState(prev => prev.map(venta => {
        if (venta.id === id) {
          updatedVenta = { ...venta, ...updatedData, updatedAt: new Date().toISOString() };
          return updatedVenta;
        }
        return venta;
      }));
      return updatedVenta;
    },
    delete: (id) => {
      if (!mockModeEnabled) return false;
      const initialLength = ventasState.length;
      setVentasState(prev => prev.filter(venta => venta.id !== id));
      return ventasState.length < initialLength;
    }
  }), [mockModeEnabled, ventasState]);

  // =================== PAGOS ===================
  const pagos = useMemo(() => ({
    getAll: () => mockModeEnabled ? pagosState : [],
    getByEstado: (estado) => mockModeEnabled ? pagosState.filter(pago => pago.estado === estado) : [],
    getByCliente: (clienteId) => mockModeEnabled ? pagosState.filter(pago => pago.clienteId === clienteId) : [],
    getById: (id) => mockModeEnabled ? pagosState.find(pago => pago.id === id) : null,
    getByVentaId: (ventaId) => mockModeEnabled ? pagosState.find(pago => pago.ventaId === ventaId) : null,
    getByMetodoPago: (metodo) => mockModeEnabled ? pagosState.filter(pago => pago.metodoPago === metodo) : [],
    getEstadisticas: () => {
      if (!mockModeEnabled) return {};
      const total = pagosState.length;
      const exitosos = pagosState.filter(pago => pago.estado === 'COMPLETADO').length;
      const fallidos = pagosState.filter(pago => pago.estado === 'FALLIDO').length;
      const pendientes = pagosState.filter(pago => pago.estado === 'PENDIENTE').length;
      
      return {
        total,
        exitosos,
        fallidos,
        pendientes,
        tasaExito: Math.round((exitosos / total) * 100),
        montoTotal: pagosState.reduce((sum, p) => sum + p.monto, 0)
      };
    },
    getRecientes: (limit = 5) => mockModeEnabled ? [...pagosState].sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago)).slice(0, limit) : [],
    getByRangoFechas: (fechaInicio, fechaFin) => {
      if (!mockModeEnabled) return [];
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      
      return pagosState.filter(pago => {
        const fechaPago = new Date(pago.fechaPago);
        return fechaPago >= inicio && fechaPago <= fin;
      });
    },
    getReporteComisiones: () => {
      if (!mockModeEnabled) return {};
      const pagosTarjeta = pagosState.filter(pago => pago.metodoPago === 'TARJETA_CREDITO');
      const pagosPSE = pagosState.filter(pago => pago.metodoPago === 'PSE');
      const pagosNequi = pagosState.filter(pago => pago.metodoPago === 'NEQUI');
      
      return {
        totalComisiones: pagosState.reduce((sum, p) => sum + (p.comision || 0), 0),
        comisionesPorMetodo: {
          tarjeta: pagosTarjeta.reduce((sum, p) => sum + (p.comision || 0), 0),
          pse: pagosPSE.reduce((sum, p) => sum + (p.comision || 0), 0),
          nequi: pagosNequi.reduce((sum, p) => sum + (p.comision || 0), 0)
        }
      };
    },
    getFallidos: () => mockModeEnabled ? pagosState.filter(pago => pago.estado === 'FALLIDO') : [],
    count: () => mockModeEnabled ? pagosState.length : 0,

    create: (newData) => {
      if (!mockModeEnabled) return null;
      const newPago = {
        ...newData,
        id: generateUniqueId('payment'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPagosState(prev => [...prev, newPago]);
      return newPago;
    },
    update: (id, updatedData) => {
      if (!mockModeEnabled) return null;
      let updatedPago = null;
      setPagosState(prev => prev.map(pago => {
        if (pago.id === id) {
          updatedPago = { ...pago, ...updatedData, updatedAt: new Date().toISOString() };
          return updatedPago;
        }
        return pago;
      }));
      return updatedPago;
    },
    delete: (id) => {
      if (!mockModeEnabled) return false;
      const initialLength = pagosState.length;
      setPagosState(prev => prev.filter(pago => pago.id !== id));
      return pagosState.length < initialLength;
    }
  }), [mockModeEnabled, pagosState]);

  // =================== DASHBOARD ===================
  const dashboard = useMemo(() => ({
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
  }), [mockModeEnabled, usuarios, designs, proveedores, pedidos, ventas, pagos]);

  return {
    // Estado del modo mock
    isMockMode,
    toggleMockMode,
    mockModeEnabled,
    resetAllMockData, // Exportar la función de reseteo

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
