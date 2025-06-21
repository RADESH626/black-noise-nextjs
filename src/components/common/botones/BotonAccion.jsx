// src/components/common/botones/BotonAccion.jsx
import Link from 'next/link';
import BotonGeneral from './BotonGeneral';

export function BotonAccion({
    texto,
    icono: Icono,
    href,
    onClick,
    tipo = 'primario', // primario, secundario, peligro, exito, info, destacado, advertencia
    className = '',
    ...props
}) {
    const getVariant = (tipo) => {
        switch (tipo) {
            case 'primario':
            case 'destacado':
                return 'primary';
            case 'secundario':
            case 'advertencia':
                return 'secondary';
            case 'peligro':
                return 'danger';
            case 'exito':
                return 'success';
            case 'info':
                return 'info';
            default:
                return 'primary';
        }
    };

    const contenido = (
        <>
            {Icono && <Icono className="fill-current w-4 h-4 mr-2" />}
            <span>{texto}</span>
        </>
    );

    if (href) {
        return (
            <span
                onClick={onClick}
                className={`font-bold py-2 px-4 rounded inline-flex items-center ${className}`} // Keep base styling for span
                {...props}
            >
                {contenido}
            </span>
        );
    }

    return (
        <BotonGeneral
            onClick={onClick}
            variant={getVariant(tipo)}
            type={props.type || 'button'}
            className={`inline-flex items-center ${className}`} // BotonGeneral handles padding, font-weight, rounded
            {...props}
        >
            {contenido}
        </BotonGeneral>
    );
}

export default BotonAccion;
