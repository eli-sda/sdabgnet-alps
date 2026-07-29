import { createContext, useContext } from 'react';
import { LinkType, PlaylistType, TopicType } from './PlaylistsContext';

export type CachedVideoSearch = {
  topicTitle: string;
  author: string;
  text: string;
  videos: LinkType[];
};

export type CachedPlaylistSearch = {
  topicTitle: string;
  author: string;
  text: string;
  embedded: PlaylistType[];
  ytLinks: LinkType[];
};

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
  setLastPlaylistSearch: () => {}
});

export function useVideotekaContext(): VideotekaContextType {
  return useContext(VideotekaContext);
}
