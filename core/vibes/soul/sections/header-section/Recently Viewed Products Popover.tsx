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
        <div className='flex mr-[20px] items-center'>
              <div className="mr-3">
                <svg
                  width="45"
                  height="50"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="20"
                    y="15"
                    width="60"
                    height="70"
                    rx="1"
                    stroke="#1A2A47"
                    strokeWidth="5"
                    fill="none"
                  ></rect>
                  <rect x="27" y="25" width="8" height="8" rx="1" fill="#1A2A47"></rect>
                  <rect x="40" y="27" width="30" height="4" fill="#1A2A47"></rect>
                  <rect x="27" y="45" width="8" height="8" rx="1" fill="#1A2A47"></rect>
                  <rect x="40" y="47" width="30" height="4" fill="#1A2A47"></rect>
                  <rect x="27" y="65" width="8" height="8" rx="1" fill="#1A2A47"></rect>
                  <rect x="40" y="67" width="15" height="4" fill="#1A2A47"></rect>
                  <circle
                    cx="80"
                    cy="65"
                    r="12"
                    stroke="#1A2A47"
                    strokeWidth="4"
                    fill="#ffffff"
                  ></circle>
                  <line x1="80" y1="65" x2="80" y2="58" stroke="#1A2A47" strokeWidth="2"></line>
                  <line x1="80" y1="65" x2="87" y2="65" stroke="#1A2A47" strokeWidth="2"></line>
                </svg>
              </div>
              <div className='flex flex-col items-center recently-viewed font-robotoslab'>
              <p className="recently text-[#1c2541]"> Recently </p>
              <p className="recently text-[#1c2541]"> Viewed </p>
              
              </div>
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