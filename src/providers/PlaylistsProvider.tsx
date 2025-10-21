import { ReactNode, useState } from 'react';
import {
  PlaylistsContext,
  PlaylistType,
  LinkType,
  SeminarRelatedPresentationsType
} from 'src/contexts/PlaylistsContext';

export const PlaylistsProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<{
    [type: string]: PlaylistType[];
  }>({});
  const [links, setLinks] = useState<{ [type: string]: LinkType[] }>({});
  const [lastLoaded, setLastLoadedState] = useState<{ [type: string]: string }>(
    {}
  );
  const [seminarRelatedPresentations, setSeminarRelatedPresentations] =
    useState<SeminarRelatedPresentationsType[]>([]);

  // Setter for lastLoaded by type
  const setLastLoaded = (type: string, date: string) => {
    setLastLoadedState((prev) => ({ ...prev, [type]: date }));
  };

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
