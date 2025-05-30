import FormFiltrarUsuarios from '../components/FormFiltrarUsuarios';

// Simple mock user data for testing
const mockUsers = [
    {
        _id: 'mock1',
        nombreUsuario: 'testuser1',
        primerNombre: 'Test',
        primerApellido: 'User',
        segundoApellido: 'One',
        tipoDocumento: 'CC',
        numeroDocumento: '123456789',
        genero: 'Masculino',
        fechaNacimiento: '1990-01-01T00:00:00.000Z',
        numeroTelefono: '111-111-1111',
        direccion: '123 Test St',
        correo: 'test1@example.com',
        rol: 'CLIENTE',
        habilitado: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        __v: 0
    },
    {
        _id: 'mock2',
        nombreUsuario: 'testuser2',
        primerNombre: 'Test',
        primerApellido: 'User',
        segundoApellido: 'Two',
        tipoDocumento: 'TI',
        numeroDocumento: '987654321',
        genero: 'Femenino',
        fechaNacimiento: '1992-05-15T00:00:00.000Z',
        numeroTelefono: '222-222-2222',
        direccion: '456 Mock Ave',
        correo: 'test2@example.com',
        rol: 'PROVEEDOR',
        habilitado: true,
        createdAt: '2023-02-01T00:00:00.000Z',
        updatedAt: '2023-02-01T00:00:00.000Z',
        __v: 0
    },
     {
        _id: 'mock3',
        nombreUsuario: 'testuser3',
        primerNombre: 'Test',
        primerApellido: 'User',
        segundoApellido: 'Three',
        tipoDocumento: 'CE',
        numeroDocumento: '112233445',
        genero: 'Otro',
        fechaNacimiento: '1995-11-30T00:00:00.000Z',
        numeroTelefono: '333-333-3333',
        direccion: '789 Sample Blvd',
        correo: 'test3@example.com',
        rol: 'ADMINISTRADOR',
        habilitado: true,
        createdAt: '2023-03-01T00:00:00.000Z',
        updatedAt: '2023-03-01T00:00:00.000Z',
        __v: 0
    },
];

export default function TestUsuariosPage() {
    return (
        <div>
            <h1>Test Page for FormFiltrarUsuarios</h1>
            <FormFiltrarUsuarios initialUsersFromPage={mockUsers} />
        </div>
    );
}
