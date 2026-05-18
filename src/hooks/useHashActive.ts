import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Animate icon when hash matches a playlist item
const useHashActive = (delayMs = 1100, activeMs = 5000) => {
  const { hash } = useLocation();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!hash) return;
    const targetHashId = hash.replace('#', '');
    setActiveId(null);
    let resetTimeout: number;
    const delay = window.setTimeout(() => {
      setActiveId(targetHashId);
      resetTimeout = window.setTimeout(() => setActiveId(null), activeMs);
    }, delayMs);
    return () => {
      clearTimeout(delay);
      clearTimeout(resetTimeout);
    };
  }, [hash, delayMs, activeMs]);

  return activeId;
};

export default useHashActive;
