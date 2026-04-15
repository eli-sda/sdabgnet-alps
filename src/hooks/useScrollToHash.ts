import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    // Remove the # from the hash
    const elementId = hash.replace('#', '');

    // Smooth scroll when DOM is ready
    const scrollToElement = () => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    setTimeout(() => {
      requestAnimationFrame(scrollToElement);
    }, 1000); // wait 1 second before scrolling to allow DOM to render (e.g., accordions to open)
  }, [hash]);

  return hash;
};
