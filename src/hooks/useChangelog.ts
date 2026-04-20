import { useEffect, useState } from 'react';

export interface ChangelogEntry {
  id: string;
  date: string;
  title: string;
  changes: { type: 'fix' | 'feature' | 'improvement'; text: string }[];
}

const STORAGE_KEY = 'lastSeenChangelog';

export const useChangelog = () => {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  const checkUnread = (data: ChangelogEntry[]) => {
    const latest = data[0]?.date;
    const lastSeen = localStorage.getItem(STORAGE_KEY);
    setHasUnread(!!latest && latest > (lastSeen ?? ''));
  };

  useEffect(() => {
    fetch('/json/changelog.json')
      .then((r) => r.json())
      .then((data: ChangelogEntry[]) => {
        setEntries(data);
        checkUnread(data);
      })
      .catch(() => {});
  }, []);

  // Re-check when another instance calls markAsSeen (writes to localStorage)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setEntries((current) => {
          checkUnread(current);
          return current;
        });
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const markAsSeen = () => {
    if (entries[0]?.date) {
      localStorage.setItem(STORAGE_KEY, entries[0].date);
      setHasUnread(false);
      // Notify other hook instances in the same tab via a synthetic storage event
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    }
  };

  return { entries, hasUnread, markAsSeen };
};
