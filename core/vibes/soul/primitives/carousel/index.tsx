/* eslint-disable valid-jsdoc */
'use client';

import { clsx } from 'clsx';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface CarouselProps extends React.ComponentPropsWithoutRef<'div'> {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  setApi?: (api: CarouselApi) => void;
  hideOverflow?: boolean;
  maxDesktopCards?: number;
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

function Carousel({
  opts,
  setApi,
  plugins,
  className,
  children,
  hideOverflow = true,
  ...rest
}: CarouselProps) {
  // Simplify options to bare minimum
  const defaultOpts = {
    align: 'start',
    loop: false,
    skipSnaps: false,
    draggable: true,
    // Important: ensures proper grid layout
    breakpoints: {
      '(min-width: 768px)': {
        enabled: false
      }
    }
  };

  // Merge user options with our default options
  const mergedOpts = { ...defaultOpts, ...opts };
  
  const [carouselRef, api] = useEmblaCarousel(mergedOpts, plugins);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        {...rest}
        className={clsx('relative', className)}
        role="region"
        aria-roledescription="carousel"
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

// Using a grid approach instead of flex for better control
function CarouselContent({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { carouselRef } = useCarousel();
  
  return (
    <div className="w-full overflow-hidden" ref={carouselRef}>
      <div 
        {...rest} 
        className={clsx(
          'grid grid-cols-2 gap-2',
          className
        )} 
      />
    </div>
  );
}

function CarouselItem({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={clsx(className)}
      role="group"
      aria-roledescription="slide"
    />
  );
}

function CarouselControls({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  if (!canScrollPrev && !canScrollNext) {
    return null;
  }

  return (
    <div className={clsx('flex items-center justify-end gap-1 mt-2', className)} {...props}>
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={clsx(
          'flex items-center justify-center w-6 h-6 rounded border',
          !canScrollPrev && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Previous slide"
      >
        <ArrowLeft size={14} />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={clsx(
          'flex items-center justify-center w-6 h-6 rounded border',
          !canScrollNext && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Next slide"
      >
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

function CarouselHeader({ title, ...props }: React.HTMLAttributes<HTMLDivElement> & { title?: string }) {
  return (
    <div className="flex items-center justify-between mb-2" {...props}>
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      <CarouselControls />
    </div>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselControls,
  CarouselHeader,
};