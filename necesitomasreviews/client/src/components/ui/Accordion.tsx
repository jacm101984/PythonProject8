// src/components/ui/Accordion.tsx
import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-lg">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
};