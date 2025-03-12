'use client';

import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Link } from '~/components/link';
import { getRecentlyViewedProducts } from "~/components/graphql-apis";

const ViewedItems = ({ recentlyViewed }) => {
  if (!recentlyViewed || !recentlyViewed.edges || recentlyViewed.edges.length === 0) {
    return <div className="text-center py-4 text-gray-500">No recently viewed items</div>;
  }

  return (
    <div className="space-y-4">
      {recentlyViewed.edges.map((edge, index) => {
        const product = edge.node;
        return (
          <div key={index} className="flex items-start border-b pb-3 last:border-0">
            <div className="w-16 h-16 bg-gray-100 flex-shrink-0 mr-3">
              {product.defaultImage?.url320wide ? (
                <Link href={product.path}>
                  <img 
                    src={product.defaultImage.url320wide} 
                    alt={product.defaultImage.altText || product.name}
                    className="w-full h-full object-contain"
                  />
                </Link>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <Link 
                href={product.path}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                {product.name}
              </Link>
              {product.pricesWithTax?.price && (
                <div className="text-sm font-bold mt-1">
                  {product.pricesWithTax.price.currencyCode} {product.pricesWithTax.price.value}
                </div>
              )}
              {product.sku && (
                <div className="text-xs text-gray-500 mt-1">
                  SKU: {product.sku}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ViewedItemsPopover = () => {
  const [recentlyViewed, setRecentlyViewed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getRecentlyViewedData = async() => {
      try {
        setIsLoading(true);
        // Get recently viewed product IDs from localStorage
        let productIds = [];
        
        // Use try-catch to safely parse localStorage data
        try {
          const storedData = localStorage.getItem('qbo_recently_viewed_items');
          if (storedData) {
            productIds = JSON.parse(storedData);
          }
        } catch (error) {
          console.error('Error parsing recently viewed items from localStorage:', error);
          productIds = [];
        }
        
        if (productIds.length > 0) {
          // Default currency code (can be made dynamic if needed)
          const currencyCode = 'USD';
          // Fetch product data for the recently viewed items
          const recentlyViewedData = await getRecentlyViewedProducts(productIds, currencyCode);
          setRecentlyViewed(recentlyViewedData);
        }
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getRecentlyViewedData();
  }, []);

  return ( 
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-2" aria-label="Recently viewed products">
          <div className="flex-shrink-0">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              className="text-blue-900" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <rect x="2" y="3" width="20" height="18" rx="2" />
              <line x1="8" y1="10" x2="16" y2="10" />
              <line x1="8" y1="14" x2="16" y2="14" />
              <line x1="8" y1="18" x2="16" y2="18" />
            </svg>
          </div>
          <div className="text-xs md:text-sm hidden sm:block">
            <div className="font-medium">Recently</div>
            <div>Viewed</div>
          </div>
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content
          className="bg-white rounded-lg p-4 shadow-lg z-[999999] w-80 border border-gray-200"
          sideOffset={5}
          align="end"
        >
          <h3 className="text-lg font-bold mb-4">Recently Viewed Products</h3>
          
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <ViewedItems recentlyViewed={recentlyViewed} />
            )}
          </div>
          
          {recentlyViewed && recentlyViewed.edges && recentlyViewed.edges.length > 0 && (
            <div className="mt-4">
              <Link
                href="/recently-viewed"
                className="w-full border border-gray-300 text-gray-700 font-medium text-sm text-center py-3 rounded block hover:bg-gray-100"
              >
                VIEW ALL
              </Link>
            </div>
          )}
          
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ); 
};

export default ViewedItemsPopover;