/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RegistrationStep3Data } from '@/types';



/**
 * Convert registration step 3 data to FormData for API submission
 */
export const createRegistrationFormData = (data: RegistrationStep3Data): FormData => {
  console.log('🛠️ UTILS - Creating FormData from:', data);
  
  const formData = new FormData();

  // Basic fields
  formData.append('emailAddress', data.emailAddress);
  formData.append('businessRegNumber', data.businessRegNumber);
  formData.append('storeName', data.storeName);
  formData.append('businessAddress', data.businessAddress);
  formData.append('taxIdNumber', data.taxIdNumber);

  console.log('🛠️ UTILS - Added basic fields to FormData');

  // File uploads - try without custom filename first
  formData.append('idDocument', data.idDocument);
  formData.append('businessRegCertificate', data.businessRegCertificate);

  console.log('🛠️ UTILS - Added files to FormData:', {
    idDocument: {
      name: data.idDocument.name,
      size: data.idDocument.size,
      type: data.idDocument.type
    },
    businessRegCertificate: {
      name: data.businessRegCertificate.name,
      size: data.businessRegCertificate.size,
      type: data.businessRegCertificate.type
    }
  });

  console.log('🛠️ UTILS - FormData created successfully');
  return formData;
};

/**
 * Validate document file for registration
 */
export const validateRegistrationDocument = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/webp',
    'application/pdf'
  ];

  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid document file (JPEG, PNG, WebP, or PDF)';
  }

  if (file.size > maxSize) {
    return 'Document size must be less than 10MB';
  }

  return null;
};

/**
 * Validate both required documents
 */
export const validateRegistrationDocuments = (
  idDocument: File | null, 
  businessRegCertificate: File | null
): string[] => {
  const errors: string[] = [];

  if (!idDocument) {
    errors.push('ID document is required');
  } else {
    const idError = validateRegistrationDocument(idDocument);
    if (idError) {
      errors.push(`ID Document: ${idError}`);
    }
  }

  if (!businessRegCertificate) {
    errors.push('Business registration certificate is required');
  } else {
    const certError = validateRegistrationDocument(businessRegCertificate);
    if (certError) {
      errors.push(`Business Certificate: ${certError}`);
    }
  }

  return errors;
};

/**
 * Get business category ID from category name
 */
export const getBusinessCategoryIdByName = (categoryName: string, categories: any[]): number | null => {
  const category = categories.find(cat => cat.categoryName === categoryName);
  return category ? parseInt(category.id) : null;
};

/**
 * Get product category ID from category name (legacy)
 */
export const getCategoryIdByName = (categoryName: string, categories: any[]): number | null => {
  const category = categories.find(cat => cat.categoryName === categoryName);
  return category ? parseInt(category.categoryId) : null;
};

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Nigerian phone number validation
  const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format phone number for API
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove spaces and format for Nigerian numbers
  const cleaned = phone.replace(/\s/g, '');
  
  // If starts with 0, replace with +234
  if (cleaned.startsWith('0')) {
    return '+234' + cleaned.substring(1);
  }
  
  // If starts with 234, add +
  if (cleaned.startsWith('234')) {
    return '+' + cleaned;
  }
  
  // If already starts with +234, return as is
  if (cleaned.startsWith('+234')) {
    return cleaned;
  }
  
  // Otherwise, assume it's a local number and add +234
  return '+234' + cleaned;
};


// lib/validation/registration.schema.ts
import { z } from 'zod';

export const registrationSchema = z.object({
  // Step 1: Account Info
  emailAddress: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  
  // Step 3: Personal & Business Info
  fullName: z.string().min(1, 'Full name is required'),
  businessName: z.string().min(1, 'Business name is required'),
  businessCategory: z.string().min(1, 'Business category is required'),
  businessCategoryId: z.number().min(1, 'Business category is required'),
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .regex(/^0[7-9][0-1]\d{8}$/, 'Enter a valid Nigerian phone number'),
  accountNumber: z.string()
    .length(10, 'Account number must be exactly 10 digits')
    .regex(/^\d+$/, 'Account number must contain only digits'),
  bank: z.string().min(1, 'Bank name is required'),
  settlementBank: z.string().min(1, 'Settlement bank is required'),
  settlementBankName: z.string().min(1, 'Bank name is required'),
  
  // Step 4: Business Details & Documents
  storeName: z.string().min(1, 'Store name is required'),
  businessAddress: z.string().min(1, 'Business address is required'),
  taxIdNumber: z.string()
    .min(1, 'Tax ID is required')
    .regex(/^[0-9-]+$/, 'Tax ID can only include digits and hyphens')
    .refine((val) => {
      const digitsOnly = val.replace(/-/g, '');
      return digitsOnly.length === 10 || digitsOnly.length === 14;
    }, 'Tax ID must contain exactly 10 or 14 digits'),
  businessRegNumber: z.string()
    .optional()
    .refine(
      (val) => !val || /^RC-?\d{7}$/i.test(val),
      'Use RC1234567 or RC-1234567 (7 digits after RC)'
    ),
  idDocument: z.instanceof(File, { message: 'ID document is required' }),
  businessRegCertificate: z.instanceof(File, { message: 'Business registration certificate is required' }),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;