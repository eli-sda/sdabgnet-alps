import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { createContext, useContext } from 'react';

export type PlaylistItemType = {
  _id: string;
  isResource?: boolean;
  author?: string;
  title: string;
  description?: string;
  size?: number;
  keyWords?: string[];
  path: string;
};

export type PlaylistType = {
  _id: string;
  isResource: boolean;
  type?: string;
  author?: string;
  title: string;
  keyWords?: string[];
  image?: SanityImageSource | null;
  items?: PlaylistItemType[];
};

export type PlaylistsContextType = {
  playlists: PlaylistType[] | undefined;
  setPlaylists: (playlists: PlaylistType[]) => void;
  lastLoaded: string | undefined;
  setLastLoaded: (date: string) => void;
};

export const PlaylistsContext = createContext<PlaylistsContextType>({
  playlists: undefined,
  setPlaylists: () => {},
  lastLoaded: undefined,
  setLastLoaded: () => {}
});

export function usePlaylistsContext() {
  const context = useContext(PlaylistsContext);

  return context;
}
