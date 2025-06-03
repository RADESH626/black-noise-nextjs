// Datos de prueba para pagos
export const mockPagos = [
  {
    _id: "mock-pago-1",
    ventaId: "mock-venta-1",
    clienteId: "mock-user-1",
    valorPago: 45000,
    metodoPago: "TARJETA_CREDITO",
    estadoPago: "COMPLETADO",
    fechaPago: "2024-01-20T09:15:00Z",
    numeroTransaccion: "TXN-BN-20240120-001",
    entidadFinanciera: "Banco de Bogotá",
    numeroAprobacion: "123456",
    comisionPasarela: 1350, // 3%
    valorNeto: 43650,
    referenciaPago: "REF-BN-001",
    detallesPago: {
      tarjeta: {
        ultimos4Digitos: "1234",
        tipo: "VISA",
        fechaExpiracion: "12/26"
      }
    },
    createdAt: "2024-01-20T09:15:00Z"
  },
  {
    _id: "mock-pago-2",
    ventaId: "mock-venta-2",
    clienteId: "mock-user-8",
    valorPago: 55000,
    metodoPago: "PSE",
    estadoPago: "COMPLETADO",
    fechaPago: "2024-01-18T11:30:00Z",
    numeroTransaccion: "TXN-BN-20240118-002",
    entidadFinanciera: "Bancolombia",
    numeroAprobacion: "789012",
    comisionPasarela: 2200, // 4% para PSE
    valorNeto: 52800,
    referenciaPago: "REF-BN-002",
    detallesPago: {
      pse: {
        banco: "BANCOLOMBIA",
        tipoCuenta: "AHORROS"
      }
    },
    createdAt: "2024-01-18T11:30:00Z"
  },
  {
    _id: "mock-pago-3",
    ventaId: "mock-venta-3",
    clienteId: "mock-user-7",
    valorPago: 76000,
    metodoPago: "TARJETA_DEBITO",
    estadoPago: "PROCESANDO",
    fechaPago: "2024-01-22T16:45:00Z",
    numeroTransaccion: "TXN-BN-20240122-003",
    entidadFinanciera: "Banco Popular",
    numeroAprobacion: "345678",
    comisionPasarela: 2280, // 3%
    valorNeto: 73720,
    referenciaPago: "REF-BN-003",
    detallesPago: {
      tarjeta: {
        ultimos4Digitos: "5678",
        tipo: "MASTERCARD",
        fechaExpiracion: "08/27"
      }
    },
    createdAt: "2024-01-22T16:45:00Z"
  },
  {
    _id: "mock-pago-4",
    ventaId: "mock-venta-4",
    clienteId: "mock-user-1",
    valorPago: 60000,
    metodoPago: "TARJETA_CREDITO",
    estadoPago: "PENDIENTE",
    fechaPago: "2024-01-26T10:30:00Z",
    numeroTransaccion: "TXN-BN-20240126-004",
    entidadFinanciera: "Banco de Occidente",
    numeroAprobacion: null,
    comisionPasarela: 1800, // 3%
    valorNeto: 58200,
    referenciaPago: "REF-BN-004",
    detallesPago: {
      tarjeta: {
        ultimos4Digitos: "9012",
        tipo: "VISA",
        fechaExpiracion: "05/28"
      }
    },
    createdAt: "2024-01-26T10:30:00Z"
  },
  {
    _id: "mock-pago-5",
    ventaId: "mock-venta-5",
    clienteId: "mock-user-3",
    valorPago: 40000,
    metodoPago: "NEQUI",
    estadoPago: "PROCESANDO",
    fechaPago: "2024-01-24T14:20:00Z",
    numeroTransaccion: "TXN-BN-20240124-005",
    entidadFinanciera: "Nequi",
    numeroAprobacion: "901234",
    comisionPasarela: 1600, // 4%
    valorNeto: 38400,
    referenciaPago: "REF-BN-005",
    detallesPago: {
      nequi: {
        numeroTelefono: "300***4556"
      }
    },
    createdAt: "2024-01-24T14:20:00Z"
  },
  {
    _id: "mock-pago-6",
    ventaId: "mock-venta-6",
    clienteId: "mock-user-3",
    valorPago: 18000,
    metodoPago: "TARJETA_CREDITO",
    estadoPago: "FALLIDO",
    fechaPago: "2024-01-25T13:20:00Z",
    numeroTransaccion: "TXN-BN-20240125-006",
    entidadFinanciera: "Banco Davivienda",
    numeroAprobacion: null,
    comisionPasarela: 0, // No hay comisión en pagos fallidos
    valorNeto: 0,
    referenciaPago: "REF-BN-006",
    motivoFallo: "Fondos insuficientes",
    detallesPago: {
      tarjeta: {
        ultimos4Digitos: "3456",
        tipo: "MASTERCARD",
        fechaExpiracion: "03/25"
      }
    },
    createdAt: "2024-01-25T13:20:00Z"
  },
  {
    _id: "mock-pago-7",
    ventaId: "mock-venta-2",
    clienteId: "mock-user-8",
    valorPago: 55000,
    metodoPago: "DAVIPLATA",
    estadoPago: "COMPLETADO",
    fechaPago: "2024-01-19T08:45:00Z",
    numeroTransaccion: "TXN-BN-20240119-007",
    entidadFinanciera: "DaviPlata",
    numeroAprobacion: "567890",
    comisionPasarela: 2200, // 4%
    valorNeto: 52800,
    referenciaPago: "REF-BN-007",
    detallesPago: {
      daviplata: {
        numeroTelefono: "315***0112"
      }
    },
    createdAt: "2024-01-19T08:45:00Z"
  }
];

// Función para obtener pagos por estado
export const getMockPagosByEstado = (estado) => {
  return mockPagos.filter(pago => pago.estadoPago === estado);
};

// Función para obtener pagos por cliente
export const getMockPagosByCliente = (clienteId) => {
  return mockPagos.filter(pago => pago.clienteId === clienteId);
};

// Función para obtener pago por ID
export const getMockPagoById = (id) => {
  return mockPagos.find(pago => pago._id === id);
};

// Función para obtener pago por venta ID
export const getMockPagoByVentaId = (ventaId) => {
  return mockPagos.find(pago => pago.ventaId === ventaId);
};

// Función para obtener pagos por método de pago
export const getMockPagosByMetodoPago = (metodoPago) => {
  return mockPagos.filter(pago => pago.metodoPago === metodoPago);
};

// Función para obtener estadísticas de pagos
export const getMockEstadisticasPagos = () => {
  const totalPagos = mockPagos.length;
  const pagosCompletados = mockPagos.filter(p => p.estadoPago === "COMPLETADO");
  
  const valorTotalPagos = pagosCompletados.reduce((sum, pago) => sum + pago.valorPago, 0);
  const totalComisionesPasarela = pagosCompletados.reduce((sum, pago) => sum + pago.comisionPasarela, 0);
  const valorNetoTotal = pagosCompletados.reduce((sum, pago) => sum + pago.valorNeto, 0);
  
  const pagosPorEstado = mockPagos.reduce((acc, pago) => {
    acc[pago.estadoPago] = (acc[pago.estadoPago] || 0) + 1;
    return acc;
  }, {});

  const pagosPorMetodo = mockPagos.reduce((acc, pago) => {
    acc[pago.metodoPago] = (acc[pago.metodoPago] || 0) + 1;
    return acc;
  }, {});

  const pagosPorEntidad = mockPagos.reduce((acc, pago) => {
    acc[pago.entidadFinanciera] = (acc[pago.entidadFinanciera] || 0) + 1;
    return acc;
  }, {});

  return {
    totalPagos,
    pagosCompletados: pagosCompletados.length,
    valorTotalPagos,
    totalComisionesPasarela,
    valorNetoTotal,
    pagosPorEstado,
    pagosPorMetodo,
    pagosPorEntidad,
    pagoPromedio: Math.round((valorTotalPagos / pagosCompletados.length) * 100) / 100,
    tasaExito: Math.round((pagosCompletados.length / totalPagos) * 100)
  };
};

// Función para obtener pagos recientes
export const getMockPagosRecientes = (limit = 5) => {
  return mockPagos
    .sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago))
    .slice(0, limit);
};

// Función para obtener pagos por rango de fechas
export const getMockPagosByRangoFechas = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  return mockPagos.filter(pago => {
    const fechaPago = new Date(pago.fechaPago);
    return fechaPago >= inicio && fechaPago <= fin;
  });
};

// Función para obtener reporte de comisiones
export const getMockReporteComisiones = () => {
  const comisionesPorMetodo = {};
  
  mockPagos
    .filter(p => p.estadoPago === "COMPLETADO")
    .forEach(pago => {
      if (!comisionesPorMetodo[pago.metodoPago]) {
        comisionesPorMetodo[pago.metodoPago] = {
          totalPagos: 0,
          valorTotal: 0,
          comisionesTotal: 0,
          valorNetoTotal: 0
        };
      }
      
      comisionesPorMetodo[pago.metodoPago].totalPagos += 1;
      comisionesPorMetodo[pago.metodoPago].valorTotal += pago.valorPago;
      comisionesPorMetodo[pago.metodoPago].comisionesTotal += pago.comisionPasarela;
      comisionesPorMetodo[pago.metodoPago].valorNetoTotal += pago.valorNeto;
    });
  
  return comisionesPorMetodo;
};

// Función para obtener pagos fallidos
export const getMockPagosFallidos = () => {
  return mockPagos.filter(pago => pago.estadoPago === "FALLIDO");
};
