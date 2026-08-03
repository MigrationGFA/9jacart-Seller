// hooks/useBankSearch.ts
import { useState, useRef, useEffect } from 'react';
import { searchBanks, type Bank } from '@/lib/banks.data';

export const useBankSearch = (onBankSelect: (bank: Bank) => void) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Bank[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    
    if (value.trim()) {
      const results = searchBanks(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (bank: Bank) => {
    onBankSelect(bank);
    setSearchTerm(bank.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    inputRef,
    suggestionsRef,
    handleInputChange,
    handleSelect,
  };
};