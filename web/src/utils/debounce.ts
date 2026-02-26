// src/utils/debounce.ts

/**
 * Versi yang lebih bersih tanpa 'any' eksplisit dan alias 'this' yang tidak perlu.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, wait);
  };
}