// hooks/useRegistrationForm.ts
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import {
  registrationSchema,
  type RegistrationFormData,
} from "@/lib/registration.utils";

export const useRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    categories,
    isLoading: categoriesLoading,
    fetchCategories,
  } = useBusinessCategories();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      businessName: "",
      businessCategory: "",
      businessCategoryId: 0,
      phoneNumber: "",
      accountNumber: "",
      bank: "",
      settlementBank: "",
      settlementBankName: "",
      storeName: "",
      businessAddress: "",
      taxIdNumber: "",
      businessRegNumber: "",
      state: "",
      idDocument: undefined,
      businessRegCertificate: undefined,
    },
    mode: "onChange",
  });

  const {
    trigger,
    formState: { errors },
  } = form;

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof RegistrationFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["emailAddress", "password", "confirmPassword"];
        break;
      case 3:
        fieldsToValidate = [
          "fullName",
          "businessName",
          "businessCategory",
          "businessCategoryId",
          "phoneNumber",
          "accountNumber",
          "bank",
          "settlementBank",
          "settlementBankName",
        ];
        break;
      case 4:
        fieldsToValidate = ["storeName", "businessAddress", "state"];
        // fieldsToValidate = [
        //   'storeName', 'businessAddress', 'taxIdNumber', 'state',
        //   'idDocument', 'businessRegCertificate'
        // ];
        break;
      default:
        return true;
    }

    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {
      // Focus on first error field
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }

    return isValid;
  };

  const goToNextStep = async () => {
    if (await validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return {
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
    goToNextStep,
    goToPreviousStep,
    navigate,
    errors,
  };
};
