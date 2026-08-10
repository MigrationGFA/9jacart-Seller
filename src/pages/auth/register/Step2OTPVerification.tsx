// components/registration/Step2OTPVerification.tsx
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { useOTPVerification } from './useOTPVerification';

interface Step2OTPVerificationProps {
  email: string;
  onVerified: () => void;
  otp: ReturnType<typeof useOTPVerification>;
}

export const Step2OTPVerification = ({ email, onVerified, otp }: Step2OTPVerificationProps) => {
  const {
    otpCode, setOtpCode, isOtpVerified, isSendingOtp, isVerifyingOtp,
    otpError, setOtpError,  verifyOTP, resendOTP
  } = otp;

  const handleVerify = async () => {
    try {
      await verifyOTP();
      onVerified(); // only reached if verifyOTP didn't throw
    } catch {
      // error state/popup already handled inside verifyOTP
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h2>
        <p className="text-gray-600">We've sent a verification code to your email address.</p>
      </div>

      <div className="bg-green-100 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Check your email</span>
        </div>
        <p className="text-sm text-gray-700">
          We sent a 5-digit verification code to <span className="font-semibold">{email}</span>
        </p>
      </div>

      <div>
        <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code
        </label>
        <input
          id="otpCode"
          type="text"
          value={otpCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 5);
            setOtpCode(value);
            if (otpError) setOtpError(null);
          }}
          disabled={isVerifyingOtp || isOtpVerified}
          maxLength={5}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 text-center text-2xl tracking-widest font-mono ${
            otpError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="00000"
        />
        {otpError && (
          <p className="mt-1 text-sm text-red-600">{otpError}</p>
        )}
        {isOtpVerified && (
          <p className="mt-1 text-sm text-green-600">Email verified successfully!</p>
        )}
      </div>

      <LoadingButton
        type="button"
        onClick={handleVerify}
        isLoading={isVerifyingOtp}
        disabled={isOtpVerified || !otpCode.trim() || otpCode.trim().length !== 5}
        className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {isVerifyingOtp ? 'Verifying...' : isOtpVerified ? 'Email Verified' : 'Verify Email Address'}
      </LoadingButton>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the email?{' '}
          <button
            type="button"
            onClick={resendOTP}
            disabled={isSendingOtp}
            className="text-[#1E4700] hover:text-[#1E4700]/80 font-medium focus:outline-none disabled:opacity-50"
          >
            {isSendingOtp ? 'Sending...' : 'Resend verification code'}
          </button>
        </p>
      </div>
    </div>
  );
};