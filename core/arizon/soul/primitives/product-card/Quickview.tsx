
'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Gallery } from '@/arizon/soul/pages/product/[slug]/_components/gallery';
import { PriceLabel } from '@/arizon/soul/primitives/price-label';
import { Description } from '@/arizon/soul/sections/product-detail/description';
import { ProductDetailForm, ProductDetailFormAction } from '@/arizon/soul/sections/product-detail/product-detail-form';
import { Accordion, Accordions } from '@/vibes/soul/primitives/accordions';
import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { ProductDetailSkeleton } from '../../sections/product-detail';

// Define or import the ProductGallerySkeleton
const ProductGallerySkeleton = () => (
  <div className="@container">
    <div className="w-full overflow-hidden rounded-xl @xl:rounded-2xl">
      <div className="flex">
        <div className="aspect-[4/5] h-full w-full shrink-0 grow-0 basis-full animate-pulse bg-contrast-100" />
      </div>
    </div>
    <div className="mt-2 flex max-w-full gap-2 overflow-x-auto">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-contrast-100 @md:h-16 @md:w-16"
        />
      ))}
    </div>
  </div>
);

// Define or import the PriceLabelSkeleton
const PriceLabelSkeleton = () => (
  <div className="my-4 h-4 w-20 animate-pulse rounded-md bg-contrast-100" />
);

// Define or import the ProductDetailFormSkeleton
const ProductDetailFormSkeleton = () => (
  <div className="flex animate-pulse flex-col gap-8">
    <div className="flex flex-col gap-5">
      <div className="h-2 w-10 rounded-md bg-contrast-100" />
      <div className="flex gap-2">
        <div className="h-11 w-[72px] rounded-full bg-contrast-100" />
        <div className="h-11 w-[72px] rounded-full bg-contrast-100" />
        <div className="h-11 w-[72px] rounded-full bg-contrast-100" />
      </div>
    </div>
    <div className="flex flex-col gap-5">
      <div className="h-2 w-16 rounded-md bg-contrast-100" />
      <div className="flex gap-4">
        <div className="h-10 w-10 rounded-full bg-contrast-100" />
        <div className="h-10 w-10 rounded-full bg-contrast-100" />
        <div className="h-10 w-10 rounded-full bg-contrast-100" />
        <div className="h-10 w-10 rounded-full bg-contrast-100" />
        <div className="h-10 w-10 rounded-full bg-contrast-100" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-12 w-[120px] rounded-lg bg-contrast-100" />
      <div className="h-12 w-[216px] rounded-full bg-contrast-100" />
    </div>
  </div>
);

interface QuickViewProps {
  product: Streamable<ProductDetailProduct | null>;
  action: ProductDetailFormAction<any>;
  fields: Streamable<any[]>;
  quantityLabel?: string;
  incrementLabel?: string;
  decrementLabel?: string;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
}

const QuickView = ({
  product: streamableProduct,
  action,
  fields: streamableFields,
  quantityLabel,
  incrementLabel,
  decrementLabel,
  ctaLabel: streamableCtaLabel,
  ctaDisabled: streamableCtaDisabled,
}: QuickViewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openQuickView = () => {
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={openQuickView}
        className="z-10 quick-view-btn flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#ca9618] bg-[#ca9618] p-0 text-[13px] font-[700] text-[#ffffff] shadow-sm transition-all duration-300 hover:bg-[#fff] hover:text-[#ca9618]"
      >
        <div className="flex items-center justify-center gap-[5px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pl-[3px]"
          >
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1-.01-8.99A4.5 4.5 0 0 1 14 10.5c0 2.49-2.01 4.5-4.5 4.5z" />
          </svg>
          <span>QUICK VIEW</span>
        </div>
      </button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed left-[50%] top-[50%] max-h-[90vh] w-[90vw] max-w-4xl translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg bg-white shadow-lg quickview"
            style={{ zIndex: 9999 }} // Add z-index here
            onClick={(e) => e.stopPropagation()} // Prevent event propagation
          >
            <div className="p-8">
              <Dialog.Close className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
              <Stream fallback={<ProductDetailSkeleton />} value={streamableProduct}>
                {(product) =>
                  product && (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="a1 mb-12 mt-4 lg:grid lg:grid-cols-2 lg:gap-8">
                        <Stream fallback={<ProductGallerySkeleton />} value={product.images ?? []}>
                          {(images) => <Gallery product={{ ...product, images }} />}
                        </Stream>
                      </div>
                      <div className="lg:col-span-2" id="tabsection1">
                        <Description product={product} />
                        <div className="mt-6">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold">Price:</span>
                            <Stream fallback={<PriceLabelSkeleton />} value={product.price}>
                              {(price) => (
                                <PriceLabel
                                  className="text-lg font-bold"
                                  price={price?.replace('CA', 'C') ?? ''}
                                />
                              )}
                            </Stream>
                          </div>
                          <Stream
                            fallback={<ProductDetailFormSkeleton />}
                            value={Streamable.all([
                              streamableFields ?? [], // Ensure fields is defined
                              streamableCtaLabel,
                              streamableCtaDisabled,
                            ])}
                          >
                            {([fields, ctaLabel, ctaDisabled]) => (
                              <ProductDetailForm
                                action={action}
                                ctaDisabled={ctaDisabled ?? undefined}
                                ctaLabel={ctaLabel ?? undefined}
                                decrementLabel={decrementLabel}
                                fields={fields ?? []} // Ensure fields is defined
                                incrementLabel={incrementLabel}
                                productId={product.id}
                                quantityLabel={quantityLabel}
                              />
                            )}
                          </Stream>
                        </div>
                        <Accordions>
                          <Accordion title="Specifications">
                            <div className="prose">
                              <p>Product specifications go here.</p>
                            </div>
                          </Accordion>
                          <Accordion title="Warranty">
                            <div className="prose">
                              <p>Warranty information goes here.</p>
                            </div>
                          </Accordion>
                        </Accordions>
                      </div>
                    </div>
                  )
                }
              </Stream>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default QuickView;