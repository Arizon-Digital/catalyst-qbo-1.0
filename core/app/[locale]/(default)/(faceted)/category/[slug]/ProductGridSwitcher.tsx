"use client";

import React, { useState } from 'react';

export const ProductGridSwitcher = () => {
  // Change default state to 4
  const [columns, setColumns] = useState(4);
  const gridOptions = [1, 2, 3, 4, 5, 6];

  const handleColumnChange = (option: number) => {
    setColumns(option);
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
      productGrid.classList.remove(
        'grid-cols-1',
        'grid-cols-2',
        'grid-cols-3',
        'grid-cols-4',
        'grid-cols-5',
        'grid-cols-6',
        'sm:grid-cols-2',
        'sm:grid-cols-3'
      );

      if (option === 1) {
        productGrid.classList.add('grid-cols-1');
      } else {
        productGrid.classList.add(`grid-cols-${option}`);
      }
    }
  };

  // Add useEffect to set initial grid on component mount
  React.useEffect(() => {
    handleColumnChange(4);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Column:</span>
      <div className="flex gap-1">
        {gridOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleColumnChange(option)}
            className={`px-2 py-1 rounded text-[9.5px] border border-[#dcdcdc] ${
              columns === option
                ? 'bg-white !border-[#ca9618]  text-black'
                : ' hover:border-[#ca9618]'
            } transition-colors duration-200`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGridSwitcher;


