import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

type UseScrollToHashOptions = {
  enabled?: boolean;
  delayMs?: number;
};

export const useScrollToHash = ({
  enabled = true,
  delayMs = 0
}: UseScrollToHashOptions = {}) => {
  const { hash } = useLocation();
  const navType = useNavigationType();
  const lastScrolledHashRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hash) {
      lastScrolledHashRef.current = null;
      return;
    }

    if (!enabled) return;
    if (lastScrolledHashRef.current === hash) return;

    const elementId = hash.replace('#', '');
    let raf1: number | null = null;
    let raf2: number | null = null;

    // delay slightly more for internal navigations so layout can settle
    const extraDelay = String(navType) !== 'POP' ? 300 : 0;
    const finalDelay = Math.max(0, delayMs + extraDelay);

    const scrollToElement = () => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        lastScrolledHashRef.current = hash;
      }
    };

    const timeoutId = window.setTimeout(() => {
      raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(scrollToElement);
      });
    }, finalDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (raf1 !== null) window.cancelAnimationFrame(raf1);
      if (raf2 !== null) window.cancelAnimationFrame(raf2);
    };
  }, [hash, enabled, delayMs, navType]);

  return hash;
};
