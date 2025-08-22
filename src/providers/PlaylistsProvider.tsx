import { ReactNode, useState } from 'react';
import { PlaylistsContext, PlaylistType } from 'src/contexts/PlaylistsContext';

export const PlaylistsProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<PlaylistType[]>();
  const [lastLoaded, setLastLoaded] = useState<string>();

  return (
    <PlaylistsContext.Provider
      value={{
        playlists,
        setPlaylists,
        lastLoaded,
        setLastLoaded
      }}
    >
      {children}
    </PlaylistsContext.Provider>
  );
};
