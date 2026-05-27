export type LayoutLabel = 
  | 'Caption'
  | 'Footnote'
  | 'Formula'
  | 'List-item'
  | 'Page-footer'
  | 'Page-header'
  | 'Picture'
  | 'Section-header'
  | 'Table'
  | 'Text'
  | 'Title';

export type InvoiceZone = 'HEADER' | 'SUBHEADER' | 'LINE_ITEMS_TABLE' | 'BODY_TEXT' | 'FOOTER';

export interface LayoutRegion {
  label: LayoutLabel;
  score: number;
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
  invoiceZone: InvoiceZone;
}
