
import React, { useState } from 'react';
import { CloseIcon, PlusIcon } from './IconComponents';

interface MultiSelectInputProps {
  label: string;
  placeholder: string;
  predefinedOptions: string[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({ label, placeholder, predefinedOptions, selectedItems, setSelectedItems }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = (item: string) => {
    const trimmedItem = item.trim();
    if (trimmedItem && !selectedItems.includes(trimmedItem)) {
      setSelectedItems([...selectedItems, trimmedItem]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem(inputValue);
      setInputValue('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-text">{label}</label>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg bg-white shadow-sm">
        {selectedItems.map(item => (
          <span key={item} className="flex items-center bg-primary/20 text-primary-dark font-semibold px-3 py-1 rounded-full text-sm">
            {item}
            <button onClick={() => handleRemoveItem(item)} className="ml-2 text-primary-dark hover:text-red-500">
              <CloseIcon className="w-4 h-4" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="flex-grow bg-transparent focus:outline-none p-1"
        />
         <button
          type="button"
          onClick={() => { handleAddItem(inputValue); setInputValue(''); }}
          className="p-1 text-primary hover:text-primary-dark"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {predefinedOptions.filter(opt => !selectedItems.includes(opt)).map(option => (
          <button
            type="button"
            key={option}
            onClick={() => handleAddItem(option)}
            className="flex items-center bg-gray-200 text-gray-700 font-medium px-3 py-1 rounded-full text-sm hover:bg-gray-300"
          >
            <PlusIcon className="w-4 h-4 mr-1"/>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectInput;
