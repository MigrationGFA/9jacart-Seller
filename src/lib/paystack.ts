const PAYSTACK_SCRIPT_URL = 'https://js.paystack.co/v1/inline.js';

export interface PaystackPopupSuccess {
  reference: string;
  trans?: string;
  status?: string;
  message?: string;
  transaction?: string;
  trxref?: string;
}

export interface PaystackCheckoutOptions {
  key: string;
  email: string;
  amount: number; // kobo
  currency?: string;
  ref?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (transaction: PaystackPopupSuccess) => void;
  onCancel?: () => void;
}

interface PaystackPopSetup {
  openIframe: () => void;
}

interface PaystackPopStatic {
  setup: (options: {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: Record<string, unknown>;
    callback: (response: PaystackPopupSuccess) => void;
    onClose: () => void;
  }) => PaystackPopSetup;
}

declare global {
  interface Window {
    PaystackPop?: PaystackPopStatic;
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Paystack is only available in the browser'));
  }

  if (window.PaystackPop) {
    return Promise.resolve();
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PAYSTACK_SCRIPT_URL}"]`
    );

    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Paystack script'))
      );
      if (window.PaystackPop) {
        resolve();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = PAYSTACK_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error('Failed to load Paystack script'));
    };
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

export function generatePaystackReference(prefix = '9ja'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Open Paystack Inline popup. Resolves on successful payment; rejects on cancel/error.
 */
export async function openPaystackPopup(
  options: PaystackCheckoutOptions
): Promise<PaystackPopupSuccess> {
  await loadPaystackScript();

  if (!window.PaystackPop) {
    throw new Error('Paystack failed to initialize');
  }

  return new Promise((resolve, reject) => {
    let settled = false;

    const handler = window.PaystackPop!.setup({
      key: options.key,
      email: options.email,
      amount: options.amount,
      currency: options.currency || 'NGN',
      ref: options.ref || generatePaystackReference(),
      metadata: options.metadata,
      callback: (response) => {
        settled = true;
        options.onSuccess(response);
        resolve(response);
      },
      onClose: () => {
        options.onCancel?.();
        if (!settled) {
          reject(new Error('Payment was cancelled'));
        }
      },
    });

    handler.openIframe();
  });
}
