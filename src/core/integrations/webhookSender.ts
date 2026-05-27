import type { InvoiceJSON } from '../extraction/extractionTypes';

export interface WebhookConfig {
  url:    string;
  method: 'POST' | 'PUT';
  headers?: Record<string, string>;
  secret?: string;
}

export async function sendWebhook(
  config: WebhookConfig,
  payload: InvoiceJSON
): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const body = JSON.stringify(payload);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (config.secret) {
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw', encoder.encode(config.secret),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
      );
      const sig = await crypto.subtle.sign('HMAC', keyMaterial, encoder.encode(body));
      const hexSig = Array.from(new Uint8Array(sig))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      headers['X-InvoiceLens-Signature'] = `sha256=${hexSig}`;
    }

    const res = await fetch(config.url, {
      method: config.method,
      headers,
      body,
      signal: AbortSignal.timeout(10_000),
    });

    return { ok: res.ok, status: res.status };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
