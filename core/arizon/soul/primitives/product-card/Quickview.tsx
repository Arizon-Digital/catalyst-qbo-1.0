

'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Gallery } from '@/arizon/soul/pages/product/[slug]/_components/gallery';
import { PriceLabel } from '@/arizon/soul/primitives/price-label';
import { ProductDetailForm, ProductDetailFormAction } from '@/arizon/soul/sections/product-detail/product-detail-form';
import { Accordion, Accordions } from '@/vibes/soul/primitives/accordions';
import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { useCommonContext } from '~/components/common-context/common-provider';
import TabComponent from '@/arizon/soul/sections/product-detail/tab';

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

const PriceLabelSkeleton = () => (
  <div className="my-4 h-4 w-20 animate-pulse rounded-md bg-contrast-100" />
);

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

const getProductData = async (productContext, product) => {
  if (!productContext?.getCurrencyCode) {
    console.error("Product context or getCurrencyCode not available");
    return product;
  }
  
  try {
    let currencyCode = await productContext.getCurrencyCode;
    const productData = await fetch(
      `/api/get-product/?productId=${product?.entityId || product?.id}&currencyCode=${currencyCode}`,
    )
      .then((data) => data.json())
      .then((data) => data)
      .catch((err) => {
        console.log(err);
        return product;
      });
    return productData;
  } catch (err) {
    console.error("Error fetching product data:", err);
    return product;
  }
};

interface QuickViewProps {
  product: any;
  action?: ProductDetailFormAction<any>;
  fields?: Streamable<any[]>;
  quantityLabel?: string;
  incrementLabel?: string;
  decrementLabel?: string;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  originalPdata?:{}
}

const QuickView = ({
  product: initialProduct,
  action,
  fields: streamableFields,
  quantityLabel,
  incrementLabel,
  decrementLabel,
  ctaLabel: streamableCtaLabel,
  ctaDisabled: streamableCtaDisabled,
  originalPdata
}: QuickViewProps) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [productInfo, setProductInfo] = useState(initialProduct);
  const productContext = useCommonContext?.();
  
  const streamableProduct = productInfo && typeof Streamable !== 'undefined' && Streamable.of 
    ? Streamable.of(productInfo) 
    : { value: productInfo };

  const openQuickView = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsOpen(true);
    
    if (productContext) {
      try {
        const productData = await getProductData(productContext, initialProduct);
        if (productData) {
          setProductInfo(productData);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProductInfo(initialProduct);
      }
    } else {
      setProductInfo(initialProduct);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={openQuickView}
        className="z-10 flex w-full items-center justify-center gap-2 rounded-[4px] border border-amber-600 bg-[#CA9619] -600 p-0 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-white hover:text-amber-600"
      >
        <div className="flex items-center justify-center gap-1">
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
            className="pl-1"
          >
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1-.01-8.99A4.5 4.5 0 0 1 14 10.5c0 2.49-2.01 4.5-4.5 4.5z" />
          </svg>
          <span>QUICK VIEW</span>
        </div>
      </button>

      <Dialog.Root 
        open={isOpen} 
        onOpenChange={setIsOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content
            className="quickview fixed left-1/2 top-1/2 !h-[900px] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white shadow-lg z-[9999]"
          >
            <div className="p-8">
              {/* Direct close button instead of Dialog.Close */}
              <button 
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 z-[10000]"
                onClick={() => {
                  console.log("Close button clicked");
                  setIsOpen(false);
                }}
                type="button"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </button>
              
              {typeof Stream !== 'undefined' ? (
                <Stream fallback={<div className="grid grid-cols-1 gap-8 md:grid-cols-1">
                  <div className="mb-12 mt-4">
                    <ProductGallerySkeleton />
                  </div>
                  <div>
                    <PriceLabelSkeleton />
                    <ProductDetailFormSkeleton />
                  </div>
                </div>} value={streamableProduct}>
                  {(product) =>
                    product && (
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
                        <div className="mb-12 mt-4">
                          <div className="max-h-[500px] overflow-y-auto pr-2">
                            <Gallery product={originalPdata} />
                          </div>
                        </div>
                        <div>
                          <div className="mb-6">
                            <TabComponent product={originalPdata} />
                          </div>
                          
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
                            
                            {action ? (
                              <Stream
                                fallback={<ProductDetailFormSkeleton />}
                                value={Streamable.all([
                                  streamableFields ?? [],
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
                                    fields={fields ?? []}
                                    incrementLabel={incrementLabel}
                                    productId={product.id}
                                    quantityLabel={quantityLabel}
                                  />
                                )}
                              </Stream>
                            ) : (
                              <div className="mt-6 flex items-center gap-4">
                                <div className="flex items-center rounded-md border">
                                  <button
                                    onClick={handleDecrement}
                                    className="flex h-10 w-10 items-center justify-center border-r"
                                    disabled={quantity <= 1}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </button>
                                  <div className="flex h-10 w-12 items-center justify-center">
                                    {quantity}
                                  </div>
                                  <button
                                    onClick={handleIncrement}
                                    className="flex h-10 w-10 items-center justify-center border-l"
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </button>
                                </div>
                                <button className="rounded-full bg-amber-600 px-6 py-2 text-white hover:bg-amber-700">
                                  Add to Cart
                                </button>
                              </div>
                            )}
                          </div>
                          
                          
                        </div>
                      </div>
                    )
                  }
                </Stream>
              ) : (
                productInfo && (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
                    <div className="mb-12 mt-4">
                      <div className="max-h-[500px] overflow-y-auto pr-2">
                        <Gallery product={productInfo} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-6">
                        <TabComponent product={productInfo} />
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">Price:</span>
                          <span className="text-lg font-bold">
                            {productInfo.price?.replace('CA', 'C') || ''}
                          </span>
                        </div>
                        
                        <div className="mt-6 flex items-center gap-4">
                          <div className="flex items-center rounded-md border">
                            <button
                              onClick={handleDecrement}
                              className="flex h-10 w-10 items-center justify-center border-r"
                              disabled={quantity <= 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="flex h-10 w-12 items-center justify-center">
                              {quantity}
                            </div>
                            <button
                              onClick={handleIncrement}
                              className="flex h-10 w-10 items-center justify-center border-l"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                          </div>
                          <button className="rounded-full bg-amber-600 px-6 py-2 text-white hover:bg-amber-700">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      
                      
                    </div>
                  </div>
                )
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default QuickView;