


'use client';

import React from 'react';
import Link from 'next/link';
import * as Dialog from "@radix-ui/react-dialog";
import { X } from 'lucide-react';
import { PricingFragment } from '~/client/fragments/pricing';
import { FragmentOf } from '~/client/graphql';

interface BulkPricingProps {
  product?: FragmentOf<typeof PricingFragment>;
}

export default function BulkPricing({ product }: BulkPricingProps) {
  const hasBulkPricing = product?.prices?.bulkPricing?.length > 0;

  const formatCurrency = (value: number) => {
    // Format the number with thousand separators and 2 decimal places
    const formattedNumber = value.toLocaleString('en-CA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `C$${formattedNumber}`;
  };

  const renderBulkPricingDetails = () => {
    return product?.prices?.bulkPricing?.map((pricing, index) => {
      let discountText = '';

      if ('price' in pricing) {
        discountText = `${formatCurrency(pricing.price)} `;
      } else if ('percentOff' in pricing) {
        discountText = `${pricing.percentOff.toFixed(2)}% off`;
      } else if ('priceAdjustment' in pricing) {
        discountText = `${formatCurrency(Number(pricing.priceAdjustment))} `;
      }

      return (
        <li key={index} className="text-gray-700">
          • Buy {pricing.minimumQuantity} {pricing.maximumQuantity ? '-' : 'or'} {pricing.maximumQuantity || 'above'} and pay only {discountText} each
        </li>
      );
    });
  };

  if (!hasBulkPricing) {
    return (
      <div className="">
        <p className="mb-3 mt-2 f text-base font-semibold font-robotoslab leading-none @xl:mb-4 @xl:text-base @4xl:text-base">
          Bulk Pricing : 
        
        <span className="font-robotoslab font-light">
          <Link 
            href="/bulk-pricing"
            className="text-black-600 hover:text-blue-700 underline capitalize"
          >
            Click Here to Enquire
          </Link>
        </span>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="mb-3 mt-2 f text-base font-semibold font-robotoslab leading-none @xl:mb-4 @xl:text-base @4xl:text-base">
        Bulk Pricing :
      
      
      <span className="font-robotoslab font-light">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="text-black-600 hover:text-blue-700 underline capitalize">
              Click Here to View
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-2xl font-bold">
                  Bulk discount rates
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </Dialog.Close>
              </div>

              <p className="text-gray-600 mb-6">
                Below are the available bulk discount rates for each individual item when you purchase a certain amount:
              </p>

              <ul className="space-y-3">
                {renderBulkPricingDetails()}
              </ul>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </span>
      </p>
    </div>
  );
}