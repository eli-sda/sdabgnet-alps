import { useEffect, useState } from 'react';

const STORAGE_KEY = 'welcomeDialogSeen';

export const useWelcomeDialog = () => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(true); // Default true to avoid flash

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    setHasSeenWelcome(seen === 'true');
  }, []);

  // Sync when another tab/instance calls markAsSeen
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setHasSeenWelcome(localStorage.getItem(STORAGE_KEY) === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const markAsSeen = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setHasSeenWelcome(true);
    // Notify other hook instances in the same tab
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  };

  return { hasSeenWelcome, markAsSeen };
};
