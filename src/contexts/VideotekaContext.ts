import { createContext, useContext } from 'react';
import { LinkType, PlaylistType, TopicType } from './PlaylistsContext';

/** Lightweight row used to sort/paginate videoteka results. */
export type VideoIndexItem = {
  _id: string;
  title: string;
  playlistId?: string | null;
  playlistName?: string | null;
};

/** Lightweight row used to sort/paginate videoteka playlists. */
export type PlaylistIndexItem = {
  _id: string;
  title: string;
  kind: 'embedded' | 'yt';
};

export type CachedVideoSearch = {
  topicTitle: string;
  author: string;
  text: string;
  index: VideoIndexItem[];
};

export type CachedPlaylistSearch = {
  topicTitle: string;
  author: string;
  text: string;
  index: PlaylistIndexItem[];
};

/** Full playlist document, kept across page navigations. */
export type CachedPlaylistItem =
  | { kind: 'embedded'; playlist: PlaylistType }
  | { kind: 'yt'; link: LinkType };

export type VideotekaContextType = {
  videoTopics: TopicType[];
  setVideoTopics: (topics: TopicType[]) => void;
  playlistTopics: TopicType[];
  setPlaylistTopics: (topics: TopicType[]) => void;
  videoAuthors: string[];
  setVideoAuthors: (authors: string[]) => void;
  playlistAuthors: string[];
  setPlaylistAuthors: (authors: string[]) => void;
  lastLoaded: { [key: string]: string };
  setLastLoaded: (key: string, date: string) => void;
  lastVideoSearch: CachedVideoSearch | null;
  setLastVideoSearch: (s: CachedVideoSearch) => void;
  lastPlaylistSearch: CachedPlaylistSearch | null;
  setLastPlaylistSearch: (s: CachedPlaylistSearch) => void;
  /** Full video documents by id, shared across Videoteka visits. */
  videoCache: Map<string, LinkType>;
  /** Full playlist documents by `kind:id`, shared across Videoteka visits. */
  playlistCache: Map<string, CachedPlaylistItem>;
};

export const VideotekaContext = createContext<VideotekaContextType>({
  videoTopics: [],
  setVideoTopics: () => {},
  playlistTopics: [],
  setPlaylistTopics: () => {},
  videoAuthors: [],
  setVideoAuthors: () => {},
  playlistAuthors: [],
  setPlaylistAuthors: () => {},
  lastLoaded: {},
  setLastLoaded: () => {},
  lastVideoSearch: null,
  setLastVideoSearch: () => {},
  lastPlaylistSearch: null,
  setLastPlaylistSearch: () => {},
  videoCache: new Map(),
  playlistCache: new Map()
});

export function useVideotekaContext(): VideotekaContextType {
  return useContext(VideotekaContext);
}
