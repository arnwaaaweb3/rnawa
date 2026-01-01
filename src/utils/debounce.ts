// src/utils/debounce.ts

// Tipe generik untuk fungsi yang akan di-debounce
type DebounceFunction<T extends (...args: any[]) => void> = (
  this: ThisParameterType<T>, 
  ...args: Parameters<T>
) => void;

/**
 * Mengembalikan fungsi baru yang akan menunda eksekusi
 * sampai setelah 'wait' milidetik telah berlalu sejak
 * panggilan terakhir.
 * @param func Fungsi yang akan di-debounce.
 * @param wait Waktu tunda dalam milidetik.
 * @returns Fungsi yang di-debounce.
 */
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): DebounceFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  } as DebounceFunction<T>;
}