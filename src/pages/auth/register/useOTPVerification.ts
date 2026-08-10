// hooks/useOTPVerification.ts
import { useState } from 'react';
import { registrationService } from '@/services/registration.service';
import { popup } from '@/lib/popup';

export const useOTPVerification = (email: string) => {
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpVerificationId, setOtpVerificationId] = useState<string | null>(null);

  const sendOTP = async () => {
    setIsSendingOtp(true);
    setOtpError(null);
    setOtpCode('');
    setIsOtpVerified(false);

    try {
      const result = await registrationService.sendOTP(email);
      const verificationId = result?.verificationId || 
                            result?.data?.verificationId || 
                            result?.verification_id || 
                            null;
      setOtpVerificationId(verificationId);
      popup.success('Verification code sent to your email!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code';
      setOtpError(errorMessage);
      popup.error(errorMessage);
      throw error;
    } finally {
      setIsSendingOtp(false);
    }
  };

  const resendOTP = async () => {
    setIsSendingOtp(true);
    setOtpError(null);
    setOtpCode('');
    setIsOtpVerified(false);

    try {
      const result = await registrationService.resendOTP(email);
      const verificationId = result?.verificationId || 
                            result?.data?.verificationId || 
                            result?.verification_id || 
                            null;
      setOtpVerificationId(verificationId);
      popup.success('Verification code resent to your email!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification code';
      setOtpError(errorMessage);
      popup.error(errorMessage);
      throw error;
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpCode.trim() || otpCode.trim().length !== 5) {
      setOtpError('Please enter a valid 5-digit verification code');
      popup.error('Please enter a valid 5-digit verification code');
      return;
    }

    if (!otpVerificationId) {
      const msg = 'Verification session expired. Please resend the verification code.';
      setOtpError(msg);
      popup.error(msg);
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      await registrationService.verifyOTP(email, otpCode.trim(), otpVerificationId);
      setIsOtpVerified(true);
      popup.success('Email verified successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid verification code';
      setOtpError(errorMessage);
      popup.error(errorMessage);
      setIsOtpVerified(false);
      throw error;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resetOTP = () => {
    setOtpCode('');
    setIsOtpVerified(false);
    setOtpError(null);
    setOtpVerificationId(null);
  };

  return {
    otpCode,
    setOtpCode,
    isOtpVerified,
    isSendingOtp,
    isVerifyingOtp,
    otpError,
    setOtpError,
    sendOTP,
    verifyOTP,
    resendOTP,
    resetOTP,
  };
};