import { clsx } from 'clsx';

import { Badge } from '@/vibes/soul/primitives/badge';
import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import { BcImage } from '~/components/bc-image';
import { Link } from '~/components/link';

import { Compare } from './compare';

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
  showCompare?: boolean;
  compareLabel?: string;
  compareParamName?: string;
  product: CardProduct;
}

export function ProductCard({
  product: { id, title, subtitle, badge, price, image, href },
  className,
  showCompare = false,
  compareLabel,
  compareParamName,
}: Props) {
  return (
    <div className={className}>
      <Link
        className="group flex cursor-pointer flex-col gap-2 rounded-xl ring-primary ring-offset-4 focus-visible:outline-0 focus-visible:ring-2 @md:rounded-2xl"
        href={href}
        id={id}
      >
        <div className="bg-contrast-100 relative aspect-[5/6] overflow-hidden rounded-[inherit]">
          {image?.src != null ? (
            <BcImage
              alt="Category card image"
              className="bg-contrast-100 w-full scale-100 select-none object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              fill
              sizes="(max-width: 768px) 70vw, 33vw"
              src={image.src}
            />
          ) : (
            <div className="text-contrast-300 pl-2 pt-3 text-7xl font-bold leading-[0.8] tracking-tighter transition-transform duration-500 ease-out group-hover:scale-105">
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

      <div className="mt-2 flex flex-col items-start gap-x-4 gap-y-3 px-1 @xs:mt-3 @2xl:flex-row">
        <div className="flex-1">
          <Link className="group text-base" href={href} tabIndex={-1}>
            <span className="block font-semibold">{title}</span>

            {subtitle != null && subtitle !== '' && (
              <span className="text-contrast-400 mb-2 block text-sm font-normal">{subtitle}</span>
            )}
            {price != null && <PriceLabel price={price} />}
          </Link>
        </div>

        {showCompare && (
          <div className="mt-0.5 shrink-0">
            <Compare label={compareLabel} paramName={compareParamName} productId={id} />
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardSkeletonProps {
  className?: string;
}

export const ProductCardSkeleton = function ProductCardSkeleton({
  className,
}: ProductCardSkeletonProps) {
  return (
    <div className={clsx('animate-pulse cursor-pointer rounded-xl @md:rounded-2xl', className)}>
      {/* Image */}
      <div className="bg-contrast-100 relative aspect-[5/6] overflow-hidden rounded-xl @6xl:min-w-80" />
      <div className="flex justify-between gap-2 pt-4 @sm:gap-2 @sm:pt-7">
        <h3 className="flex flex-col flex-wrap justify-between gap-2 @sm:gap-2 @4xl:flex-row">
          {/* Name */}
          <div className="bg-contrast-100 h-4 w-24 rounded-lg" />
          {/* Subtitle */}
          <div className="bg-contrast-100 h-4 w-20 rounded-lg" />
        </h3>
        {/* Price */}
        <div className="bg-contrast-100 h-4 w-16 rounded-lg @4xl:h-6" />
      </div>
    </div>
  );
};
