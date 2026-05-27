import type { InvoiceJSON } from '../extraction/extractionTypes';

export const APPS_SCRIPT_TEMPLATE = `
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    let sheet = ss.getSheetByName('Invoices') || ss.insertSheet('Invoices');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Invoice #', 'Date', 'Due Date', 'Vendor', 'Customer',
        'Currency', 'Subtotal', 'Tax', 'Total', 'OCR Confidence', 'Extracted At'
      ]);
    }
    sheet.appendRow([
      data.header.invoiceNumber,
      data.header.invoiceDate,
      data.header.dueDate,
      data.header.vendorName,
      data.header.customerName,
      data.header.currency,
      data.totals.subtotal,
      data.totals.totalTaxAmount,
      data.totals.grandTotal,
      data.ocrConfidence,
      data.extractedAt,
    ]);

    let liSheet = ss.getSheetByName('Line Items') || ss.insertSheet('Line Items');
    if (liSheet.getLastRow() === 0) {
      liSheet.appendRow([
        'Invoice #', 'Line #', 'Description', 'Qty', 'Unit', 'Unit Price', 'Tax%', 'Total'
      ]);
    }
    (data.lineItems || []).forEach(item => {
      liSheet.appendRow([
        data.header.invoiceNumber,
        item.lineNumber,
        item.description,
        item.quantity,
        item.unit,
        item.unitPrice,
        item.taxRate,
        item.lineTotal,
      ]);
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

export async function sendToSheets(appsScriptUrl: string, invoice: InvoiceJSON): Promise<boolean> {
  try {
    await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
      mode: 'no-cors',
    });
    return true;
  } catch {
    return false;
  }
}
