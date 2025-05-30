"use client";

import Link from 'next/link';
import Image from 'next/image';
import SeccionLista from '@/components/admin/secciones/lista/SeccionLista';
import THUsuarios from '@/components/admin/usuarios/THUsuarios';
import { TdGeneral } from '@/components/common/tablas';
import BotonEditar from '@/components/common/botones/BotonEditar';

export default function DashboardUserList({ users = [] }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
        return date.toLocaleDateString();
    };

    return (
        <SeccionLista>
            <THUsuarios /> {/* Reuse the table header */}
            <tbody className="bg-neutral-600">{/* Ensure no whitespace here */}{users.length === 0 ? (
                    <tr><TdGeneral colSpan="16" className="text-center py-4 text-secondary">No se encontraron usuarios.</TdGeneral></tr>
                ) : (
                    users.map((user) => (
                        <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                            <TdGeneral>{user.nombreUsuario}</TdGeneral>
                            <TdGeneral>{user.primerNombre}</TdGeneral>
                            <TdGeneral>{user.primerApellido}</TdGeneral>
                            <TdGeneral>{user.segundoApellido}</TdGeneral>
                            <TdGeneral>{user.tipoDocumento}</TdGeneral>
                            <TdGeneral>{user.numeroDocumento}</TdGeneral>
                            <TdGeneral>{user.genero}</TdGeneral>
                            <TdGeneral>{formatDate(user.fechaNacimiento)}</TdGeneral>
                            <TdGeneral>{user.numeroTelefono}</TdGeneral>
                            <TdGeneral>{user.direccion}</TdGeneral>
                            <TdGeneral>{user.correo}</TdGeneral>
                            <TdGeneral>{user.rol}</TdGeneral>
                            <TdGeneral>{formatDate(user.createdAt)}</TdGeneral>
                            <TdGeneral>
                                {user.fotoPerfil ? (
                                    <Image
                                        src={user.fotoPerfil}
                                        alt={`Foto de perfil de ${user.nombreUsuario}`}
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    'N/A'
                                )}
                            </TdGeneral>
                            <TdGeneral>{user.habilitado ? 'Activo' : 'Inactivo'}</TdGeneral>
                            <TdGeneral>
                                <div className="flex flex-row gap-1 items-center justify-center">
                                    <Link href={`/admin/usuarios/editar/${user._id}`} passHref>
                                        <BotonEditar>Editar</BotonEditar>
                                    </Link>
                                </div>
                            </TdGeneral>
                        </tr>
                    ))
                )}
            </tbody>{/* Ensure no whitespace here */}
        </SeccionLista>
    );
}
