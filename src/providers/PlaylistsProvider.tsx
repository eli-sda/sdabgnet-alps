import { ReactNode, useCallback, useState } from 'react';
import {
  PlaylistsContext,
  PlaylistType,
  LinkType,
  SeminarRelatedPresentationsType
} from 'src/contexts/PlaylistsContext';

export const PlaylistsProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylistsState] = useState<{
    [type: string]: PlaylistType[];
  }>({});
  const [links, setLinksState] = useState<{ [type: string]: LinkType[] }>({});
  const [lastLoaded, setLastLoadedState] = useState<{ [type: string]: string }>(
    {}
  );
  const [seminarRelatedPresentations, setSeminarRelatedPresentations] =
    useState<SeminarRelatedPresentationsType[]>([]);

  // Setter for playlists by cacheKey
  const setPlaylists = useCallback(
    (cacheKey: string, playlistsData: PlaylistType[]) => {
      setPlaylistsState((prev) => ({ ...prev, [cacheKey]: playlistsData }));
    },
    []
  );

  // Setter for links by cacheKey
  const setLinks = useCallback((cacheKey: string, linksData: LinkType[]) => {
    setLinksState((prev) => ({ ...prev, [cacheKey]: linksData }));
  }, []);

  // Setter for lastLoaded by cacheKey
  const setLastLoaded = useCallback((cacheKey: string, date: string) => {
    setLastLoadedState((prev) => ({ ...prev, [cacheKey]: date }));
  }, []);

  return (
    <PlaylistsContext.Provider
      value={{
        playlists,
        setPlaylists,
        links,
        setLinks,
        seminarRelatedPresentations,
        setSeminarRelatedPresentations,
        lastLoaded,
        setLastLoaded
      }}
    >
      {children}
    </PlaylistsContext.Provider>
  );
};
