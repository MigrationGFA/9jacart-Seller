// components/registration/Step1AccountInfo.tsx
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import type { RegistrationFormData } from '@/lib/registration.utils';

interface Step1AccountInfoProps {
  form: UseFormReturn<RegistrationFormData>;
  isLoading: boolean;
}

export const Step1AccountInfo = ({ form, isLoading }: Step1AccountInfoProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Get started selling <br /> on 9ja-cart
        </h2>
        <p className="text-[#182F38BF]">
          Welcome to 9ja-cart - Let's create your account
        </p>
      </div>

      <div>
        <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <input
          id="emailAddress"
          type="email"
          {...register('emailAddress')}
          disabled={isLoading}
          className={`w-full px-4 py-3 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
            errors.emailAddress
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary focus:border-transparent'
          }`}
          placeholder="Enter your email"
        />
        {errors.emailAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.emailAddress.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            disabled={isLoading}
            className={`w-full px-4 py-3 pr-10 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
              errors.password
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-transparent'
            }`}
            placeholder="Create a password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            disabled={isLoading}
            className={`w-full px-4 py-3 pr-10 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 ${
              errors.confirmPassword
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-transparent'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>
    </div>
  );
};