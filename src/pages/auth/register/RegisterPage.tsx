/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/RegisterPage.tsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ban } from 'lucide-react';
import { popup } from '@/lib/popup';
import { registrationService, RegistrationError } from '@/services/registration.service';
import { extractPaystackCheckoutUrl } from '@/lib/paystack-response';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

import type { CompleteRegistrationData, VendorRegistrationPaymentMethod } from '@/types';
import { useRegistrationForm } from './useRegistrationForm';
import { useOTPVerification } from './useOTPVerification';
import { Step1AccountInfo } from './Step1AccountInfo';
import { Step2OTPVerification } from './Step2OTPVerification';
import { Step3PersonalBusinessInfo } from './Step3PersonalBusinessInfo';
import { Step4BusinessDetails } from './Step4BusinessDetails';
import { PaymentDialog } from './PaymentDialog';

export default function RegisterPage() {
  const {
    form,
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,
    apiError,
    setApiError,
    categories,
    categoriesLoading,
    validateStep,
    goToPreviousStep,
    navigate,
  } = useRegistrationForm();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<VendorRegistrationPaymentMethod | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const { handleSubmit, watch, setValue, formState: { errors } } = form;
  const emailAddress = watch('emailAddress');

  // Single source of truth for OTP state — passed down to Step2, read here for the button guard.
  const otp = useOTPVerification(emailAddress);
  const { isOtpVerified } = otp;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollableParent = formContainerRef.current?.closest('.overflow-y-auto');
    if (scrollableParent) {
      setTimeout(() => {
        scrollableParent.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  }, [currentStep]);

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await validateStep(1);
      if (!isValid) return;

      setIsLoading(true);
      try {
        const { available, message } = await registrationService.checkEmailAvailability(emailAddress);
        if (!available) {
          setValue('emailAddress', '');
          popup.error(message || 'Email already exists');
          setIsLoading(false);
          return;
        }
        setCurrentStep(2);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code';
        popup.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (currentStep === 2) {
      // Handled by Step2OTPVerification's onVerified callback.
      return;
    }

    if (await validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmitForm = async (data: any) => {
    if (!(await validateStep(3)) || !(await validateStep(4))) {
      return;
    }

    // Phone uniqueness must be checked before showing the account confirmation modal.
    setIsLoading(true);
    try {
      const { available, message } = await registrationService.checkPhoneAvailability(
        data.phoneNumber.trim()
      );

      if (!available) {
        popup.error(message || "You can't use an already existing phone number.");
        return;
      }

      setShowConfirmDialog(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Could not verify phone number';
      popup.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAccountDetails = () => {
    setShowConfirmDialog(false);
    setPaymentMethod(null);
    setShowPaymentDialog(true);
  };

  const submitRegistration = async (selectedPaymentMethod: VendorRegistrationPaymentMethod) => {
    setIsLoading(true);
    setApiError(null);

    const formData = form.getValues();

    try {
      const registrationData: CompleteRegistrationData = {
        emailAddress: formData.emailAddress,
        password: formData.password,
        fullName: formData.fullName,
        businessName: formData.businessName,
        businessCategory: formData.businessCategoryId,
        phoneNumber: formData.phoneNumber,
        businessRegNumber: formData.businessRegNumber || '',
        storeName: formData.storeName,
        businessAddress: formData.businessAddress,
        state: formData.state,
        taxIdNumber: formData.taxIdNumber || '',
        idDocument: formData.idDocument as File,
        businessRegCertificate: formData.businessRegCertificate as File,
        accountNumber: formData.accountNumber.trim(),
        settlementBank: formData.settlementBank,
        settlementBankName: formData.settlementBankName,
        paymentMethod: selectedPaymentMethod,
        callbackUrl:
          selectedPaymentMethod === 'Transfer/Card'
            ? `${window.location.origin}/register/success`
            : undefined,
      };

      const result = await registrationService.submitCompleteRegistration(registrationData);

      if (selectedPaymentMethod === 'Transfer/Card') {
        const checkoutUrl = extractPaystackCheckoutUrl(result);
        if (checkoutUrl) {
          setShowPaymentDialog(false);
          popup.success('Redirecting to Paystack to complete payment...');
          window.location.assign(checkoutUrl);
          return;
        }
      }

      setShowPaymentDialog(false);
      popup.success('Registration completed successfully!');
      navigate('/register/success');
    } catch (error) {
      console.error('Registration failed:', error);

      if (error instanceof RegistrationError) {
        Object.entries(error.fieldErrors).forEach(([field]) => {
          setValue(field as any, '');
        });
        setApiError(error.message);
        setShowPaymentDialog(false);
        popup.error(error.message);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        setApiError(errorMessage);
        popup.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setIsPaying(false);
    }
  };

  const handlePaymentAndSubmit = async () => {
    if (!paymentMethod) {
      popup.error('Please select a payment method');
      return;
    }
    if (paymentMethod === 'Transfer/Card') {
      setIsPaying(true);
    }
    await submitRegistration(paymentMethod);
  };

  const handleCancelDialog = () => {
    if (isLoading) return;
    setShowConfirmDialog(false);
  };

  const handleCancelPaymentDialog = () => {
    if (isLoading || isPaying) return;
    setShowPaymentDialog(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1AccountInfo form={form} isLoading={isLoading} />;
      case 2:
        return (
          <Step2OTPVerification
            email={emailAddress}
            onVerified={() => setCurrentStep(3)}
            otp={otp}
          />
        );
      case 3:
        return (
          <Step3PersonalBusinessInfo
            form={form}
            categories={categories}
            categoriesLoading={categoriesLoading}
            isLoading={isLoading}
          />
        );
      case 4:
        return <Step4BusinessDetails form={form} isLoading={isLoading} />;
      default:
        return null;
    }
  };

  return (
    <div ref={formContainerRef} className="space-y-8">
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      {apiError && <ErrorMessage message={apiError} className="mb-4" />}

      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-8">
        {renderStepContent()}

        <div className="flex space-x-4">
          {currentStep > 1 && currentStep !== 2 && (
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-[#2ac12a] bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Back
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading || (currentStep === 2 && !isOtpVerified)}
              className="flex-1 py-3 px-4 bg-[#8DEB6E] hover:bg-[#8DEB6E]/90 text-primary font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              Continue
            </button>
          ) : (
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={!watch('idDocument') || !watch('businessRegCertificate')}
              className="flex-1 py-3 px-4 bg-[#8DEB6E] hover:bg-[#8DEB6E]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-primary font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isLoading ? "Submitting..." : "Complete Registration"}
            </LoadingButton>
          )}
        </div>
      </form>

      {currentStep === 1 && (
        <>
          <div className="relative group">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Ban className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1E4700] hover:text-[#1E4700]/80 font-medium">
              Sign in here
            </Link>
          </div>
        </>
      )}

      {currentStep === 4 && (
        <div className="text-center text-xs text-gray-500">
          By continuing, you agree to 9ja-cart's Conditions of Use and Privacy Notice.
        </div>
      )}

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        isLoading={isLoading}
        accountNumber={watch('accountNumber')}
        bankName={watch('settlementBankName') || watch('bank')}
        settlementBank={watch('settlementBank')}
        onConfirm={handleConfirmAccountDetails}
        onCancel={handleCancelDialog}
      />

      <PaymentDialog
        isOpen={showPaymentDialog}
        isLoading={isLoading}
        isPaying={isPaying}
        paymentMethod={paymentMethod}
        onSelectMethod={setPaymentMethod}
        onConfirm={handlePaymentAndSubmit}
        onCancel={handleCancelPaymentDialog}
      />
    </div>
  );
}
// components/registration/StepIndicator.tsx
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-[#8DEB6E] text-primary'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// components/registration/ConfirmationDialog.tsx
import { X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  accountNumber: string;
  bankName: string;
  settlementBank: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = ({
  isOpen,
  isLoading,
  accountNumber,
  bankName,
  settlementBank,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-4 pr-8">
          Confirm Account Information
        </h2>
        <p className="text-gray-700 mb-4">
          Kindly confirm that the account details provided is correct. You will not be able to edit the Account information later.
        </p>
        
        <div className="bg-gray-50 rounded-md p-4 mb-6 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Account Number</label>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {accountNumber || 'Not provided'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Bank Name</label>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {bankName || 'Not provided'}
            </p>
          </div>
          {settlementBank && (
            <div>
              <label className="text-sm font-medium text-gray-600">Settlement Bank Code</label>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {settlementBank}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-[#2ac12a] rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-[#8DEB6E] text-primary rounded-md hover:bg-[#8DEB6E]/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
};