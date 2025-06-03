// Datos de prueba para ventas
export const mockVentas = [
  {
    _id: "mock-venta-1",
    pedidoId: "mock-pedido-3",
    clienteId: "mock-user-1",
    desingIds: ["mock-design-2"],
    valorVenta: 45000,
    estadoVenta: "COMPLETADA",
    fechaVenta: "2024-01-20T09:15:00Z",
    metodoPago: "TARJETA_CREDITO",
    comisionPlataforma: 4500, // 10%
    gananciaProveedor: 40500,
    detallesVenta: [
      "Hoodie Urban Style - Talla XL x1"
    ],
    numeroFactura: "BN-2024-001",
    createdAt: "2024-01-20T09:15:00Z"
  },
  {
    _id: "mock-venta-2",
    pedidoId: "mock-pedido-5",
    clienteId: "mock-user-8",
    desingIds: ["mock-design-8"],
    valorVenta: 55000,
    estadoVenta: "COMPLETADA",
    fechaVenta: "2024-01-18T11:30:00Z",
    metodoPago: "PSE",
    comisionPlataforma: 5500,
    gananciaProveedor: 49500,
    detallesVenta: [
      "Pantalón Formal Executive - Talla 34 x1"
    ],
    numeroFactura: "BN-2024-002",
    createdAt: "2024-01-18T11:30:00Z"
  },
  {
    _id: "mock-venta-3",
    pedidoId: "mock-pedido-4",
    clienteId: "mock-user-7",
    desingIds: ["mock-design-5", "mock-design-6"],
    valorVenta: 76000,
    estadoVenta: "PROCESANDO",
    fechaVenta: "2024-01-22T16:45:00Z",
    metodoPago: "TARJETA_DEBITO",
    comisionPlataforma: 7600,
    gananciaProveedor: 68400,
    detallesVenta: [
      "Sweater Cozy Winter - Talla L x1",
      "Camiseta Deportiva Pro - Talla M x1"
    ],
    numeroFactura: "BN-2024-003",
    createdAt: "2024-01-22T16:45:00Z"
  },
  {
    _id: "mock-venta-4",
    pedidoId: "mock-pedido-1",
    clienteId: "mock-user-1",
    desingIds: ["mock-design-1", "mock-design-3"],
    valorVenta: 60000,
    estadoVenta: "PENDIENTE",
    fechaVenta: "2024-01-26T10:30:00Z",
    metodoPago: "TARJETA_CREDITO",
    comisionPlataforma: 6000,
    gananciaProveedor: 54000,
    detallesVenta: [
      "Camiseta Black Noise Vintage - Talla M x2",
      "Camisa Formal Elegante - Talla L x1"
    ],
    numeroFactura: "BN-2024-004",
    createdAt: "2024-01-26T10:30:00Z"
  },
  {
    _id: "mock-venta-5",
    pedidoId: "mock-pedido-2",
    clienteId: "mock-user-3",
    desingIds: ["mock-design-4"],
    valorVenta: 40000,
    estadoVenta: "PROCESANDO",
    fechaVenta: "2024-01-24T14:20:00Z",
    metodoPago: "NEQUI",
    comisionPlataforma: 4000,
    gananciaProveedor: 36000,
    detallesVenta: [
      "Pantalón Casual Fit - Talla 32 x1"
    ],
    numeroFactura: "BN-2024-005",
    createdAt: "2024-01-24T14:20:00Z"
  },
  {
    _id: "mock-venta-6",
    pedidoId: "mock-pedido-6",
    clienteId: "mock-user-3",
    desingIds: ["mock-design-10"],
    valorVenta: 18000,
    estadoVenta: "CANCELADA",
    fechaVenta: "2024-01-25T13:20:00Z",
    metodoPago: "TARJETA_CREDITO",
    comisionPlataforma: 0, // No hay comisión en ventas canceladas
    gananciaProveedor: 0,
    detallesVenta: [
      "Gorra Urban Cap - Talla única x1"
    ],
    numeroFactura: "BN-2024-006",
    motivoCancelacion: "Cliente solicitó cancelación por cambio de diseño",
    createdAt: "2024-01-25T13:20:00Z"
  }
];

// Función para obtener ventas por estado
export const getMockVentasByEstado = (estado) => {
  return mockVentas.filter(venta => venta.estadoVenta === estado);
};

// Función para obtener ventas por cliente
export const getMockVentasByCliente = (clienteId) => {
  return mockVentas.filter(venta => venta.clienteId === clienteId);
};

// Función para obtener venta por ID
export const getMockVentaById = (id) => {
  return mockVentas.find(venta => venta._id === id);
};

// Función para obtener venta por pedido ID
export const getMockVentaByPedidoId = (pedidoId) => {
  return mockVentas.find(venta => venta.pedidoId === pedidoId);
};

// Función para obtener estadísticas de ventas
export const getMockEstadisticasVentas = () => {
  const totalVentas = mockVentas.length;
  const ventasCompletadas = mockVentas.filter(v => v.estadoVenta === "COMPLETADA");
  
  const valorTotalVentas = ventasCompletadas.reduce((sum, venta) => sum + venta.valorVenta, 0);
  const totalComisiones = ventasCompletadas.reduce((sum, venta) => sum + venta.comisionPlataforma, 0);
  const totalGananciasProveedores = ventasCompletadas.reduce((sum, venta) => sum + venta.gananciaProveedor, 0);
  
  const ventasPorEstado = mockVentas.reduce((acc, venta) => {
    acc[venta.estadoVenta] = (acc[venta.estadoVenta] || 0) + 1;
    return acc;
  }, {});

  const ventasPorMetodoPago = mockVentas.reduce((acc, venta) => {
    acc[venta.metodoPago] = (acc[venta.metodoPago] || 0) + 1;
    return acc;
  }, {});

  return {
    totalVentas,
    ventasCompletadas: ventasCompletadas.length,
    valorTotalVentas,
    totalComisiones,
    totalGananciasProveedores,
    ventasPorEstado,
    ventasPorMetodoPago,
    ventaPromedio: Math.round((valorTotalVentas / ventasCompletadas.length) * 100) / 100
  };
};

// Función para obtener ventas recientes
export const getMockVentasRecientes = (limit = 5) => {
  return mockVentas
    .sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta))
    .slice(0, limit);
};

// Función para obtener ventas por rango de fechas
export const getMockVentasByRangoFechas = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  return mockVentas.filter(venta => {
    const fechaVenta = new Date(venta.fechaVenta);
    return fechaVenta >= inicio && fechaVenta <= fin;
  });
};

// Función para obtener ventas por método de pago
export const getMockVentasByMetodoPago = (metodoPago) => {
  return mockVentas.filter(venta => venta.metodoPago === metodoPago);
};

// Función para obtener ingresos mensuales
export const getMockIngresosMensuales = () => {
  const ingresosPorMes = {};
  
  mockVentas
    .filter(v => v.estadoVenta === "COMPLETADA")
    .forEach(venta => {
      const fecha = new Date(venta.fechaVenta);
      const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      
      if (!ingresosPorMes[mesAno]) {
        ingresosPorMes[mesAno] = {
          ventas: 0,
          ingresos: 0,
          comisiones: 0
        };
      }
      
      ingresosPorMes[mesAno].ventas += 1;
      ingresosPorMes[mesAno].ingresos += venta.valorVenta;
      ingresosPorMes[mesAno].comisiones += venta.comisionPlataforma;
    });
  
  return ingresosPorMes;
};
