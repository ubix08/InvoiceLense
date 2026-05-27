import { useState } from 'react';
import { exportLineItemsCSV } from '../core/export/csvExporter';
import type { InvoiceJSON } from '../core/extraction/extractionTypes';
import { sendWebhook } from '../core/integrations/webhookSender';
import { sendToSheets } from '../core/integrations/googleSheetsAppScript';
import { useSettingsStore } from '../store/useSettingsStore';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { webhookUrl, webhookSecret, sheetsUrl } = useSettingsStore();

  const exportJSON = (invoice: InvoiceJSON) => {
    const blob = new Blob([JSON.stringify(invoice, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.header.invoiceNumber || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = async (invoice: InvoiceJSON) => {
    const Papa = (await import('papaparse')).default;
    const rows = invoice.lineItems.map(item => ({
      'Line #':      item.lineNumber,
      'Description': item.description,
      'Qty':         item.quantity ?? '',
      'Unit':        item.unit ?? '',
      'Unit Price':  item.unitPrice ?? '',
      'Tax %':       item.taxRate ?? '',
      'Discount':    item.discount ?? '',
      'Line Total':  item.lineTotal ?? '',
      'SKU':         item.sku ?? '',
      'HSN Code':    item.hsnCode ?? '',
    }));

    const csv = Papa.unparse(rows, { header: true });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.header.invoiceNumber || 'lines'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportXLSX = async (invoice: InvoiceJSON) => {
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();

    const headerData = [
      ['Field', 'Value'],
      ['Invoice Number', invoice.header.invoiceNumber ?? ''],
      ['Invoice Date',   invoice.header.invoiceDate ?? ''],
      ['Due Date',       invoice.header.dueDate ?? ''],
      ['PO Number',      invoice.header.poNumber ?? ''],
      ['Currency',       invoice.header.currency],
      ['Vendor Name',    invoice.header.vendorName ?? ''],
      ['Vendor Tax ID',  invoice.header.vendorTaxId ?? ''],
      ['Customer Name',  invoice.header.customerName ?? ''],
      ['OCR Confidence', `${invoice.ocrConfidence.toFixed(1)}%`],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(headerData), 'Header');

    const lineItemHeaders = ['#', 'Description', 'Qty', 'Unit', 'Unit Price', 'Tax %', 'Discount', 'Line Total', 'SKU'];
    const lineItemRows = invoice.lineItems.map(i => [
      i.lineNumber, i.description, i.quantity, i.unit, i.unitPrice,
      i.taxRate, i.discount, i.lineTotal, i.sku,
    ]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([lineItemHeaders, ...lineItemRows]), 'Line Items');

    const totalsData = Object.entries(invoice.totals).map(([k, v]) => [k, v]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(totalsData), 'Totals');

    XLSX.writeFile(wb, `invoice-${invoice.header.invoiceNumber || 'export'}.xlsx`, { bookType: 'xlsx' });
  };

  const triggerWebhook = async (invoice: InvoiceJSON) => {
    if (!webhookUrl) return { ok: false, error: 'No webhook configured' };
    return sendWebhook({ url: webhookUrl, method: 'POST', secret: webhookSecret }, invoice);
  };

  const triggerSheets = async (invoice: InvoiceJSON) => {
    if (!sheetsUrl) return { ok: false, error: 'No sheets url configured' };
    return sendToSheets(sheetsUrl, invoice);
  };

  return { exportJSON, exportCSV, exportXLSX, triggerWebhook, triggerSheets, isExporting };
}
