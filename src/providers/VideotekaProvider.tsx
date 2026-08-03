import { ReactNode, useCallback, useMemo, useState } from 'react';
import { TopicType } from 'src/contexts/PlaylistsContext';
import {
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
      setLastPlaylistSearch
    }),
    [
      videoTopics, setVideoTopics,
      playlistTopics, setPlaylistTopics,
      videoAuthors, setVideoAuthors,
      playlistAuthors, setPlaylistAuthors,
      lastLoaded, updateLastLoaded,
      lastVideoSearch, setLastVideoSearch,
      lastPlaylistSearch, setLastPlaylistSearch
    ]
  );

  return (
    <VideotekaContext.Provider value={value}>
      {children}
    </VideotekaContext.Provider>
  );
};
