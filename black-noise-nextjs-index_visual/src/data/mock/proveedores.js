// Datos de prueba para proveedores
export const mockProveedores = [
  {
    _id: "mock-proveedor-1",
    usuarioId: "mock-user-2",
    nombreEmpresa: "Textiles Martínez S.A.S",
    nit: "900123456-7",
    descripcionEmpresa: "Empresa especializada en la fabricación de camisetas y prendas deportivas con más de 10 años de experiencia en el mercado.",
    direccionEmpresa: "Carrera 15 #89-12, Medellín, Antioquia",
    telefonoEmpresa: "3109876543",
    correoEmpresa: "contacto@textilesmartinez.com",
    sitioWeb: "www.textilesmartinez.com",
    categoria: "CAMISA",
    capacidadProduccion: 500,
    tiempoEntrega: 15,
    certificaciones: ["ISO 9001", "WRAP"],
    experiencia: 10,
    portafolio: ["/img/proveedores/IMAGEN-SOLICITUD-PROVEEDOR.jpg"],
    calificacion: 4.8,
    pedidosCompletados: 127,
    createdAt: "2024-01-10T14:20:00Z"
  },
  {
    _id: "mock-proveedor-2",
    usuarioId: "mock-user-6",
    nombreEmpresa: "Confecciones Herrera Ltda",
    nit: "800987654-3",
    descripcionEmpresa: "Especialistas en pantalones y prendas formales de alta calidad. Trabajamos con telas premium y acabados perfectos.",
    direccionEmpresa: "Calle 85 #12-34, Pereira, Risaralda",
    telefonoEmpresa: "3112233445",
    correoEmpresa: "ventas@confeccionesherrera.com",
    sitioWeb: "www.confeccionesherrera.com",
    categoria: "PANTALON",
    capacidadProduccion: 300,
    tiempoEntrega: 20,
    certificaciones: ["OEKO-TEX", "Global Organic Textile Standard"],
    experiencia: 8,
    portafolio: ["/img/proveedores/IMAGEN-SOLICITUD-PROVEEDOR (1).jpg"],
    calificacion: 4.6,
    pedidosCompletados: 89,
    createdAt: "2024-01-12T13:20:00Z"
  },
  {
    _id: "mock-proveedor-3",
    usuarioId: "mock-user-8",
    nombreEmpresa: "Chaquetas Premium Corp",
    nit: "900555444-2",
    descripcionEmpresa: "Manufacturamos chaquetas, hoodies y sweaters de la más alta calidad. Nos especializamos en prendas de abrigo urbanas y deportivas.",
    direccionEmpresa: "Carrera 7 #123-45, Ibagué, Tolima",
    telefonoEmpresa: "3159900112",
    correoEmpresa: "info@chaquetaspremium.com",
    sitioWeb: "www.chaquetaspremium.com",
    categoria: "CHAQUETA",
    capacidadProduccion: 200,
    tiempoEntrega: 25,
    certificaciones: ["ISO 14001", "Fair Trade"],
    experiencia: 12,
    portafolio: ["/img/proveedores/IMAGEN-SOLICITUD-PROVEEDOR.jpg"],
    calificacion: 4.9,
    pedidosCompletados: 156,
    createdAt: "2024-01-08T15:10:00Z"
  }
];

// Función para obtener proveedor por ID
export const getMockProveedorById = (id) => {
  return mockProveedores.find(proveedor => proveedor._id === id);
};

// Función para obtener proveedor por usuario ID
export const getMockProveedorByUsuarioId = (usuarioId) => {
  return mockProveedores.find(proveedor => proveedor.usuarioId === usuarioId);
};

// Función para obtener proveedores por categoría
export const getMockProveedoresByCategoria = (categoria) => {
  return mockProveedores.filter(proveedor => proveedor.categoria === categoria);
};

// Función para obtener proveedores mejor calificados
export const getMockProveedoresMejorCalificados = (limit = 5) => {
  return mockProveedores
    .sort((a, b) => b.calificacion - a.calificacion)
    .slice(0, limit);
};

// Función para obtener proveedores por experiencia
export const getMockProveedoresPorExperiencia = (anosMinimos) => {
  return mockProveedores.filter(proveedor => proveedor.experiencia >= anosMinimos);
};

// Función para obtener estadísticas de proveedores
export const getMockEstadisticasProveedores = () => {
  const totalProveedores = mockProveedores.length;
  const promedioCalificacion = mockProveedores.reduce((sum, p) => sum + p.calificacion, 0) / totalProveedores;
  const totalPedidosCompletados = mockProveedores.reduce((sum, p) => sum + p.pedidosCompletados, 0);
  const capacidadTotalProduccion = mockProveedores.reduce((sum, p) => sum + p.capacidadProduccion, 0);

  return {
    totalProveedores,
    promedioCalificacion: Math.round(promedioCalificacion * 10) / 10,
    totalPedidosCompletados,
    capacidadTotalProduccion
  };
};
