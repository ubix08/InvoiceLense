import { parse, isValid, format } from 'date-fns';

const DATE_FORMATS = [
  'MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy/MM/dd',
  'MM-dd-yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd',
  'MM.dd.yyyy', 'dd.MM.yyyy',
  'MMMM d, yyyy', 'MMM d, yyyy',
  'd MMMM yyyy', 'd MMM yyyy',
  'MMMM dd yyyy', 'MMM dd yyyy',
  'dd MMMM yyyy', 'dd MMM yyyy',
];

export function parseAnyDate(raw: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/\s+/g, ' ');
  const ref = new Date();

  for (const fmt of DATE_FORMATS) {
    const parsed = parse(cleaned, fmt, ref);
    if (isValid(parsed)) {
      return format(parsed, 'yyyy-MM-dd');
    }
  }

  const native = new Date(cleaned);
  if (isValid(native)) return format(native, 'yyyy-MM-dd');

  return null;
}
