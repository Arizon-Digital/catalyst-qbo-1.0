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
  isDesktop: boolean;
  maxDesktopCards: number;
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
  maxDesktopCards = 5,
  ...rest
}: CarouselProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);

  // Check if we're on desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => {
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);

  // Carousel options
  const defaultOpts = {
    align: 'start',
    loop: false,
    skipSnaps: false,
    draggable: true
  };

  // Merge user options with our default options
  const mergedOpts = { ...defaultOpts, ...opts };
  
  const [carouselRef, api] = useEmblaCarousel(mergedOpts, plugins);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Get total number of slides
  useEffect(() => {
    if (!api) return;
    
    const slides = api.slideNodes();
    setTotalSlides(slides.length);
    
    // Disable scrolling on desktop if fewer slides than maxDesktopCards
    if (isDesktop && slides.length <= maxDesktopCards) {
      api.reInit({
        ...mergedOpts,
        draggable: false,
      });
    }
  }, [api, isDesktop, maxDesktopCards, mergedOpts]);

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

  // Only show navigation on mobile or if more than maxDesktopCards on desktop
  const shouldShowNavigation = !isDesktop || (isDesktop && totalSlides > maxDesktopCards);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        scrollPrev,
        scrollNext,
        canScrollPrev: shouldShowNavigation && canScrollPrev,
        canScrollNext: shouldShowNavigation && canScrollNext,
        isDesktop,
        maxDesktopCards,
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

function CarouselContent({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { carouselRef, isDesktop } = useCarousel();
  
  return (
    <div className="w-full overflow-hidden" ref={carouselRef}>
      <div 
        {...rest} 
        className={clsx(
          // Mobile: Always use grid with 2 columns
          'grid grid-cols-2 gap-2',
          // Desktop: Switch to flex layout with proper item widths
          isDesktop && 'lg:grid-cols-5 lg:gap-4',
          className
        )} 
      />
    </div>
  );
}

function CarouselItem({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { isDesktop } = useCarousel();
  
  return (
    <div
      {...rest}
      className={clsx(
        // Desktop specific sizing
        isDesktop && 'lg:col-span-1',
        className
      )}
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
  const { canScrollPrev, canScrollNext } = useCarousel();
  
  return (
    <div className="flex items-center justify-between mb-2" {...props}>
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      {(canScrollPrev || canScrollNext) && <CarouselControls />}
    </div>
  );
}

// Let's add a media query helper component for direct CSS control
function ResponsiveCarouselStyle() {
  return (
    <style jsx global>{`
      /* Mobile: 2 cards layout */
      .carousel-content {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      
      /* Desktop: 5 cards layout */
      @media (min-width: 1024px) {
        .carousel-content {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
      }
    `}</style>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselControls,
  CarouselHeader,
  ResponsiveCarouselStyle,
};