export const mockSolicitudesProveedor = [
    {
        id: 'mock-req-1',
        usuarioId: 'mock-user-1',
        nombreEmpresa: 'Mock Supplies Inc.',
        nit: '123456789-0',
        direccionEmpresa: '123 Mock St, Mock City',
        especialidad: 'Ropa',
        metodosPagoAceptados: ['TARJETA_CREDITO', 'PSE'],
        comisionPropuesta: 10,
        mensajeAdicional: 'Somos los mejores proveedores de mock data.',
        estado: 'PENDIENTE',
        adminNotas: '',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: 'mock-req-2',
        usuarioId: 'mock-user-2',
        nombreEmpresa: 'Fake Fabrics Ltd.',
        nit: '098765432-1',
        direccionEmpresa: '456 Fictional Ave, Imaginary Town',
        especialidad: 'Accesorios',
        metodosPagoAceptados: ['NEQUI'],
        comisionPropuesta: 12,
        mensajeAdicional: 'Ofrecemos productos de alta calidad simulada.',
        estado: 'APROBADO',
        adminNotas: 'Cumple con todos los requisitos.',
        createdAt: '2024-01-20T11:30:00Z',
        updatedAt: '2024-01-22T14:00:00Z',
    },
    {
        id: 'mock-req-3',
        usuarioId: 'mock-user-3',
        nombreEmpresa: 'Simulated Goods Co.',
        nit: '112233445-5',
        direccionEmpresa: '789 Virtual Rd, Cyberville',
        especialidad: 'Calzado',
        metodosPagoAceptados: ['TARJETA_CREDITO'],
        comisionPropuesta: 8,
        mensajeAdicional: 'Innovación en productos virtuales.',
        estado: 'RECHAZADO',
        adminNotas: 'Falta documentación legal.',
        createdAt: '2024-01-25T09:15:00Z',
        updatedAt: '2024-01-28T16:45:00Z',
    },
];

export const getMockSolicitudProveedorById = (id) => {
    return mockSolicitudesProveedor.find(solicitud => solicitud.id === id);
};

export const getMockSolicitudesProveedorByUsuarioId = (usuarioId) => {
    return mockSolicitudesProveedor.filter(solicitud => solicitud.usuarioId === usuarioId);
};

export const getMockSolicitudesProveedorByEstado = (estado) => {
    return mockSolicitudesProveedor.filter(solicitud => solicitud.estado === estado);
};
