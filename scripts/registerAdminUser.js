const bcrypt = require('bcryptjs');

// Función para registrar usuario administrador
async function registerAdminUser() {
  console.log('=== REGISTRANDO USUARIO ADMINISTRADOR ===');
  
  // Simular FormData
  const formData = new Map();
  formData.set('tipoDocumento', 'CEDULA');
  formData.set('numeroDocumento', '5566778899');
  formData.set('primerNombre', 'Luis');
  formData.set('segundoNombre', 'Fernando');
  formData.set('primerApellido', 'Ramírez');
  formData.set('segundoApellido', 'Castro');
  formData.set('fechaNacimiento', '1988-03-18');
  formData.set('genero', 'MASCULINO');
  formData.set('numeroTelefono', '3155566778');
  formData.set('direccion', 'Calle 50 #78-90, Barranquilla');
  formData.set('correo', 'luis.ramirez@email.com');
  formData.set('password', 'admin123');
  
  // Añadir método get para simular FormData
  formData.get = function(key) {
    return this.get(key) || null;
  };
  
  const userData = {
    tipoDocumento: formData.get('tipoDocumento'),
    numeroDocumento: formData.get('numeroDocumento'),
    primerNombre: formData.get('primerNombre'),
    nombreUsuario: `${formData.get('primerNombre')}${Math.floor(1000 + Math.random() * 9000)}`,
    segundoNombre: formData.get('segundoNombre'),
    primerApellido: formData.get('primerApellido'),
    segundoApellido: formData.get('segundoApellido'),
    fechaNacimiento: formData.get('fechaNacimiento'),
    genero: formData.get('genero'),
    numeroTelefono: formData.get('numeroTelefono'),
    direccion: formData.get('direccion'),
    correo: formData.get('correo'),
    password: formData.get('password'),
    rol: 'ADMINISTRADOR', // Asignar rol de administrador
    habilitado: true
  };
  
  console.log('Datos del usuario:', userData);
  
  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;
  
  console.log('Contraseña hasheada:', hashedPassword);
  console.log('Usuario listo para registrar:', userData);
  
  return userData;
}

registerAdminUser().then(user => {
  console.log('Usuario administrador preparado exitosamente');
}).catch(error => {
  console.error('Error preparando usuario administrador:', error);
});
