// components/registration/Step4BusinessDetails.tsx
import { DocumentUpload } from '@/components/ui/DocumentUpload';
import type { RegistrationFormData } from '@/lib/registration.utils';
import type { UseFormReturn } from 'react-hook-form';

interface Step4BusinessDetailsProps {
  form: UseFormReturn<RegistrationFormData>;
  isLoading: boolean;
}

export const Step4BusinessDetails = ({ form, isLoading }: Step4BusinessDetailsProps) => {
  const { register, setValue, watch, formState: { errors } } = form;
  
  const idDocument = watch('idDocument');
  const businessRegCertificate = watch('businessRegCertificate');

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Details & Documents</h2>
        <p className="text-gray-600">Complete your business verification</p>
      </div>

      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
          Store Name <span className="text-xs text-gray-500">(Public Name)</span>
        </label>
        <input
          id="storeName"
          type="text"
          {...register('storeName')}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            errors.storeName
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="Your Store Name"
        />
        {errors.storeName && (
          <p className="mt-1 text-sm text-red-600">{errors.storeName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Business Address
        </label>
        <textarea
          id="businessAddress"
          rows={3}
          {...register('businessAddress')}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            errors.businessAddress
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="Enter your complete business address"
        />
        {errors.businessAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.businessAddress.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="taxIdNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Tax Identification Number <span className="text-red-500">*</span>
        </label>
        <input
          id="taxIdNumber"
          type="text"
          {...register('taxIdNumber')}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            errors.taxIdNumber
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="Enter your TIN"
        />
        {errors.taxIdNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.taxIdNumber.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessRegNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Business Registration Number{' '}
          <span className="text-xs text-gray-500">(optional)</span>
        </label>
        <input
          id="businessRegNumber"
          type="text"
          {...register('businessRegNumber')}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            errors.businessRegNumber
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="RC-12345"
        />
        {errors.businessRegNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.businessRegNumber.message}</p>
        )}
      </div>

      <DocumentUpload
        label="ID Document"
        file={idDocument as File | null}
        onFileChange={(file) => setValue('idDocument', file)}
        accept="image/*,.pdf"
        required
        formError={errors.idDocument?.message}
      />

      <DocumentUpload
        label="Business Registration Certificate"
        file={businessRegCertificate as File | null}
        onFileChange={(file) => setValue('businessRegCertificate', file)}
        accept="image/*,.pdf"
        required
        formError={errors.businessRegCertificate?.message}
      />
    </div>
  );
};