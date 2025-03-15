


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
  carouselScrollbarLabel?: string;
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
  maxDesktopCards?: number;
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
  // Set up responsive options for the carousel
  const defaultOpts = {
    // Default behavior for mobile
    dragFree: true,
    containScroll: 'trimSnaps',
    
    // Add breakpoints for different screen sizes
    breakpoints: {
      // For medium screens and larger, disable dragging if we have 5 or fewer slides
      '(min-width: 768px)': {
        dragFree: false,
      },
      // For desktop, completely disable dragging - we'll handle layout with CSS
      '(min-width: 1024px)': {
        dragFree: false,
        draggable: false
      }
    }
  };

  // Merge user options with our default options
  const mergedOpts = { ...defaultOpts, ...opts };
  
  const [carouselRef, api] = useEmblaCarousel(mergedOpts, plugins);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop and should disable scrolling
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

  // Get the total number of slides and disable scrolling if needed
  useEffect(() => {
    if (!api) return;
    
    const slides = api.slideNodes();
    setTotalSlides(slides.length);
    
    if (isDesktop && slides.length <= maxDesktopCards) {
      // Disable scrolling on desktop for 5 or fewer cards
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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

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

  // Determine if we should show navigation on desktop
  const shouldShowNavigation = !isDesktop || totalSlides > maxDesktopCards;

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
        maxDesktopCards,
      }}
    >
      <div
        {...rest}
        aria-roledescription="carousel"
        className={clsx('relative @container', hideOverflow && 'overflow-hidden', className)}
        onKeyDownCapture={handleKeyDown}
        role="region"
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { carouselRef, maxDesktopCards } = useCarousel();
  
  return (
    <div className="w-full" ref={carouselRef}>
      <div 
        {...rest} 
        className={clsx(
          '-ml-4 flex @2xl:-ml-5',
          // Keep the flex layout for horizontal display with fixed spacing
          '@[1024px]:flex @[1024px]:justify-between @[1024px]:gap-1 @[1024px]:mx-auto @[1024px]:px-0',
          className
        )} 
      />
    </div>
  );
}

function CarouselItem({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { maxDesktopCards } = useCarousel();
  
  return (
    <div
      {...rest}
      aria-roledescription="slide"
      className={clsx(
        'min-w-0 shrink-0 grow-0 pl-4 @2xl:pl-5',
        // On desktop, each item takes equal width with proper spacing
        '@[1024px]:w-1/5 @[1024px]:max-w-[19%] @[1024px]:pl-0 @[1024px]:mx-0',
        className
      )}
      role="group"
    />
  );
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
    --carousel-focus: hsl(var(--primary));
    --carousel-light-button: hsl(var(--foreground));
    --carousel-dark-button: hsl(var(--background));
 * }
 * ```
 */
function CarouselButtons({
  className,
  colorScheme = 'light',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  colorScheme?: 'light' | 'dark';
  previousLabel?: string;
  nextLabel?: string;
}) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  // If we can't scroll in either direction (fewer than maxDesktopCards on desktop),
  // don't show the navigation buttons
  if (!canScrollPrev && !canScrollNext) {
    return null;
  }

  return (
    <div
      {...rest}
      className={clsx(
        'flex gap-2',
        {
          light: 'text-[var(--carousel-light-button,hsl(var(--foreground)))]',
          dark: 'text-[var(--carousel-dark-button,hsl(var(--background)))]',
        }[colorScheme],
        className,
      )}
    >
      <button
        className="rounded-lg ring-[var(--carousel-focus,hsl(var(--primary)))] transition-colors duration-300 focus-visible:outline-0 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-25"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        title={previousLabel}
      >
        <ArrowLeft strokeWidth={1.5} />
      </button>
      <button
        className="rounded-lg ring-[var(--carousel-focus,hsl(var(--primary)))] transition-colors duration-300 focus-visible:outline-0 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-25"
        disabled={!canScrollNext}
        onClick={scrollNext}
        title={nextLabel}
      >
        <ArrowRight strokeWidth={1.5} />
      </button>
    </div>
  );
}

/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
    --carousel-light-scrollbar: hsl(var(--foreground));
    --carousel-dark-scrollbar: hsl(var(--background));
 * }
 * ```
 */
function CarouselScrollbar({
  className,
  colorScheme = 'light',
  label = 'Carousel scrollbar',
}: React.HTMLAttributes<HTMLDivElement> & { label?: string; colorScheme?: 'light' | 'dark' }) {
  const { api, canScrollPrev, canScrollNext } = useCarousel();
  const [progress, setProgress] = useState(0);
  const [scrollbarPosition, setScrollbarPosition] = useState({ width: 0, left: 0 });

  // If we can't scroll (on desktop with 5 or fewer cards), don't show the scrollbar
  if (!canScrollPrev && !canScrollNext) {
    return null;
  }

  const findClosestSnap = useCallback(
    (nextProgress: number) => {
      if (!api) return 0;

      const point = nextProgress / 100;
      const snapList = api.scrollSnapList();

      if (snapList.length === 0) return -1;

      const closestSnap = snapList.reduce((prev, curr) =>
        Math.abs(curr - point) < Math.abs(prev - point) ? curr : prev,
      );

      return snapList.findIndex((snap) => snap === closestSnap);
    },
    [api],
  );

  useEffect(() => {
    if (!api) return;

    const snapList = api.scrollSnapList();
    const closestSnapIndex = findClosestSnap(progress);
    const scrollbarWidth = 100 / snapList.length;
    const scrollbarLeft = (closestSnapIndex / snapList.length) * 100;

    setScrollbarPosition({ width: scrollbarWidth, left: scrollbarLeft });

    api.scrollTo(closestSnapIndex);
  }, [progress, api, findClosestSnap]);

  useEffect(() => {
    if (!api) return;

    function onScroll() {
      if (!api) return;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setProgress(api.scrollSnapList()[api.selectedScrollSnap()]! * 100);
    }

    api.on('select', onScroll);
    api.on('scroll', onScroll);
    api.on('reInit', onScroll);

    return () => {
      api.off('select', onScroll);
      api.off('scroll', onScroll);
      api.off('reInit', onScroll);
    };
  }, [api]);

  return (
    <div
      className={clsx(
        'relative flex h-6 w-full max-w-56 items-center overflow-hidden',
        !canScrollPrev && !canScrollNext && 'pointer-events-none invisible',
        className,
      )}
    >
      <input
        aria-label={label}
        aria-orientation="horizontal"
        aria-valuenow={progress}
        aria-valuetext={`${Math.round(progress)}%`}
        className="absolute h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
        max={100}
        min={0}
        onChange={(e) => setProgress(e.currentTarget.valueAsNumber)}
        type="range"
        value={progress}
      />
      {/* Track */}
      <div
        className={clsx(
          'pointer-events-none absolute h-1 w-full rounded-full opacity-10',
          {
            light: 'bg-[var(--carousel-light-scrollbar,hsl(var(--foreground)))]',
            dark: 'bg-[var(--carousel-dark-scrollbar,hsl(var(--background)))]',
          }[colorScheme],
        )}
      />

      {/* Bar */}
      <div
        className={clsx(
          'pointer-events-none absolute h-1 rounded-full transition-all ease-out',
          {
            light: 'bg-[var(--carousel-light-scrollbar,hsl(var(--foreground)))]',
            dark: 'bg-[var(--carousel-dark-scrollbar,hsl(var(--background)))]',
          }[colorScheme],
        )}
        style={{
          width: `${scrollbarPosition.width}%`,
          left: `${scrollbarPosition.left}%`,
        }}
      />
    </div>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselButtons,
  CarouselScrollbar,
};