import { ReactNode, useCallback, useMemo, useState } from 'react';
import { LinkType, TopicType } from 'src/contexts/PlaylistsContext';
import {
  CachedPlaylistItem,
  CachedPlaylistSearch,
  CachedVideoSearch,
  VideotekaContext
} from 'src/contexts/VideotekaContext';

export const VideotekaProvider = ({ children }: { children: ReactNode }) => {
  const [videoTopics, setVideoTopics] = useState<TopicType[]>([]);
  const [playlistTopics, setPlaylistTopics] = useState<TopicType[]>([]);
  const [videoAuthors, setVideoAuthors] = useState<string[]>([]);
  const [playlistAuthors, setPlaylistAuthors] = useState<string[]>([]);
  const [lastLoaded, setLastLoaded] = useState<{ [key: string]: string }>({});
  const [lastVideoSearch, setLastVideoSearch] = useState<CachedVideoSearch | null>(null);
  const [lastPlaylistSearch, setLastPlaylistSearch] = useState<CachedPlaylistSearch | null>(null);
  // Full documents survive leaving Videoteka; only the index is in state above.
  const [videoCache] = useState<Map<string, LinkType>>(() => new Map());
  const [playlistCache] = useState<Map<string, CachedPlaylistItem>>(
    () => new Map()
  );

  const updateLastLoaded = useCallback((key: string, date: string) => {
    setLastLoaded((prev) => ({ ...prev, [key]: date }));
  }, [setLastLoaded]);

  const value = useMemo(
    () => ({
      videoTopics,
      setVideoTopics,
      playlistTopics,
      setPlaylistTopics,
      videoAuthors,
      setVideoAuthors,
      playlistAuthors,
      setPlaylistAuthors,
      lastLoaded,
      setLastLoaded: updateLastLoaded,
      lastVideoSearch,
      setLastVideoSearch,
      lastPlaylistSearch,
      setLastPlaylistSearch,
      videoCache,
      playlistCache
    }),
    [
      videoTopics, setVideoTopics,
      playlistTopics, setPlaylistTopics,
      videoAuthors, setVideoAuthors,
      playlistAuthors, setPlaylistAuthors,
      lastLoaded, updateLastLoaded,
      lastVideoSearch, setLastVideoSearch,
      lastPlaylistSearch, setLastPlaylistSearch,
      videoCache, playlistCache
    ]
  );

  return (
    <VideotekaContext.Provider value={value}>
      {children}
    </VideotekaContext.Provider>
  );
};
