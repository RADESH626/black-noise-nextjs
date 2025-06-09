import Usuario from '@/models/Usuario';
import { getByIdHandler, updateHandler, deleteHandler } from '@/utils/crudHandler';
import { withAuthorization } from '@/utils/authMiddleware';

export const GET = withAuthorization(getByIdHandler(Usuario), 'ADMINISTRADOR');
export const PUT = withAuthorization(updateHandler(Usuario), 'ADMINISTRADOR');
export const DELETE = withAuthorization(deleteHandler(Usuario), 'ADMINISTRADOR');
