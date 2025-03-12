

// "use client";
// import { clsx } from 'clsx';

// import { Badge } from '@/vibes/soul/primitives/badge';
// import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
// import { Image } from '~/components/image';
// import { Link } from '~/components/link';

// import { Compare } from './compare';
// import { useState } from 'react';

// export interface CardProduct {
//   id: string;
//   title: string;
//   href: string;
//   image?: { src: string; alt: string };
//   price?: Price;
//   subtitle?: string;
//   badge?: string;
//   rating?: number;
// }

// interface Props {
//   className?: string;
//   colorScheme?: 'light' | 'dark';
//   aspectRatio?: '5:6' | '3:4' | '1:1';
//   showCompare?: boolean;
//   imagePriority?: boolean;
//   imageSizes?: string;
//   compareLabel?: string;
//   compareParamName?: string;
//   product: CardProduct;
// }

// // eslint-disable-next-line valid-jsdoc
// /**
//  * This component supports various CSS variables for theming. Here's a comprehensive list, along
//  * with their default values:
//  *
//  * ```css
//  * :root {
//  *   --product-card-focus: hsl(var(--primary));
//  *   --product-card-border-radius: 1rem;
//  *   --product-card-light-background: hsl(var(--contrast-100));
//  *   --product-card-light-title: hsl(var(--foreground));
//  *   --product-card-light-subtitle: hsl(var(--foreground) / 75%);
//  *   --product-card-dark-background: hsl(var(--contrast-500));
//  *   --product-card-dark-title: hsl(var(--background));
//  *   --product-card-dark-subtitle: hsl(var(--background) / 75%);
//  * }
//  * ```
//  */
// export function ProductCard({
//   product: { id, title, subtitle, badge, price, image, href },
//   colorScheme = 'light',
//   className,
//   showCompare = false,
//   aspectRatio = '5:6',
//   compareLabel,
//   compareParamName,
//   imagePriority = false,
//   imageSizes = '(min-width: 80rem) 20vw, (min-width: 64rem) 25vw, (min-width: 42rem) 33vw, (min-width: 24rem) 50vw, 100vw',
// }: Props) {
//   const [storeId,setStoreId]=useState([])

//   return (
//     <div className={clsx('@container border border-[#dcdcdc] rounded-[4px] shadow-[0_3px_0_#dcdcdc] flex flex-col items-center', className)}>
//       <Link
//         aria-label={title}
//         className="group flex cursor-pointer flex-col gap-2 rounded-[4px] ring-[var(--product-card-focus,hsl(var(--primary)))] ring-offset-4 focus-visible:outline-0 focus-visible:ring-2 items-center w-full"
//         href={href}
//         id={id}
//       >
//         <div
//           className={clsx(
//             'relative overflow-hidden rounded-[4px] w-full group',
//             {
//               '5:6': 'aspect-[5/6]',
//               '3:4': 'aspect-[3/4]',
//               '1:1': 'aspect-square',
//             }[aspectRatio],
//             {
//               light: 'bg-[var(--product-card-light-background,hsl(var(--contrast-100)))]',
//               dark: 'bg-[var(--product-card-dark-background,hsl(var(--contrast-500)))]',
//             }[colorScheme],
//           )}
//         >
//           {image != null ? (
//             <>
//               <Image
//                 alt={image.alt}
//                 className={clsx(
//                   'w-full h-full scale-100 select-none transition-transform duration-500 ease-out group-hover:scale-110 object-cover',
//                   {
//                     light: 'bg-[var(--product-card-light-background,hsl(var(--contrast-100))]',
//                     dark: 'bg-[var(--product-card-dark-background,hsl(var(--contrast-500))]',
//                   }[colorScheme],
//                 )}
//                 fill
//                 priority={imagePriority}
//                 sizes={imageSizes}
//                 src={image.src}
//               />
              
//               {showCompare && (
//                 <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black bg-opacity-20">
//                   <Compare
//                     colorScheme={colorScheme}
//                     label={compareLabel}
//                     paramName={compareParamName}
//                     productId={id}
//                     productName={title}  
//                     image={image ? { 
//                       altText: image.alt, 
//                       src: image.src 
//                     } : undefined}
//                   />
//                 </div>
//               )}
//             </>
//           ) : (
//             <div
//               className={clsx(
//                 'break-words pl-5 pt-5 text-4xl font-bold leading-[0.8] tracking-tighter opacity-25 transition-transform duration-500 ease-out group-hover:scale-105 @xs:text-7xl',
//                 {
//                   light: 'text-[var(--product-card-light-title,hsl(var(--foreground)))]',
//                   dark: 'text-[var(--product-card-dark-title,hsl(var(--background)))]',
//                 }[colorScheme],
//               )}
//             >
//               {title}
//             </div>
//           )}
//           {badge != null && badge !== '' && (
//             <Badge className="absolute left-3 top-3" variant="rounded">
//               {badge}
//             </Badge>
//           )}
//         </div>
//       </Link>

//       <div className="mt-2 flex flex-col items-center gap-x-4 gap-y-3 px-1 @xs:mt-3 @2xl:flex-row @2xl:items-center">
//         <div className="flex-1 text-center">
//           <Link className="group text-base flex flex-col items-center" href={href} tabIndex={-1}>
//             <span
//               className={clsx(
//                 'block font-semibold',
//                 {
//                   light: 'text-[var(--product-card-light-title,hsl(var(--foreground)))]',
//                   dark: 'text-[var(--product-card-dark-title,hsl(var(--background)))]',
//                 }[colorScheme],
//               )}
//             >
//               {title}
//             </span>

//             {subtitle != null && subtitle !== '' && (
//               <span
//                 className={clsx(
//                   'mb-2 block text-sm font-normal',
//                   {
//                     light: 'text-[var(--product-card-light-subtitle,hsl(var(--foreground)/75%))]',
//                     dark: 'text-[var(--product-card-dark-subtitle,hsl(var(--background)/75%))]',
//                   }[colorScheme],
//                 )}
//               >
//                 {subtitle}
//               </span>
//             )}
//             {price != null && <PriceLabel colorScheme={colorScheme} price={price} />}
//           </Link>
//         </div>
       
//       </div>
//     </div>
//   );
// }

// export function ProductCardSkeleton({ className }: { className?: string }) {
//   return (
//     <div className={clsx(className, "border border-[#dcdcdc] rounded-[4px] shadow-[0_3px_0_#dcdcdc] flex flex-col items-center")}>
//       <div className="flex aspect-[5/6] flex-col gap-2 rounded-[4px] bg-contrast-100 items-center w-full" />
//       <div className="mt-2 flex flex-col items-center gap-x-4 gap-y-3 px-1 @xs:mt-3 @2xl:flex-row @2xl:items-center">
//         <div className="flex-1">
//           <div className="flex flex-col text-base">
//             <div className="flex h-[1lh] items-center">
//               <span className="block h-[1ex] w-[10ch] rounded-sm bg-contrast-100" />
//             </div>
//             <div className="mb-2 flex h-[1lh] items-center text-sm font-normal text-contrast-400">
//               <span className="block h-[1ex] w-[8ch] rounded-sm bg-contrast-100" />
//             </div>
//             <div className="flex h-[1lh] items-center">
//               <span className="block h-[1ex] w-[5ch] rounded-sm bg-contrast-100" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { clsx } from 'clsx';

import { Badge } from '@/vibes/soul/primitives/badge';
import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

import { Compare } from './compare';
import { useState } from 'react';

export interface CardProduct {
  id: string;
  title: string;
  href: string;
  image?: { src: string; alt: string };
  price?: Price;
  subtitle?: string;
  badge?: string;
  rating?: number;
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
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --product-card-focus: hsl(var(--primary));
 *   --product-card-border-radius: 1rem;
 *   --product-card-light-background: hsl(var(--contrast-100));
 *   --product-card-light-title: hsl(var(--foreground));
 *   --product-card-light-subtitle: hsl(var(--foreground) / 75%);
 *   --product-card-dark-background: hsl(var(--contrast-500));
 *   --product-card-dark-title: hsl(var(--background));
 *   --product-card-dark-subtitle: hsl(var(--background) / 75%);
 * }
 * ```
 */
export function ProductCard({
  product: { id, title, subtitle, badge, price, image, href },
  colorScheme = 'light',
  className,
  showCompare = false,
  aspectRatio = '5:6',
  compareLabel,
  compareParamName,
  imagePriority = false,
  imageSizes = '(min-width: 80rem) 20vw, (min-width: 64rem) 25vw, (min-width: 42rem) 33vw, (min-width: 24rem) 50vw, 100vw',
}: Props) {
  const [storeId,setStoreId]=useState([])

  return (
    <div className={clsx('@container border border-[#dcdcdc] rounded-[4px] shadow-[0_3px_0_#dcdcdc] flex flex-col items-center', className)}>
      <Link
        aria-label={title}
        className="group flex cursor-pointer flex-col gap-2 rounded-[4px] ring-[var(--product-card-focus,hsl(var(--primary)))] ring-offset-4 focus-visible:outline-0 focus-visible:ring-2 items-center w-full"
        href={href}
        id={id}
      >
        <div
          className={clsx(
            'relative overflow-hidden rounded-[4px] w-full group',
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
            <>
              <Image
                alt={image.alt}
                className={clsx(
                  'w-full h-full scale-100 select-none transition-transform duration-500 ease-out group-hover:scale-110 object-cover',
                  {
                    light: 'bg-[var(--product-card-light-background,hsl(var(--contrast-100))]',
                    dark: 'bg-[var(--product-card-dark-background,hsl(var(--contrast-500))]',
                  }[colorScheme],
                )}
                fill
                priority={imagePriority}
                sizes={imageSizes}
                src={image.src}
              />
              
              {showCompare && (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex flex-col gap-2 w-full max-w-[80%]">
                    <button className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      QUICK VIEW
                    </button>
                    
                    <button className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                      </svg>
                      ADD TO CART
                    </button>
                    
                    <div className="flex items-center">
                      <button className="bg-yellow-500 flex-grow text-white font-semibold py-2 px-4 rounded-l flex items-center justify-center">
                        <Compare
                          colorScheme={colorScheme}
                          label={compareLabel || "COMPARE"}
                          paramName={compareParamName}
                          productId={id}
                          productName={title}  
                          image={image ? { 
                            altText: image.alt, 
                            src: image.src 
                          } : undefined}
                        />
                      </button>
                      <button className="bg-yellow-500 py-2 px-2 rounded-r text-white font-semibold border-l border-yellow-600">
                        ↻
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
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

      <div className="mt-2 flex flex-col items-center gap-x-4 gap-y-3 px-1 @xs:mt-3 @2xl:flex-row @2xl:items-center">
        <div className="flex-1 text-center">
          <Link className="group text-base flex flex-col items-center" href={href} tabIndex={-1}>
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