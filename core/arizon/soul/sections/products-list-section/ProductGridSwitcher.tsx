"use client";

import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

export const ProductGridSwitcher = () => {
  const [columns, setColumns] = useState(4);
  const gridOptions = [2, 3, 4, 5];

  const updateGridColumns = (cols: number) => {
   
    const grids = Array.from(document.querySelectorAll(
      '.products-grid, [data-product-grid], .product-list, [class*="grid-cols"]'
    )) as HTMLElement[];
    
    if (grids.length === 0) {
      console.warn('No grid containers found');
      return;
    }

    grids.forEach(grid => {
    
      const allGridClasses = Array.from(grid.classList).filter(c => 
        c.startsWith('grid-cols-') || 
        c.startsWith('@sm:grid-cols-') ||
        c.startsWith('@2xl:grid-cols-') ||
        c.startsWith('@5xl:grid-cols-')
      );
      grid.classList.remove(...allGridClasses);
      
     
      grid.classList.add(
        `grid-cols-${cols}`,
        `@sm:grid-cols-${cols}`,
        `@2xl:grid-cols-${cols}`,
        `@5xl:grid-cols-${cols}`
      );
    });
  };

  const handleColumnChange = (cols: number) => {
    setColumns(cols);
   
    setTimeout(() => updateGridColumns(cols), 10);
  };


  useEffect(() => {
    const savedCols = localStorage.getItem('productGridColumns');
    if (savedCols) {
      const cols = parseInt(savedCols);
      if (gridOptions.includes(cols)) {
        setColumns(cols);
        setTimeout(() => updateGridColumns(cols), 100);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productGridColumns', columns.toString());
  }, [columns]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Columns:</span>
      <div className="flex gap-1">
        {gridOptions.map(option => (
          <button
            key={option}
            onClick={() => handleColumnChange(option)}
            className={clsx(
              'px-2 py-1 rounded text-xs border transition-colors',
              columns === option
                ? 'bg-white border-[#ca9618] text-black font-medium'
                : 'border-gray-300 hover:border-[#ca9618]'
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGridSwitcher;