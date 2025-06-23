import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BotonAccion } from './BotonAccion'; // Importar BotonAccion

function BotonExportarPDF({ usuarios = [], ...props }) {
    const handleExportPDF = () => {
        if (!usuarios || usuarios.length === 0) {
            alert("No hay usuarios para exportar.");
            return;
        }

        const doc = new jsPDF();

        // Titulo
        doc.setFontSize(18);
        doc.text("Reporte de Usuarios", 14, 22);

        // Calcular Métricas
        const generos = usuarios.reduce((acc, user) => {
            acc[user.genero] = (acc[user.genero] || 0) + 1;
            return acc;
        }, {});
        const generoPredominante = Object.keys(generos).reduce((a, b) => generos[a] > generos[b] ? a : b, '');

        const roles = usuarios.reduce((acc, user) => {
            acc[user.rol] = (acc[user.rol] || 0) + 1;
            return acc;
        }, {});

        // Contenido de Métricas
        doc.setFontSize(12);
        doc.text("Métricas Generales:", 14, 40);
        let metricasY = 48;
        doc.text(`- Número total de usuarios: ${usuarios.length}`, 14, metricasY);
        metricasY += 8;
        doc.text(`- Género predominante: ${generoPredominante || 'N/A'} (${generos[generoPredominante] || 0} usuarios)`, 14, metricasY);
        metricasY += 8;
        doc.text("- Usuarios por rol:", 14, metricasY);
        metricasY += 6;
        Object.entries(roles).forEach(([rol, count]) => {
            doc.text(`  - ${rol}: ${count}`, 18, metricasY);
            metricasY += 6;
        });
        
        // Espacio antes de la tabla de usuarios
        metricasY += 10;

        // Espacio antes de la tabla de usuarios
        metricasY += 10;

        // Definir columnas y filas para la tabla de usuarios
        const head = [[
            'Tipo Doc.', 'N° Doc.', 'P. Nombre', 'P. Apellido', 'F. Nacimiento', 'Género', 'Teléfono', 'Dirección',
            'Correo', 'Rol', 'Estado'
        ]];

        const body = usuarios.map(user => [
            user.tipoDocumento || 'N/A',
            user.numeroDocumento || 'N/A',
            user.primerNombre || 'N/A',
            user.primerApellido || 'N/A',
            user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString() : 'N/A',
            user.genero || 'N/A',
            user.numeroTelefono || 'N/A',
            user.direccion || 'N/A',
            user.correo || 'N/A',
            user.rol || 'N/A',
            user.habilitado ? "Habilitado" : "Deshabilitado"
        ]);

        autoTable(doc, {
            startY: metricasY,
            head: head,
            body: body,
            theme: 'striped',
            headStyles: { fillColor: [22, 160, 133], cellPadding: { top: 3, right: 2, bottom: 3, left: 2 } },
            styles: { fontSize: 7, cellPadding: { top: 3, right: 2, bottom: 3, left: 2 } },
            columnStyles: {
                0: { cellWidth: 9 },
                1: { cellWidth: 18 },
                2: { cellWidth: 15 },
                3: { cellWidth: 16 },
                4: { cellWidth: 16 },
                5: { cellWidth: 19 },
                6: { cellWidth: 18 },
                7: { cellWidth: 18 },
                8: { cellWidth: 18 },
                9: { cellWidth: 20 },
                10: { cellWidth: 20 }
            }
        });

        doc.save('reporte_usuarios.pdf');
    };

    return (
        <BotonAccion
            texto="Exportar a PDF"
            tipo="secundario" // Usar tipo secundario para el color gris
            onClick={handleExportPDF}
            {...props}
        />
    );
}

export default BotonExportarPDF;
