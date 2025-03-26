"use client";
import { clsx } from 'clsx';

import { Badge } from '@/vibes/soul/primitives/badge';
import { Price, PriceLabel } from '@/arizon/soul/primitives/price-label';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { Compare } from './compare';
import { useState, useEffect } from 'react';
import QuickView from '@/arizon/soul/primitives/product-card/Quickview';
import { Button } from '@/arizon/soul/primitives/button';
import { useFormStatus } from 'react-dom';
import DialogDemo from '@/arizon/soul/components/addtocartpopup';

export interface CardProduct {
  id: string;
  title: string;
  href: string;
  image?: { src: string; alt: string };
  price?: Price;
  subtitle?: string;
  badge?: string;
  rating?: number;
  entityId?: string;
  originalPdata?: any;
}

interface Props {
  className?: string;
  colorScheme?: 'light' | 'dark';
  aspectRatio?: '5:6' | '3:4' | '1:1';
  showCompare?: boolean;
  imagePriority?: boolean;
  imageSizes?: string;
  compareLabel?: string;
  compareParamName?: string;
  product: CardProduct;
  ctaDisabled?: boolean;
}

export function ProductCard({
  product,
  colorScheme = 'light',
  className,
  showCompare = false,
  aspectRatio = '5:6',
  compareLabel,
  compareParamName,
  imagePriority = false,
  ctaDisabled = false,
  imageSizes = '(min-width: 80rem) 20vw, (min-width: 64rem) 25vw, (min-width: 42rem) 33vw, (min-width: 24rem) 50vw, 100vw',
}: Props) {
  const [count, setCount] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const { id, title, subtitle, badge, price, image, href, entityId } = product;
  const [open, setOpen] = useState(false);
  
  const quickViewProduct = {
    ...product,
    entityId: entityId || id,
    name: title,
    path: href,
    images: image ? [{
      url: image.src,
      altText: image.alt
    }] : [],
    prices: price,
    originalPdata: product?.originalPdata
  };

 
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
    const { pending } = useFormStatus();

    return (
      <Button
        className="w-auto @xl:w-56"
        disabled={disabled}
        loading={pending}
        size="medium"
        type="submit"
      >
        {children}
      </Button>
    );
  }

  const handleModalClose = () => {
    setOpen(false);
  };

  
  const handleBuyNowClick = () => {
    setOpen(true);
  };
const from = "plp";
  return (
    <div className={clsx('@container border border-[#dcdcdc] rounded-[4px] shadow-[0_3px_0_#dcdcdc] flex flex-col items-center', className)}>
      <div className="relative w-full">
        <Link
          aria-label={title}
          className="group flex cursor-pointer flex-col gap-2 rounded-[4px] ring-[var(--product-card-focus,hsl(var(--primary)))] ring-offset-4 focus-visible:outline-0 focus-visible:ring-2 items-center w-full"
          href={href}
          id={id}
        >
          <div
            className={clsx(
              'relative overflow-hidden rounded-[4px] w-full',
              {
                '5:6': 'aspect-[5/6]',
                '3:4': 'aspect-[3/4]',
                '1:1': 'aspect-square',
              }[aspectRatio],
              {
                light: 'bg-[var(--product-card-light-background,hsl(var(--contrast-100)))]',
                dark: 'bg-[var(--product-card-dark-background,hsl(var(--contrast-500)))]',
              }[colorScheme],
            )}
          >
            {image != null ? (
              <Image
                alt={image.alt}
                className={clsx(
                  'w-full h-full scale-100 select-none transition-transform duration-500 ease-out group-hover:scale-110 object-cover',
                  {
                    light: 'bg-[var(--product-card-light-background,hsl(var(--contrast-100)))]',
                    dark: 'bg-[var(--product-card-dark-background,hsl(var(--contrast-500)))]',
                  }[colorScheme],
                )}
                fill
                priority={imagePriority}
                sizes={imageSizes}
                src={image.src}
              />
            ) : (
              <div
                className={clsx(
                  'break-words pl-5 pt-5 text-4xl font-bold leading-[0.8] tracking-tighter opacity-25 transition-transform duration-500 ease-out group-hover:scale-105 @xs:text-7xl',
                  {
                    light: 'text-[var(--product-card-light-title,hsl(var(--foreground)))]',
                    dark: 'text-[var(--product-card-dark-title,hsl(var(--background)))]',
                  }[colorScheme],
                )}
              >
                {title}
              </div>
            )}
            {badge != null && badge !== '' && (
              <Badge className="absolute left-3 top-3" variant="rounded">
                {badge}
              </Badge>
            )}
          </div>
        </Link>

        {/* Mobile buttons (always visible) */}
        {isMobile && (
          <div className="relative -mt-10 mb-2 px-2 z-10">
            <div className="flex items-center gap-2">
              {/* Simple button to open dialog - no server action */}
              <button
                className="flex-1 bg-[#CA9618] text-white font-semibold py-2 px-2 rounded-l flex items-center justify-center"
                onClick={handleBuyNowClick}
                disabled={ctaDisabled}
              >
                ADD TO CART
              </button>

              {/* Compare button */}
              {showCompare && (
                <button
                  className="w-10 bg-[#CA9618] text-white font-semibold py-2 px-2 rounded-r flex items-center justify-center"
                  onClick={(e) => e.preventDefault()}
                >
                  <Compare
                    colorScheme={colorScheme}
                    label=""
                    paramName={compareParamName}
                    productId={id}
                    productName={title}
                    image={image ? {
                      altText: image.alt,
                      src: image.src
                    } : undefined}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop hover buttons overlay */}
        {!isMobile && (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40">
            <div className="flex flex-col gap-2 w-full max-w-[80%]">
              {/* Quick View button */}
              <QuickView product={quickViewProduct?.originalPdata}>
                QUICK VIEW
              </QuickView>

              {/* Add to Cart and Compare buttons in one row */}
              <div className="flex items-center gap-2">
                {/* Simple button to open dialog - no server action */}
                <button
                  className="flex-1 bg-[#CA9618] text-white font-semibold py-2 px-2 rounded-l flex items-center justify-center"
                  onClick={handleBuyNowClick}
                  disabled={ctaDisabled}
                >
                  Buy Now
                </button>

                {/* Compare button */}
                {showCompare && (
                  <button
                    className="w-10 bg-[#CA9618] text-white font-semibold py-2 px-2 rounded-r flex items-center justify-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Compare
                      colorScheme={colorScheme}
                      label={compareLabel}
                      paramName={compareParamName}
                      productId={id}
                      productName={title}
                      image={image ? {
                        altText: image.alt,
                        src: image.src
                      } : undefined}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col items-center gap-x-4 gap-y-3 px-1 @xs:mt-3 @2xl:flex-row @2xl:items-center">
        <div className="flex-1 text-center">
          <Link className="group text-base flex flex-col items-center font-robotoslab" href={href} tabIndex={-1}>
            <span
              className={clsx(
                'block font-semibold',
                {
                  light: 'text-[var(--product-card-light-title,hsl(var(--foreground)))]',
                  dark: 'text-[var(--product-card-dark-title,hsl(var(--background)))]',
                }[colorScheme],
              )}
            >
              {title}
            </span>

            {subtitle != null && subtitle !== '' && (
              <span
                className={clsx(
                  'mb-2 block text-sm font-normal',
                  {
                    light: 'text-[var(--product-card-light-subtitle,hsl(var(--foreground)/75%))]',
                    dark: 'text-[var(--product-card-dark-subtitle,hsl(var(--background)/75%))]',
                  }[colorScheme],
                )}
              >
                {subtitle}
              </span>
            )}
            {price != null && <PriceLabel colorScheme={colorScheme} price={price} />}
          </Link>
        </div>
      </div>

      {/* Dialog for Add to Cart */}
      {open && (
        <DialogDemo 
        from={from}
          data={product} 
          open={open} 
          setOpen={setOpen} 
          handleModalClose={handleModalClose} 
          count={count} 
          redirectToCheckout={{
            productData: product,
            redirectToCheckout: true
          }}
        />
      )}
    </div>
  );
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx(className, "border border-[#dcdcdc] rounded-[4px] shadow-[0_3px_0_#dcdcdc] flex flex-col items-center")}>
      <div className="flex aspect-[5/6] flex-col gap-2 rounded-[4px] bg-contrast-100 items-center w-full" />
      <div className="mt-2 flex flex-col items-center gap-x-4 gap-y-3 px-1 @xs:mt-3 @2xl:flex-row @2xl:items-center">
        <div className="flex-1">
          <div className="flex flex-col text-base">
            <div className="flex h-[1lh] items-center">
              <span className="block h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
            </div>
            <div className="mb-2 flex h-[1lh] items-center text-sm font-normal text-contrast-400">
              <span className="block h-[1ex] w-[8ch] rounded-sm bg-contrast-100" />
            </div>
            <div className="flex h-[1lh] items-center">
              <span className="block h-[1ex] w-[5ch] rounded-sm bg-contrast-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}