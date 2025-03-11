'use client';

import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { graphql } from "~/client/graphql";
import ViewedItems from 'app/[locale]/(default)/product/[slug]/_components/ViewedItems'; 
import { getRecentlyViewedProducts } from "../graphql-apis";



const ViewedItemsPopover = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<any>([]);
  useEffect(() => {
    const getRecentlyViewDatas = async() => {
      let productIds: any = JSON?.parse(localStorage.getItem('qbo_recently_viewed_items')) || [];
      let currencyCode = 'USD';
      let recentlyReviewed = await getRecentlyViewedProducts(productIds, currencyCode);
      setRecentlyViewed(recentlyReviewed);
    }
    getRecentlyViewDatas();
  }, []);
  return ( 
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="tab"
          style={{
            
          }}
          aria-label="Quickview"
        >
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
              <div className='flex flex-col items-center recently-viewed'>
              <p className="recently text-[#1c2541]"> Recently </p>
              <p className="recently text-[#1c2541]"> Viewed </p>
              
              </div>
            </div>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="fixed bg-white rounded-md p-6 !z-99999 recent-view-dropdown"
          style={{
            top: '350px',
            right: '-190px',
            transform: 'translate(-50%, -50%)',
            width: '290px',
            
           
          }}
          sideOffset={5}
        >
          <h3 className="text-lg font-bold">Recently viewed products</h3>
          <div className="mt-4">
            <ViewedItems recentlyViewed={recentlyViewed} /> 
          </div>
          {/* <div style={{ display: "flex", marginTop: '20px', justifyContent: "flex-end" }}>
            <Popover.Close asChild>
              <button className="Button bg-green-500 text-white px-4 py-2 rounded" aria-label="Close">
                Close
              </button>
            </Popover.Close>
          </div> */}
          <Popover.Arrow className="PopoverArrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ); 
};

export default ViewedItemsPopover; 
