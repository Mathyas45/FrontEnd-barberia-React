/**
 * ============================================================
 * UTILIDADES DE EXPORTACIÓN
 * ============================================================
 * 
 * Funciones para exportar datos a PDF y Excel.
 * Usa jspdf para PDF y xlsx para Excel.
 * 
 * CÓMO USAR:
 * import { exportToPDF, exportToExcel } from '@/lib/utils/export';
 * 
 * exportToExcel(data, columns, 'profesionales');
 * exportToPDF(data, columns, 'profesionales', 'Lista de Profesionales');
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ============================================================
// TIPOS
// ============================================================
interface ExportColumn {
  header: string;
  accessorKey: string;
}

// ============================================================
// EXPORTAR A EXCEL
// ============================================================
export function exportToExcel<T>(
  data: T[],
  columns: ExportColumn[],
  fileName: string = 'datos'
): void {
  // Preparar datos para Excel
  const excelData = data.map((row) => {
    const excelRow: Record<string, unknown> = {};
    columns.forEach((col) => {
      const value = getNestedValue(row, col.accessorKey);
      excelRow[col.header] = value ?? '';
    });
    return excelRow;
  });

  // Crear workbook y worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Ajustar ancho de columnas
  const colWidths = columns.map((col) => ({
    wch: Math.max(col.header.length, 15),
  }));
  ws['!cols'] = colWidths;

  // Agregar worksheet al workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');

  // Descargar archivo
  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `${fileName}_${date}.xlsx`);
}

// ============================================================
// EXPORTAR A PDF
// ============================================================
export function exportToPDF<T>(
  data: T[],
  columns: ExportColumn[],
  fileName: string = 'datos',
  title: string = 'Reporte'
): void {
  // Crear documento PDF
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Fecha
  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

  // Preparar datos para la tabla
  const tableHeaders = columns.map((col) => col.header);
  const tableData = data.map((row) =>
    columns.map((col) => {
      const value = getNestedValue(row, col.accessorKey);
      return value?.toString() ?? '';
    })
  );

  // Generar tabla con autoTable
  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: 35,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246], // blue-500
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // gray-50
    },
    margin: { top: 35 },
  });

  // Pie de página con número de página
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Descargar archivo
  const date = new Date().toISOString().split('T')[0];
  doc.save(`${fileName}_${date}.pdf`);
}

// ============================================================
// HELPER: Obtener valor anidado de un objeto
// ============================================================
function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
