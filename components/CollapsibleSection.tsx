
import React, { useState } from 'react';
import { ChevronDown } from './icons';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  contentClassName?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, isOpen = false, contentClassName = '' }) => {
  return (
    <details className="bg-black/20 rounded-xl border border-gray-800 overflow-hidden group" open={isOpen}>
        <summary className="flex items-center justify-between p-4 cursor-pointer list-none bg-gray-800/50 hover:bg-gray-800 transition-colors">
            <h3 className="text-lg font-bold text-white group-hover:text-[#ec028b] transition-colors">{title}</h3>
            <ChevronDown className="w-6 h-6 text-gray-400 transform transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className={`p-4 bg-gray-900/50 ${contentClassName}`}>
            {children}
        </div>
    </details>
  );
};

export default CollapsibleSection;
