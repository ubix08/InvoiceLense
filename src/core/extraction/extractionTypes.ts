export interface InvoiceJSON {
  schemaVersion: '1.0';
  extractedAt: string;
  ocrConfidence: number;

  header: {
    invoiceNumber: string | null;
    invoiceDate: string | null;
    dueDate: string | null;
    poNumber: string | null;
    currency: string;
    vendorName: string | null;
    vendorAddress: string | null;
    vendorTaxId: string | null;
    customerName: string | null;
    customerAddress: string | null;
  };

  lineItems: Array<{
    lineNumber: number;
    description: string;
    quantity: number | null;
    unit: string | null;
    unitPrice: number | null;
    taxRate: number | null;
    discount: number | null;
    lineTotal: number | null;
    hsnCode: string | null;
    sku: string | null;
  }>;

  totals: {
    subtotal: number | null;
    totalTaxAmount: number | null;
    totalDiscount: number | null;
    shippingAmount: number | null;
    grandTotal: number | null;
    amountPaid: number | null;
    amountDue: number | null;
  };

  rawText: string;
  layoutRegions: Array<{
    label: string;
    score: number;
    invoiceZone: string;
    box: { xmin: number; ymin: number; xmax: number; ymax: number };
  }>;
}
