import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

const ToastContext = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number>();

  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-28 z-[5] flex justify-center px-4 transition-opacity duration-200 ${msg ? 'opacity-100' : 'opacity-0'}`}
      >
        {msg && (
          <div className="prose-label-one-normal-medium rounded-xl bg-semantic-inverse-background px-4 py-3 text-semantic-inverse-label shadow-lg">
            {msg}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
