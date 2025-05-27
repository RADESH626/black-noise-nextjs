// Archivo principal para exportar todos los datos de prueba
export { mockUsuarios } from './usuarios';
export { mockDesigns } from './designs';
export { mockPedidos } from './pedidos';
export { mockProveedores } from './proveedores';
export { mockVentas } from './ventas';
export { mockPagos } from './pagos';

// Función para obtener todos los datos mock
export const getAllMockData = () => ({
  usuarios: mockUsuarios,
  designs: mockDesigns,
  pedidos: mockPedidos,
  proveedores: mockProveedores,
  ventas: mockVentas,
  pagos: mockPagos
});

// Función para limpiar datos mock (útil para reset en desarrollo)
export const clearMockData = () => {
  console.log('Mock data cleared for development');
};
