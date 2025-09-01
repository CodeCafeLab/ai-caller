// Universal export utility for CSV, Excel, and PDF
import * as ExcelJS from 'exceljs';

export function exportAsCSV(data: Record<string, any>[], filename = 'export.csv') {
  // For CSV, we'll use a simple text-based approach
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function exportAsExcel(data: Record<string, any>[], filename = 'export.xlsx') {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  
  // Add headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    
    // Add data rows
    data.forEach(row => {
      const rowData = headers.map(header => row[header] || '');
      worksheet.addRow(rowData);
    });
  }
  
  // Generate and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function exportAsPDF(data: Record<string, any>[], filename = 'export.pdf') {
  // For PDF, we'll use a simple text-based approach since jsPDF is not available in exportUtils
  // This is a fallback - individual components should handle PDF export with jsPDF
  const headers = Object.keys(data[0] || {});
  const pdfContent = [
    headers.join(' | '),
    ...data.map(row => headers.map(header => String(row[header] || '')).join(' | '))
  ].join('\n');
  
  const blob = new Blob([pdfContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace('.pdf', '.txt'); // Change extension since we can't generate PDF here
  a.click();
  window.URL.revokeObjectURL(url);
} 