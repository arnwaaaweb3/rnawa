import {
  forwardRef,
  useMemo,
  useRef,
  useEffect,
  CSSProperties,
  RefObject,
} from 'react';
import { motion } from 'motion/react';
import '../styles/VariableProximity.module.css';

/* =======================
   TYPES
======================= */

type FalloffType = 'linear' | 'exponential' | 'gaussian';

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef?: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: FalloffType;

  // ✅ Explicit DOM Props
  className?: string;
  style?: CSSProperties;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  id?: string;
  title?: string;
  role?: string;
  tabIndex?: number;
  onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
  onFocus?: React.FocusEventHandler<HTMLSpanElement>;
  onBlur?: React.FocusEventHandler<HTMLSpanElement>;
}

/* =======================
   HOOK: useAnimationFrame
======================= */

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId: number;

    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

/* =======================
   HOOK: useMousePositionRef
======================= */

function useMousePositionRef(containerRef?: RefObject<HTMLElement | null>) {
  const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => {
      updatePosition(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

/* =======================
   COMPONENT
======================= */

const VariableProximity = forwardRef<
  HTMLSpanElement,
  VariableProximityProps
>(
  (
    {
      label,
      fromFontVariationSettings,
      toFontVariationSettings,
      containerRef,
      radius = 50,
      falloff = 'linear',

      className,
      style,
      onClick,
      id,
      title,
      role,
      tabIndex,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const interpolatedSettingsRef = useRef<string[]>([]);
    const mousePositionRef = useMousePositionRef(containerRef);
    const lastPositionRef = useRef<{ x: number | null; y: number | null }>({
      x: null,
      y: null,
    });

    /* =======================
       PARSE FONT SETTINGS
    ======================= */

    const parsedSettings = useMemo(() => {
      const parseSettings = (settingsStr: string) =>
        new Map<string, number>(
          settingsStr
            .split(',')
            .map(s => s.trim())
            .map(s => {
              const [name, value] = s.split(' ');
              return [name.replace(/['"]/g, ''), parseFloat(value)];
            })
        );

      const fromSettings = parseSettings(fromFontVariationSettings);
      const toSettings = parseSettings(toFontVariationSettings);

      return Array.from(fromSettings.entries()).map(
        ([axis, fromValue]) => ({
          axis,
          fromValue,
          toValue: toSettings.get(axis) ?? fromValue,
        })
      );
    }, [fromFontVariationSettings, toFontVariationSettings]);

    /* =======================
       MATH HELPERS
    ======================= */

    const calculateDistance = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    const calculateFalloff = (distance: number) => {
      const norm = Math.min(Math.max(1 - distance / radius, 0), 1);

      switch (falloff) {
        case 'exponential':
          return norm ** 2;
        case 'gaussian':
          return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
        case 'linear':
        default:
          return norm;
      }
    };

    /* =======================
       ANIMATION LOOP
    ======================= */

    useAnimationFrame(() => {
      if (!containerRef?.current) return;

      const containerRect =
        containerRef.current.getBoundingClientRect();
      const { x, y } = mousePositionRef.current;

      if (
        lastPositionRef.current.x === x &&
        lastPositionRef.current.y === y
      )
        return;

      lastPositionRef.current = { x, y };

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) return;

        const rect = letterRef.getBoundingClientRect();
        const letterCenterX =
          rect.left + rect.width / 2 - containerRect.left;
        const letterCenterY =
          rect.top + rect.height / 2 - containerRect.top;

        const distance = calculateDistance(
          x,
          y,
          letterCenterX,
          letterCenterY
        );

        if (distance >= radius) {
          letterRef.style.fontVariationSettings =
            fromFontVariationSettings;
          return;
        }

        const falloffValue = calculateFalloff(distance);

        const newSettings = parsedSettings
          .map(({ axis, fromValue, toValue }) => {
            const interpolatedValue =
              fromValue + (toValue - fromValue) * falloffValue;
            return `'${axis}' ${interpolatedValue}`;
          })
          .join(', ');

        interpolatedSettingsRef.current[index] = newSettings;
        letterRef.style.fontVariationSettings = newSettings;
      });
    });

    /* =======================
       RENDER
    ======================= */

    const words = label.split(' ');
    let letterIndex = 0;

    return (
      <span
        ref={ref}
        id={id}
        title={title}
        role={role}
        tabIndex={tabIndex}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`${className ?? ''} variable-proximity`.trim()}
        style={{ display: 'inline', ...style }}
      >
        {words.map((word: string, wordIndex: number) => (
          <span
            key={wordIndex}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {word.split('').map((letter: string) => {
              const currentLetterIndex = letterIndex++;
              return (
                <motion.span
                  key={currentLetterIndex}
                  ref={el => {
                    letterRefs.current[currentLetterIndex] = el;
                  }}
                  style={{
                    display: 'inline-block',
                    fontVariationSettings:
                      interpolatedSettingsRef.current[
                        currentLetterIndex
                      ],
                  }}
                  aria-hidden="true"
                >
                  {letter}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span style={{ display: 'inline-block' }}>
                &nbsp;
              </span>
            )}
          </span>
        ))}
      </span>
    );
  }
);

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
