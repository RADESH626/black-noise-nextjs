// Datos de prueba para usuarios
export const mockUsuarios = [
  {
    _id: "mock-user-1",
    tipoDocumento: "CEDULA",
    numeroDocumento: "1234567890",
    primerNombre: "María",
    segundoNombre: "Isabel",
    primerApellido: "González",
    segundoApellido: "Rodríguez",
    nombreUsuario: "maria.gonzalez",
    fechaNacimiento: "1990-05-15",
    genero: "FEMENINO",
    numeroTelefono: "3001234567",
    direccion: "Calle 123 #45-67, Bogotá",
    correo: "maria.gonzalez@email.com",
    rol: "CLIENTE",
    fotoPerfil: "/img/perfil/FotoPerfil.webp",
    habilitado: true,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    _id: "mock-user-2",
    tipoDocumento: "CEDULA",
    numeroDocumento: "9876543210",
    primerNombre: "Carlos",
    segundoNombre: "Andrés",
    primerApellido: "Martínez",
    segundoApellido: "López",
    nombreUsuario: "carlos.martinez",
    fechaNacimiento: "1985-08-22",
    genero: "MASCULINO",
    numeroTelefono: "3109876543",
    direccion: "Carrera 15 #89-12, Medellín",
    correo: "carlos.martinez@email.com",
    rol: "PROVEEDOR",
    fotoPerfil: "/img/perfil/FotoPerfil.webp",
    habilitado: true,
    createdAt: "2024-01-10T14:20:00Z"
  },
  {
    _id: "mock-user-3",
    tipoDocumento: "CEDULA",
    numeroDocumento: "1122334455",
    primerNombre: "Ana",
    segundoNombre: "Lucía",
    primerApellido: "Fernández",
    segundoApellido: "Vargas",
    nombreUsuario: "ana.fernandez",
    fechaNacimiento: "1992-12-03",
    genero: "FEMENINO",
    numeroTelefono: "3201122334",
    direccion: "Avenida 68 #34-56, Cali",
    correo: "ana.fernandez@email.com",
    rol: "CLIENTE",
    fotoPerfil: "/img/perfil/FotoPerfil.webp",
    habilitado: true,
    createdAt: "2024-01-20T09:15:00Z"
  },
  {
    _id: "mock-user-4",
    tipoDocumento: "CEDULA",
    numeroDocumento: "5566778899",
    primerNombre: "Luis",
    segundoNombre: "Fernando",
    primerApellido: "Ramírez",
    segundoApellido: "Castro",
    nombreUsuario: "luis.ramirez",
    fechaNacimiento: "1988-03-18",
    genero: "MASCULINO",
    numeroTelefono: "3155566778",
    direccion: "Calle 50 #78-90, Barranquilla",
    correo: "luis.ramirez@email.com",
    rol: "ADMINISTRADOR",
    fotoPerfil: "/img/perfil/FotoPerfil.webp",
    habilitado: true,
    createdAt: "2024-01-05T16:45:00Z"
  },
  {
    _id: "mock-user-5",
    tipoDocumento: "CEDULA",
    numeroDocumento: "7788990011",
    primerNombre: "Sandra",
    segundoNombre: "Patricia",
    primerApellido: "Torres",
    segundoApellido: "Morales",
    nombreUsuario: "sandra.torres",
    fechaNacimiento: "1994-07-25",
    genero: "FEMENINO",
    numeroTelefono: "3007788990",
    direccion: "Carrera 20 #45-67, Bucaramanga",
    correo: "sandra.torres@email.com",
    rol: "CLIENTE",
    fotoPerfil: "/img/perfil/FotoPerfil.webp",
    habilitado: false,
    createdAt: "2024-01-25T11:30:00Z"
  },
  {
    _id: "mock-user-6",
    tipoDocumento: "PASAPORTE",
    numeroDocumento: "AB123456789",
    primerNombre: "Diego",
    segundoNombre: "Alejandro",
    primerApellido: "Herrera",
    segundoApellido: "Silva",
    nombreUsuario: "diego.herrera",
    fechaNacimiento: "1987-11-14",
    genero: "MASCULINO",
    numeroTelefono: "3112233445",
    direccion: "Calle 85 #12-34, Pereira",
    correo: "diego.herrera@email.com",
    rol: "PROVEEDOR",
    fotoPerfil: "/img/perfil/FotoPerfil.webp",
    habilitado: true,
    createdAt: "2024-01-12T13:20:00Z"
  },
  {
    _id: "mock-user-7",
    tipoDocumento: "CEDULA",
    numeroDocumento: "3344556677",
    primerNombre: "Camila",
    segundoNombre: "Andrea",
    primerApellido: "Jiménez",
    segundoApellido: "Ruiz",
    nombreUsuario: "camila.jimenez",
    fechaNacimiento: "1995-04-09",
    genero: "FEMENINO",
    numeroTelefono: "3203344556",
    direccion: "Avenida 30 #67-89, Manizales",
    correo: "camila.jimenez@email.com",
    rol: "CLIENTE",
    fotoPerfil: "/img/perfil/FotoPerfil.webp",
    habilitado: true,
    createdAt: "2024-01-18T08:45:00Z"
  },
  {
    _id: "mock-user-8",
    tipoDocumento: "CEDULA",
    numeroDocumento: "9900112233",
    primerNombre: "Roberto",
    segundoNombre: "Enrique",
    primerApellido: "Mendoza",
    segundoApellido: "Peña",
    nombreUsuario: "roberto.mendoza",
    fechaNacimiento: "1983-09-30",
    genero: "MASCULINO",
    numeroTelefono: "3159900112",
    direccion: "Carrera 7 #123-45, Ibagué",
    correo: "roberto.mendoza@email.com",
    rol: "CLIENTE",
    fotoPerfil: "/img/perfil/FotoPerfil.webp",
    habilitado: true,
    createdAt: "2024-01-08T15:10:00Z"
  }
];

// Función para obtener usuarios por rol
export const getMockUsuariosByRol = (rol) => {
  return mockUsuarios.filter(usuario => usuario.rol === rol);
};

// Función para obtener usuario por ID
export const getMockUsuarioById = (id) => {
  return mockUsuarios.find(usuario => usuario._id === id);
};

// Función para obtener usuarios habilitados
export const getMockUsuariosHabilitados = () => {
  return mockUsuarios.filter(usuario => usuario.habilitado);
};
