import type { RegistrationApiResponse } from '@/types';

/**
 * Pull a Paystack checkout / authorization URL from a signup API response.
 * Backends vary in nesting and field names; we accept the common shapes.
 */
export function extractPaystackCheckoutUrl(
  response: RegistrationApiResponse | Record<string, unknown> | null | undefined
): string | null {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const candidates: unknown[] = [
    response,
    (response as RegistrationApiResponse).data,
    (response as { result?: unknown }).result,
    (response as { payment?: unknown }).payment,
    (response as { data?: { payment?: unknown } }).data?.payment,
    (response as { data?: { data?: unknown } }).data?.data,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue;
    const record = candidate as Record<string, unknown>;
    const url =
      record.authorization_url ||
      record.authorizationUrl ||
      record.checkout_url ||
      record.checkoutUrl ||
      record.payment_url ||
      record.paymentUrl ||
      record.redirect_url ||
      record.redirectUrl ||
      record.url;

    if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
      return url;
    }
  }

  return null;
}

/**
 * Pull a Paystack access code / reference if the backend initializes payment server-side.
 */
export function extractPaystackAccessCode(
  response: RegistrationApiResponse | Record<string, unknown> | null | undefined
): string | null {
  if (!response || typeof response !== 'object') {
    return null;
  }

  const candidates: unknown[] = [
    response,
    (response as RegistrationApiResponse).data,
    (response as { result?: unknown }).result,
    (response as { payment?: unknown }).payment,
    (response as { data?: { payment?: unknown } }).data?.payment,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue;
    const record = candidate as Record<string, unknown>;
    const code =
      record.access_code ||
      record.accessCode ||
      record.paystack_access_code ||
      record.paystackAccessCode;

    if (typeof code === 'string' && code.trim()) {
      return code.trim();
    }
  }

  return null;
}
