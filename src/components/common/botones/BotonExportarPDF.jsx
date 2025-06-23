import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BotonAccion } from './BotonAccion'; // Importar BotonAccion

function BotonExportarPDF({ data = [], reportTitle = "Reporte", tableHeaders = [], tableBodyMapper = () => [], ...props }) {
    const handleExportPDF = () => {
        if (!data || data.length === 0) {
            alert(`No hay ${reportTitle.toLowerCase()} para exportar.`);
            return;
        }

        const doc = new jsPDF();

        // Titulo
        doc.setFontSize(18);
        doc.text(reportTitle, 14, 22);

        // Definir columnas y filas para la tabla
        const head = [tableHeaders];
        const body = data.map(tableBodyMapper);

        autoTable(doc, {
            startY: 30, // Ajustar startY ya que no hay métricas
            head: head,
            body: body,
            theme: 'striped',
            headStyles: { fillColor: [22, 160, 133], cellPadding: { top: 3, right: 2, bottom: 3, left: 2 } },
            styles: { fontSize: 7, cellPadding: { top: 3, right: 2, bottom: 3, left: 2 } },
            // columnStyles will need to be passed dynamically or calculated based on tableHeaders length
            // For now, remove specific columnStyles to avoid errors, or make them dynamic if needed.
            // This will be handled by the calling component.
        });

        doc.save(`${reportTitle.toLowerCase().replace(/\s/g, '_')}.pdf`);
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
