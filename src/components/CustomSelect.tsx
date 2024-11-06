import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | string[] | number | number[];
  onChange: (value: string | string[] | number | number[]) => void;
  placeholder?: string;
  mode?: 'single' | 'multiple';
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder = 'Select an option', mode = 'single' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);

  const handleSelect = useCallback((selectedValue: string | number) => {
    if (mode === 'single') {
      onChange(selectedValue);
      setIsOpen(false);
      setSearchTerm('');
    } else {
      const currentValue = Array.isArray(value) ? value as (string | number)[] : [];
      if (currentValue.includes(selectedValue)) {
        onChange(currentValue.filter(v => v !== selectedValue));
      } else {
        onChange([...currentValue, selectedValue]);
      }
    }
  }, [mode, onChange, value]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(option.value).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = Array.isArray(value) 
    ? options.filter(option => (value as (string | number)[]).includes(option.value))
    : options.find(option => option.value === value);

  const displayValue = Array.isArray(selectedOptions)
    ? selectedOptions.map(option => option.label).join(', ')
    : selectedOptions ? selectedOptions.label : '';

  const isSelected = (optionValue: string | number) => {
    if (Array.isArray(value)) {
      return (value as (string | number)[]).includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className="relative" ref={selectRef}>
      <div className="border border-gray-300 rounded px-4 py-2 bg-white cursor-pointer flex justify-between items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOpen) setIsOpen(true);
          }}
          placeholder={displayValue || placeholder}
          className="outline-none flex-grow"
        />
        <span className="ml-2 cursor-pointer" onClick={handleToggle}>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <li
              key={String(option.value)}
              className={`px-4 py-2 hover:bg-purple-950/20 hover:text-purple-950 cursor-pointer flex items-center justify-between ${
                isSelected(option.value) ? 'bg-purple-950/20 text-purple-950' : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected(option.value)}
                  onChange={() => {}}
                  className="mr-2 accent-purple-950"
                />
                {option.label}
              </div>
              <span className="text-sm text-gray-500">{option.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
