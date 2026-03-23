// import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { createContext, useContext } from 'react';

export type TopicType = {
  _id: string;
  title: string;
};

export type LinkType = {
  _id: string;
  isResource?: boolean;
  author?: string;
  title: string;
  description?: string | null;
  size?: number;
  keyWords?: string[] | null;
  playlistId?: string; // extracted by keyWords[0] matching a playlist title
  playlistType?: string; // type extracted from the matched playlist
  topics?: TopicType[] | null;
  path: string;
};

export type PlaylistType = {
  _id: string;
  // isResource: boolean;
  type?: string;
  author?: string;
  title?: string;
  // keyWords?: string[] | null;
  image?: SanityImageSource | null;
  imageUrl?: string | null;
  items?: LinkType[];
};

export type SeminarRelatedPresentationsType = {
  _id: string;
  title: string;
};

export type PlaylistsMap = { [type: string]: PlaylistType[] };
export type LinksMap = { [type: string]: LinkType[] };

export type PlaylistsContextType = {
  playlists: PlaylistsMap;
  setPlaylists: (type: string, playlists: PlaylistType[]) => void;
  links: LinksMap;
  setLinks: (type: string, links: LinkType[]) => void;
  seminarRelatedPresentations: SeminarRelatedPresentationsType[];
  setSeminarRelatedPresentations: (
    presentations: SeminarRelatedPresentationsType[]
  ) => void;
  lastLoaded: { [type: string]: string };
  setLastLoaded: (type: string, date: string) => void;
};

export const PlaylistsContext = createContext<PlaylistsContextType>({
  playlists: {},
  setPlaylists: () => {},
  links: {},
  setLinks: () => {},
  seminarRelatedPresentations: [],
  setSeminarRelatedPresentations: () => {},
  lastLoaded: {},
  setLastLoaded: () => {}
});

export function usePlaylistsContext() {
  const context = useContext(PlaylistsContext);

  return context;
}
