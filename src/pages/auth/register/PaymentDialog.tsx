// components/registration/PaymentDialog.tsx
import { X, CreditCard,  CircleSlash } from 'lucide-react';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { VENDOR_REGISTRATION_FEE_NAIRA } from '@/lib/constants';
import type { VendorRegistrationPaymentMethod } from '@/types';

const PAYMENT_OPTIONS: {
  value: VendorRegistrationPaymentMethod;
  label: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    value: 'Transfer/Card',
    label: 'Transfer / Card',
    description: 'Pay securely online with Paystack (card, bank transfer, USSD).',
    icon: CreditCard,
  },
//   {
//     value: 'Cash Payment',
//     label: 'Cash Payment',
//     description: 'Pay the registration fee in cash to the 9jacart team.',
//     icon: Banknote,
//   },
  {
    value: 'Not Paid',
    label: 'Pay later',
    description: 'Continue without paying now. Payment can be completed later.',
    icon: CircleSlash,
  },
];

const formattedRegistrationFee = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
}).format(VENDOR_REGISTRATION_FEE_NAIRA);

interface PaymentDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  isPaying: boolean;
  paymentMethod: VendorRegistrationPaymentMethod | null;
  onSelectMethod: (method: VendorRegistrationPaymentMethod) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PaymentDialog = ({
  isOpen,
  isLoading,
  isPaying,
  paymentMethod,
  onSelectMethod,
  onConfirm,
  onCancel,
}: PaymentDialogProps) => {
  if (!isOpen) return null;

  const busy = isLoading || isPaying;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close payment dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-2 pr-8">Vendor Registration Fee</h2>
        <p className="text-sm text-gray-600 mb-4">
          Choose how you would like to pay the vendor registration fee to complete your application.
        </p>

        <div className="rounded-lg border border-[#8DEB6E]/60 bg-[#f4fff0] px-4 py-4 mb-4">
          <p className="text-sm font-medium text-gray-600">Amount due</p>
          <p className="mt-1 text-2xl font-bold text-[#1E4700]">{formattedRegistrationFee}</p>
        </div>

        <div className="space-y-3 mb-6" role="radiogroup" aria-label="Payment method">
          {PAYMENT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = paymentMethod === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={busy}
                onClick={() => onSelectMethod(option.value)}
                className={`w-full text-left rounded-lg border px-4 py-3 transition-colors disabled:opacity-50 ${
                  isSelected
                    ? 'border-[#2ac12a] bg-[#f4fff0] ring-1 ring-[#2ac12a]'
                    : 'border-gray-200 bg-white hover:border-[#8DEB6E]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                      isSelected ? 'bg-[#8DEB6E] text-primary' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-900">{option.label}</span>
                      <span
                        className={`h-4 w-4 rounded-full border ${
                          isSelected ? 'border-[#2ac12a] bg-[#2ac12a]' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 border border-[#2ac12a] rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <LoadingButton
            type="button"
            isLoading={busy}
            disabled={!paymentMethod}
            onClick={onConfirm}
            className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors disabled:opacity-50"
          >
            {isPaying
              ? 'Processing payment...'
              : isLoading
                ? 'Submitting...'
                : paymentMethod === 'Transfer/Card'
                  ? 'Pay & Submit'
                  : 'Submit'}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};