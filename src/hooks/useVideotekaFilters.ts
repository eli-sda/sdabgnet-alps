import { useCallback } from 'react';
import { LinkType, TopicType } from 'src/contexts/PlaylistsContext';
import { useVideotekaContext } from 'src/contexts/VideotekaContext';
import {
  loadAllVideoTopics,
  loadAllVideoAuthors,
  loadAllPlaylistTopics,
  loadAllPlaylistAuthors,
  loadVideosByFilters,
  loadPlaylistsByFilters,
  PlaylistSearchResults
} from 'src/utils/FetchHelper';
import { getTodayString } from 'src/utils/getTodayString';

export type VideotekaFiltersHook = {
  getVideoTopics: () => Promise<TopicType[]>;
  getVideoAuthors: () => Promise<string[]>;
  getPlaylistTopics: () => Promise<TopicType[]>;
  getPlaylistAuthors: () => Promise<string[]>;
  searchVideos: (topicId: string | null, topicTitle: string, author: string, text: string) => Promise<LinkType[]>;
  searchPlaylists: (topicId: string | null, topicTitle: string, author: string, text: string) => Promise<PlaylistSearchResults>;
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

  const searchVideos = useCallback(
    async (topicId: string | null, topicTitle: string, author: string, text: string): Promise<LinkType[]> => {
      if (
        lastVideoSearch?.topicTitle === topicTitle &&
        lastVideoSearch.author === author &&
        lastVideoSearch.text === text
      ) {
        return lastVideoSearch.videos;
      }
      return loadVideosByFilters(topicId ? [topicId] : [], author, text)
        .then((videos) => {
          setLastVideoSearch({ topicTitle, author, text, videos });
          return videos;
        })
        .catch((err) => {
          console.error('Failed to fetch videos:', err);
          return [] as LinkType[];
        });
    },
    [lastVideoSearch, setLastVideoSearch]
  );

  const searchPlaylists = useCallback(
    async (topicId: string | null, topicTitle: string, author: string, text: string): Promise<PlaylistSearchResults> => {
      if (
        lastPlaylistSearch?.topicTitle === topicTitle &&
        lastPlaylistSearch.author === author &&
        lastPlaylistSearch.text === text
      ) {
        return { embedded: lastPlaylistSearch.embedded, ytLinks: lastPlaylistSearch.ytLinks };
      }
      return loadPlaylistsByFilters(topicId ? [topicId] : [], author, text)
        .then((results) => {
          setLastPlaylistSearch({ topicTitle, author, text, ...results });
          return results;
        })
        .catch((err) => {
          console.error('Failed to fetch playlists:', err);
          return { embedded: [], ytLinks: [] };
        });
    },
    [lastPlaylistSearch, setLastPlaylistSearch]
  );

  return {
    getVideoTopics, getVideoAuthors,
    getPlaylistTopics, getPlaylistAuthors,
    searchVideos, searchPlaylists
  };
}
