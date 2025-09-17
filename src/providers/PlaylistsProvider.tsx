import { ReactNode, useState } from 'react';
import { PlaylistsContext, PlaylistType, LinkType } from 'src/contexts/PlaylistsContext';

export const PlaylistsProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<{ [type: string]: PlaylistType[] }>({});
  const [links, setLinks] = useState< { [type: string]: LinkType[]}>({});
  const [lastLoaded, setLastLoadedState] = useState<{ [type: string]: string }>({});

  // Setter for lastLoaded by type
  const setLastLoaded = (type: string, date: string) => {
    setLastLoadedState(prev => ({ ...prev, [type]: date }));
  };

  return (
    <PlaylistsContext.Provider
      value={{
        playlists,
        setPlaylists,
        links,
        setLinks,
        lastLoaded,
        setLastLoaded
      }}
    >
      {children}
    </PlaylistsContext.Provider>
  );
};
