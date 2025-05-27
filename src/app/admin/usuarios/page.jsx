import UsuariosClientPage from './usuarioClientPage';
import { ObtenerTodosLosUsuarios } from '@/app/acciones/UsuariosActions';

async function UsuariosAdminPage() {
    // Server-side data fetching
    let initialUsers = [];
    
    try {
        console.log('Server: Fetching initial users data...');
        initialUsers = await ObtenerTodosLosUsuarios();
        console.log('Server: Initial users fetched:', initialUsers?.length || 0);
    } catch (error) {
        console.error('Server: Error fetching initial users:', error);
        initialUsers = [];
    }

    return <UsuariosClientPage initialUsers={initialUsers} />;
}

export default UsuariosAdminPage;
