// Datos de prueba para pedidos
export const mockPedidos = [
  {
    _id: "mock-pedido-1",
    desingIds: ["mock-design-1", "mock-design-3"],
    proveedorId: "mock-proveedor-1",
    estadoPedido: "PENDIENTE",
    valorPedido: 60000,
    fechaRealizacion: "2024-01-26T10:30:00Z",
    fechaEstimadaEntrega: "2024-02-10T10:30:00Z",
    detallesPedido: [
      "Camiseta Black Noise Vintage - Talla M x2",
      "Camisa Formal Elegante - Talla L x1"
    ],
    clienteId: "mock-user-1", // Para saber quién hizo el pedido
    createdAt: "2024-01-26T10:30:00Z"
  },
  {
    _id: "mock-pedido-2",
    desingIds: ["mock-design-4"],
    proveedorId: "mock-proveedor-2",
    estadoPedido: "EN_PRODUCCION",
    valorPedido: 40000,
    fechaRealizacion: "2024-01-24T14:20:00Z",
    fechaEstimadaEntrega: "2024-02-13T14:20:00Z",
    detallesPedido: [
      "Pantalón Casual Fit - Talla 32 x1"
    ],
    clienteId: "mock-user-3",
    createdAt: "2024-01-24T14:20:00Z"
  },
  {
    _id: "mock-pedido-3",
    desingIds: ["mock-design-2"],
    proveedorId: "mock-proveedor-3",
    estadoPedido: "COMPLETADO",
    valorPedido: 45000,
    fechaRealizacion: "2024-01-20T09:15:00Z",
    fechaEstimadaEntrega: "2024-02-14T09:15:00Z",
    detallesPedido: [
      "Hoodie Urban Style - Talla XL x1"
    ],
    clienteId: "mock-user-1",
    createdAt: "2024-01-20T09:15:00Z"
  },
  {
    _id: "mock-pedido-4",
    desingIds: ["mock-design-5", "mock-design-6"],
    proveedorId: "mock-proveedor-3",
    estadoPedido: "EN_ENVIO",
    valorPedido: 76000,
    fechaRealizacion: "2024-01-22T16:45:00Z",
    fechaEstimadaEntrega: "2024-02-16T16:45:00Z",
    detallesPedido: [
      "Sweater Cozy Winter - Talla L x1",
      "Camiseta Deportiva Pro - Talla M x1"
    ],
    clienteId: "mock-user-7",
    createdAt: "2024-01-22T16:45:00Z"
  },
  {
    _id: "mock-pedido-5",
    desingIds: ["mock-design-8"],
    proveedorId: "mock-proveedor-2",
    estadoPedido: "ENTREGADO",
    valorPedido: 55000,
    fechaRealizacion: "2024-01-18T11:30:00Z",
    fechaEstimadaEntrega: "2024-02-07T11:30:00Z",
    detallesPedido: [
      "Pantalón Formal Executive - Talla 34 x1"
    ],
    clienteId: "mock-user-8",
    createdAt: "2024-01-18T11:30:00Z"
  },
  {
    _id: "mock-pedido-6",
    desingIds: ["mock-design-10"],
    proveedorId: "mock-proveedor-1",
    estadoPedido: "CANCELADO",
    valorPedido: 18000,
    fechaRealizacion: "2024-01-25T13:20:00Z",
    fechaEstimadaEntrega: "2024-02-09T13:20:00Z",
    detallesPedido: [
      "Gorra Urban Cap - Talla única x1"
    ],
    clienteId: "mock-user-3",
    motivoCancelacion: "Cliente solicitó cancelación por cambio de diseño",
    createdAt: "2024-01-25T13:20:00Z"
  }
];

// Función para obtener pedidos por estado
export const getMockPedidosByEstado = (estado) => {
  return mockPedidos.filter(pedido => pedido.estadoPedido === estado);
};

// Función para obtener pedidos por proveedor
export const getMockPedidosByProveedor = (proveedorId) => {
  return mockPedidos.filter(pedido => pedido.proveedorId === proveedorId);
};

// Función para obtener pedidos por cliente
export const getMockPedidosByCliente = (clienteId) => {
  return mockPedidos.filter(pedido => pedido.clienteId === clienteId);
};

// Función para obtener pedido por ID
export const getMockPedidoById = (id) => {
  return mockPedidos.find(pedido => pedido._id === id);
};

// Función para obtener estadísticas de pedidos
export const getMockEstadisticasPedidos = () => {
  const totalPedidos = mockPedidos.length;
  const pedidosPorEstado = mockPedidos.reduce((acc, pedido) => {
    acc[pedido.estadoPedido] = (acc[pedido.estadoPedido] || 0) + 1;
    return acc;
  }, {});

  const valorTotalPedidos = mockPedidos.reduce((sum, pedido) => sum + pedido.valorPedido, 0);
  const valorPromedioPedido = Math.round((valorTotalPedidos / totalPedidos) * 100) / 100;

  const pedidosCompletados = mockPedidos.filter(p => 
    p.estadoPedido === "COMPLETADO" || p.estadoPedido === "ENTREGADO"
  ).length;

  return {
    totalPedidos,
    pedidosPorEstado,
    valorTotalPedidos,
    valorPromedioPedido,
    pedidosCompletados,
    tasaCompletacion: Math.round((pedidosCompletados / totalPedidos) * 100)
  };
};

// Función para obtener pedidos recientes
export const getMockPedidosRecientes = (limit = 5) => {
  return mockPedidos
    .sort((a, b) => new Date(b.fechaRealizacion) - new Date(a.fechaRealizacion))
    .slice(0, limit);
};

// Función para obtener pedidos por rango de fechas
export const getMockPedidosByRangoFechas = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  return mockPedidos.filter(pedido => {
    const fechaPedido = new Date(pedido.fechaRealizacion);
    return fechaPedido >= inicio && fechaPedido <= fin;
  });
};
