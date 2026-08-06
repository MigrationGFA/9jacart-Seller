// components/registration/Step3PersonalBusinessInfo.tsx
import type { RegistrationFormData } from '@/lib/registration.utils';
import type { UseFormReturn } from 'react-hook-form';
import { useBankSearch } from './useBankSearch';

interface Step3PersonalBusinessInfoProps {
  form: UseFormReturn<RegistrationFormData>;
  categories: Array<{ id: string; categoryName: string }>;
  categoriesLoading: boolean;
  isLoading: boolean;
}

export const Step3PersonalBusinessInfo = ({ 
  form, 
  categories, 
  categoriesLoading, 
  isLoading 
}: Step3PersonalBusinessInfoProps) => {
  const { register, setValue, watch, formState: { errors } } = form;

  const handleCategoryChange = (categoryName: string) => {
    const selectedCategory = categories.find(cat => cat.categoryName === categoryName);
    const categoryId = parseInt(selectedCategory?.id || '0');
    
    setValue('businessCategory', categoryName);
    setValue('businessCategoryId', categoryId);
  };

  const handleBankSelect = (bank: { name: string; code: string }) => {
    setValue('bank', bank.name);
    setValue('settlementBank', bank.code);
    setValue('settlementBankName', bank.name);
  };

  const {
    searchTerm,
    // setSearchTerm,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    inputRef,
    suggestionsRef,
    handleInputChange,
    handleSelect,
  } = useBankSearch(handleBankSelect);

  // const accountNumber = watch('accountNumber');

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal & Business Information</h2>
        <p className="text-gray-600">Tell us about yourself and your business</p>
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName')}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            errors.fullName
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          {...register('phoneNumber')}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            errors.phoneNumber
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="e.g. 08012345678"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enter a valid Nigerian phone number
        </p>
      </div>

      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
          Business Name
        </label>
        <input
          id="businessName"
          type="text"
          {...register('businessName')}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            errors.businessName
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="Enter your business name"
        />
        {errors.businessName && (
          <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 mb-2">
          Business Category
        </label>
        {categoriesLoading ? (
          <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            <span className="text-gray-500">Loading categories...</span>
          </div>
        ) : (
          <select
            id="businessCategory"
            {...register('businessCategory')}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-50 ${
              errors.businessCategory
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-transparent'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        )}
        {errors.businessCategory && (
          <p className="mt-1 text-sm text-red-600">{errors.businessCategory.message}</p>
        )}
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <p className="text-sm text-gray-600 mb-4">Please provide your bank account details. This information cannot be edited after registration.</p>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              id="accountNumber"
              type="text"
              {...register('accountNumber')}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setValue('accountNumber', value);
              }}
              disabled={isLoading}
              maxLength={10}
              className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
                errors.accountNumber
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary focus:border-transparent'
              }`}
              placeholder="Enter 10-digit account number"
            />
            {errors.accountNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              ref={inputRef}
              id="bank"
              type="text"
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
                errors.bank || errors.settlementBankName
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary focus:border-transparent'
              }`}
              placeholder="Type to search bank name"
            />
            {(errors.bank || errors.settlementBankName) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bank?.message || errors.settlementBankName?.message}
              </p>
            )}
            
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {suggestions.map((bank) => (
                  <button
                    key={bank.code}
                    type="button"
                    onClick={() => handleSelect(bank)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  >
                    <div className="font-medium text-gray-900">{bank.name}</div>
                    <div className="text-xs text-gray-500">Code: {bank.code}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="settlementBank" className="block text-sm font-medium text-gray-700 mb-2">
              Settlement Bank
            </label>
            <input
              id="settlementBank"
              type="text"
              value={watch('settlementBank') || ''}
              disabled={true}
              className="w-full px-4 py-3 border rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              placeholder="Will be prefilled when you select a bank"
            />
            {errors.settlementBank && (
              <p className="mt-1 text-sm text-red-600">{errors.settlementBank.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This field is automatically filled when you select a bank name above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};