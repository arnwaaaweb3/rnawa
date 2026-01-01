// src/components/ui/Carousel.tsx
'use client';

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from './Carousel.module.css';
import { Button } from "./Button"; 

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

// ====================================================================
// CONTEXT
// ====================================================================

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

// ====================================================================
// CAROUSEL MAIN
// ====================================================================

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    // Keyboard navigation logic
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    // Set API reference
    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    // Listen for select event
    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={`${styles.carousel} ${className || ''}`}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

// ====================================================================
// CAROUSEL CONTENT
// ====================================================================

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  // 💡 SOLUSI: Kumpulkan class ke dalam array dan filter untuk bersih
  const classList = [
    styles.carouselContent, 
    orientation === "horizontal" ? styles.horizontal : styles.vertical, 
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={carouselRef} className={styles.overflowHidden}>
      <div
        ref={ref}
        // 🚨 GANTI BARIS INI DENGAN classList
        // className={`${styles.carouselContent} ${orientation === "horizontal" ? styles.horizontal : styles.vertical} ${className || ''}`}
        className={classList} // Menggunakan string yang sudah bersih
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

// ====================================================================
// CAROUSEL ITEM
// ====================================================================

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={`${styles.carouselItem} ${orientation === "horizontal" ? styles.itemHorizontal : styles.itemVertical} ${className || ''}`}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

// ====================================================================
// CAROUSEL PREVIOUS/NEXT BUTTONS
// ====================================================================

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", children, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={`${styles.carouselPrevious} ${orientation === "horizontal" ? styles.prevHorizontal : styles.prevVertical} ${className || ''}`}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      {/* 🚨 BEFORE: <ArrowLeft className="h-4 w-4" /> */}
      <FaChevronLeft size={16} /> 
      {children || <span className={styles.srOnly}>Previous slide</span>}
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", children, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={`${styles.carouselNext} ${orientation === "horizontal" ? styles.nextHorizontal : styles.nextVertical} ${className || ''}`}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      {/* 🚨 BEFORE: <ArrowRight className="h-4 w-4" /> */}
      <FaChevronRight size={16} />
      {children || <span className={styles.srOnly}>Next slide</span>}
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};