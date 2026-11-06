import { useCallback, useRef } from 'react';
import { TopicType } from 'src/contexts/PlaylistsContext';
import {
  PlaylistIndexItem,
  useVideotekaContext,
  VideoIndexItem
} from 'src/contexts/VideotekaContext';
import {
  loadAllVideoTopics,
  loadAllVideoAuthors,
  loadAllPlaylistTopics,
  loadAllPlaylistAuthors,
  loadVideoSearchIndex,
  loadPlaylistSearchIndex
} from 'src/utils/FetchHelper';
import { getTodayString } from 'src/utils/getTodayString';

export type VideotekaFiltersHook = {
  getVideoTopics: () => Promise<TopicType[]>;
  getVideoAuthors: () => Promise<string[]>;
  getPlaylistTopics: () => Promise<TopicType[]>;
  getPlaylistAuthors: () => Promise<string[]>;
  searchVideoIndex: (topicId: string | null, topicTitle: string, author: string, text: string) => Promise<VideoIndexItem[]>;
  searchPlaylistIndex: (topicId: string | null, topicTitle: string, author: string, text: string) => Promise<PlaylistIndexItem[]>;
};

export function useVideotekaFilters(): VideotekaFiltersHook {
  const {
    videoTopics, setVideoTopics,
    playlistTopics, setPlaylistTopics,
    videoAuthors, setVideoAuthors,
    playlistAuthors, setPlaylistAuthors,
    lastLoaded, setLastLoaded,
    lastVideoSearch, setLastVideoSearch,
    lastPlaylistSearch, setLastPlaylistSearch
  } = useVideotekaContext();

  // Read the cache through refs so the search callbacks keep a stable identity
  // when the cache updates. Otherwise every cached result recreates the
  // callbacks, which re-triggers VideotekaSubTab's fetch effect and can fire
  // the same page request twice.
  const lastVideoSearchRef = useRef(lastVideoSearch);
  const lastPlaylistSearchRef = useRef(lastPlaylistSearch);

  const getVideoTopics = useCallback(async (): Promise<TopicType[]> => {
    const today = getTodayString();
    if (videoTopics.length > 0 && lastLoaded['videoTopics'] === today) {
      return videoTopics;
    }
    return loadAllVideoTopics()
      .then((topics) => {
        setVideoTopics(topics);
        setLastLoaded('videoTopics', today);
        return topics;
      })
      .catch((err) => {
        console.error('Failed to fetch video topics:', err);
        return [] as TopicType[];
      });
  }, [videoTopics, lastLoaded, setVideoTopics, setLastLoaded]);

  const getVideoAuthors = useCallback(async (): Promise<string[]> => {
    const today = getTodayString();
    if (videoAuthors.length > 0 && lastLoaded['videoAuthors'] === today) {
      return videoAuthors;
    }
    return loadAllVideoAuthors()
      .then((authors) => {
        setVideoAuthors(authors);
        setLastLoaded('videoAuthors', today);
        return authors;
      })
      .catch((err) => {
        console.error('Failed to fetch video authors:', err);
        return [] as string[];
      });
  }, [videoAuthors, lastLoaded, setVideoAuthors, setLastLoaded]);

  const getPlaylistTopics = useCallback(async (): Promise<TopicType[]> => {
    const today = getTodayString();
    if (playlistTopics.length > 0 && lastLoaded['playlistTopics'] === today) {
      return playlistTopics;
    }
    return loadAllPlaylistTopics()
      .then((topics) => {
        setPlaylistTopics(topics);
        setLastLoaded('playlistTopics', today);
        return topics;
      })
      .catch((err) => {
        console.error('Failed to fetch playlist topics:', err);
        return [] as TopicType[];
      });
  }, [playlistTopics, lastLoaded, setPlaylistTopics, setLastLoaded]);

  const getPlaylistAuthors = useCallback(async (): Promise<string[]> => {
    const today = getTodayString();
    if (playlistAuthors.length > 0 && lastLoaded['playlistAuthors'] === today) {
      return playlistAuthors;
    }
    return loadAllPlaylistAuthors()
      .then((authors) => {
        setPlaylistAuthors(authors);
        setLastLoaded('playlistAuthors', today);
        return authors;
      })
      .catch((err) => {
        console.error('Failed to fetch playlist authors:', err);
        return [] as string[];
      });
  }, [playlistAuthors, lastLoaded, setPlaylistAuthors, setLastLoaded]);

  // Cache only the lightweight index for the last filters. Full documents are
  // loaded and cached per page inside VideoTab.
  const searchVideoIndex = useCallback(
    async (topicId: string | null, topicTitle: string, author: string, text: string): Promise<VideoIndexItem[]> => {
      const cached = lastVideoSearchRef.current;
      if (
        cached?.topicTitle === topicTitle &&
        cached.author === author &&
        cached.text === text
      ) {
        return cached.index;
      }
      return loadVideoSearchIndex(topicId ? [topicId] : [], author, text)
        .then((index) => {
          // Update the ref synchronously so a quick second call sees the
          // fresh cache before React commits the state update.
          const entry = { topicTitle, author, text, index };
          lastVideoSearchRef.current = entry;
          setLastVideoSearch(entry);
          return index;
        })
        .catch((err) => {
          console.error('Failed to fetch video index:', err);
          return [] as VideoIndexItem[];
        });
    },
    [setLastVideoSearch]
  );

  // Same as above for playlists: only id/title/kind is cached at this level.
  const searchPlaylistIndex = useCallback(
    async (topicId: string | null, topicTitle: string, author: string, text: string): Promise<PlaylistIndexItem[]> => {
      const cached = lastPlaylistSearchRef.current;
      if (
        cached?.topicTitle === topicTitle &&
        cached.author === author &&
        cached.text === text
      ) {
        return cached.index;
      }
      return loadPlaylistSearchIndex(topicId ? [topicId] : [], author, text)
        .then((index) => {
          // Update the ref synchronously so a quick second call sees the
          // fresh cache before React commits the state update.
          const entry = { topicTitle, author, text, index };
          lastPlaylistSearchRef.current = entry;
          setLastPlaylistSearch(entry);
          return index;
        })
        .catch((err) => {
          console.error('Failed to fetch playlist index:', err);
          return [] as PlaylistIndexItem[];
        });
    },
    [setLastPlaylistSearch]
  );

  return {
    getVideoTopics, getVideoAuthors,
    getPlaylistTopics, getPlaylistAuthors,
    searchVideoIndex, searchPlaylistIndex
  };
}
