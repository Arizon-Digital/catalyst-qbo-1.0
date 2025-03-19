


'use client';

import { Label } from '@radix-ui/react-label';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useState } from 'react';
import { useCompareDrawerContext } from '~/components/ui/compare-drawer';
import { ArrowLeftRight } from 'lucide-react'; 

interface Image {
  altText?: string;
  src?: string;
}

interface Props {
  productId: string | string[];
  productName?: string;  
  sku?: string;
  shortCode?: string;
  image?: Image;
  colorScheme?: 'light' | 'dark';
  paramName?: string;
  label?: string;
}

export const Compare = ({
  productId,
  productName,
  sku,
  shortCode,
  image,
  colorScheme = 'light',
  paramName = 'compare',
  label,
}: Props) => {
  const iconId = useId();
  const t = useTranslations('Components.ProductCard.Compare');
  const displayLabel = label || t('compare');
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { products, setProducts } = useCompareDrawerContext();
  
  // Get product name from URL if not provided
  const getDefaultProductName = () => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      return lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return '';
  };

  // Use provided product name or get from URL
  const resolvedProductName = productName || getDefaultProductName();
  
  useEffect(() => {
    if (Array.isArray(productId)) {
      setSelectedIds(productId);
    } else {
      setSelectedIds(products.some(({ id }) => id === productId) ? [productId] : []);
    }
  }, [productId, products]);
  
  const isSelected = () => {
    if (Array.isArray(productId)) {
      return productId.every(id => selectedIds.includes(id));
    }
    return selectedIds.includes(productId);
  };

  const handleToggleCompare = () => {
    const newIsSelected = !isSelected();
    
    if (Array.isArray(productId)) {
      if (newIsSelected) {
        const newIds = [...selectedIds];
        productId.forEach(id => {
          if (!newIds.includes(id)) {
            newIds.push(id);
          }
        });
        setSelectedIds(newIds);
        
        const newProducts = [...products];
        productId.forEach(id => {
          if (!products.some(p => p.id === id)) {
            const productDetails = {
              id: id,
              name: resolvedProductName,
              sku: sku,
              shortCode: shortCode,
              image: image
            };
            newProducts.push(productDetails);
          }
        });
        setProducts(newProducts);
      } else {
        const newIds = selectedIds.filter(id => !productId.includes(id));
        setSelectedIds(newIds);
        setProducts(products.filter(p => !productId.includes(p.id)));
      }
    } else {
      if (newIsSelected) {
        setSelectedIds(prev => [...prev, productId]);
        
        const productToAdd = {
          id: productId,
          name: resolvedProductName,
          sku: sku,
          shortCode: shortCode,
          image: image
        };
        
        setProducts(prev => [...prev, productToAdd]);
      } else {
        setSelectedIds(prev => prev.filter(id => id !== productId));
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        aria-label={displayLabel}
        className={`flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        id={iconId}
        onClick={handleToggleCompare}
        type="button"
      >
        <ArrowLeftRight
          className={`h-5 w-5 ${isSelected() ? 'text-blue-600' : 'text-gray-500'}`}
          strokeWidth={2}
        />
      </button>
      <Label className="font-normal cursor-pointer" htmlFor={iconId} onClick={handleToggleCompare}>
     
      </Label>
    </div>
  );
};