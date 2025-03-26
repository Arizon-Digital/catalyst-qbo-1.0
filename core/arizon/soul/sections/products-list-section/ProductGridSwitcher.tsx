"use client";

import React, { useState, useEffect } from 'react';

export const ProductGridSwitcher = () => {
  // Change default state to 4
  const [columns, setColumns] = useState(4);
  const gridOptions = [1, 2, 3, 4, 5, 6];

  const handleColumnChange = (option: number) => {
    setColumns(option);
    
    // First try finding with the specific class
    let productGrid = document.querySelector('.product-grid');
    
    // If not found, try some alternative selectors
    if (!productGrid) {
      const possibleSelectors = [
        '.products-grid',
        '.products-container',
        '.category-products',
        'div.grid:has(img)',
        // Look for containers with product cards
        'div:has(> div > img + h3, > div > img + div + h3)'
      ];
      
      for (const selector of possibleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          productGrid = element;
          // Add the product-grid class for future reference
          productGrid.classList.add('product-grid');
          break;
        }
      }
    }
    
    if (productGrid) {
      // Remove all grid column classes
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
      
      // Add the appropriate grid column class
      if (option === 1) {
        productGrid.classList.add('grid-cols-1');
      } else {
        productGrid.classList.add(`grid-cols-${option}`);
      }
      
      // Make sure it's using display: grid
      productGrid.classList.add('grid');
      
      // Remove any flex classes
      productGrid.classList.remove('flex', 'flex-wrap');
      
      // If Tailwind classes aren't working, use inline styles as backup
      if (window.getComputedStyle(productGrid).display !== 'grid') {
        productGrid.style.display = 'grid';
        productGrid.style.gridTemplateColumns = `repeat(${option}, minmax(0, 1fr))`;
        productGrid.style.gap = '0';
        
        // Update children to make sure they take up the right space
        Array.from(productGrid.children).forEach(child => {
          if (child instanceof HTMLElement) {
            child.style.width = '100%';
            child.style.margin = '0';
          }
        });
      }
    } else {
      console.error('Could not find product grid container');
    }
  };

  // Add useEffect to set initial grid on component mount
  useEffect(() => {
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
                ? 'bg-white !border-[#ca9618] text-black'
                : 'hover:border-[#ca9618]'
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