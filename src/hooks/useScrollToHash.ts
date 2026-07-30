import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type UseScrollToHashOptions = {
  enabled?: boolean;
  delayMs?: number;
};

export const useScrollToHash = ({
  enabled = true,
  delayMs = 0
}: UseScrollToHashOptions = {}) => {
  const { hash } = useLocation();
  const lastScrolledHashRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hash) {
      lastScrolledHashRef.current = null;
      return;
    }

    if (!enabled) return;
    if (lastScrolledHashRef.current === hash) return;

    // Remove the # from the hash
    const elementId = hash.replace('#', '');
    let rafId: number | null = null;

    // Smooth scroll when DOM is ready
    const scrollToElement = () => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        lastScrolledHashRef.current = hash;
      }
    };

    const timeoutId = window.setTimeout(() => {
      rafId = window.requestAnimationFrame(scrollToElement);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [hash, enabled, delayMs]);

  return hash;
};
