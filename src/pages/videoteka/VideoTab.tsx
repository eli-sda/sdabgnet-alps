import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'src/alps/atoms/Button';
import { LinkType, PlaylistType } from 'src/contexts/PlaylistsContext';
import {
  useVideotekaContext,
  VideoIndexItem
} from 'src/contexts/VideotekaContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { useVideotekaFilters } from 'src/hooks/useVideotekaFilters';
import { VideoLinkBlock } from './VideoLinkBlock';
import { VideoPlayerDialog } from 'src/components/media/video/VideoPlayerDialog';
import { VideotekaSubTab, VideotekaSubTabContext } from './VideotekaSubTab';
import type { SearchSource, VideotekaApplied } from './types';
import { loadVideosByIds } from 'src/utils/FetchHelper';
import { PageResultsSpinner } from './PageResultsSpinner';
import { useVideotekaPagedResults } from 'src/hooks/useVideotekaPagedResults';

type VideoGroup = {
  playlistId: string | null;
  playlistName: string | null;
  videos: LinkType[];
};

const VIDEOS_PER_PAGE = 20;
const RESULTS_ID = 'videoteka-video-results';

const stripQuotes = (s: string) => s.replace(/^["'„“]+/, '');

const compareText = (a: string, b: string) =>
  stripQuotes(a).localeCompare(stripQuotes(b), 'bg', {
    sensitivity: 'base',
    numeric: true
  });

const getVideoPageKey = (item: VideoIndexItem) => item._id;
const getVideoDocKey = (video: LinkType) => video._id;
const loadVideoPage = (items: VideoIndexItem[]) =>
  loadVideosByIds(items.map((item) => item._id));

export interface VideoTabProps {
  isActive: boolean;
  initTopicTitle: string;
  initAuthor: string;
  initText: string;
  initAll?: boolean;
  page: number;
  onSearch: (applied: VideotekaApplied, source?: SearchSource) => void;
  onPageChange: (page: number) => void;
}

export const VideoTab = ({
  isActive,
  initTopicTitle,
  initAuthor,
  initText,
  initAll,
  page,
  onSearch,
  onPageChange
}: VideoTabProps) => {
  const { getVideoTopics, getVideoAuthors, searchVideoIndex } =
    useVideotekaFilters();
  const { videoCache } = useVideotekaContext();
  const [videoIndex, setVideoIndex] = useState<VideoIndexItem[]>([]);
  const [dialogPlaylist, setDialogPlaylist] = useState<PlaylistType | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Only scroll to a deep link once the index has produced results.
  useScrollToHash({
    enabled: videoIndex.length > 0
  });

  // A new result set invalidates selections made on the previous one.
  useEffect(() => {
    setSelectedIds(new Set());
  }, [videoIndex]);

  // Build a stable playlist name for every playlist id so a playlist's videos
  // sort contiguously (keyed by the same id used for grouping), and the pages
  // stay alphabetical without another playlist appearing between its parts.
  const playlistNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const v of videoIndex) {
      if (v.playlistId && !map.has(v.playlistId)) {
        map.set(v.playlistId, v.playlistName ?? v.playlistId);
      }
    }
    return map;
  }, [videoIndex]);

  // Sort the full result set so singles come first (grouped under "Единични
  // видеа"), then by playlist name, then by video title.
  const sortedVideos = useMemo<VideoIndexItem[]>(() => {
    return [...videoIndex].sort((a, b) => {
      const pa = a.playlistId
        ? (playlistNameById.get(a.playlistId) ?? a.playlistId)
        : '';
      const pb = b.playlistId
        ? (playlistNameById.get(b.playlistId) ?? b.playlistId)
        : '';
      const byPlaylist = compareText(pa, pb);
      return byPlaylist !== 0 ? byPlaylist : compareText(a.title, b.title);
    });
  }, [videoIndex, playlistNameById]);

  const {
    pageItems: pageVideos,
    loading: pageLoading,
    requestScroll,
    getCached
  } = useVideotekaPagedResults<VideoIndexItem, LinkType>({
    index: sortedVideos,
    page,
    pageSize: VIDEOS_PER_PAGE,
    resultsId: RESULTS_ID,
    getPageKey: getVideoPageKey,
    getDocKey: getVideoDocKey,
    load: loadVideoPage,
    cache: videoCache
  });

  // Load the lightweight index (id/title/playlist) for the whole result set.
  // Full video documents are fetched per page by useVideotekaPagedResults.
  const fetchResults = useCallback(
    (applied: VideotekaApplied, setLoading: (l: boolean) => void) => {
      const { topic, author, text } = applied;
      setLoading(true);
      requestScroll();
      searchVideoIndex(topic?._id ?? null, topic?.title ?? '', author, text)
        // Copy the array so an identical cached search still triggers the
        // scroll effect (React bails out on the same reference).
        .then((index) => setVideoIndex([...index]))
        .catch((err) => {
          console.error('Failed to load video index', err);
          setVideoIndex([]);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [searchVideoIndex, requestScroll]
  );

  // Total video count per group across the whole result set (not just the page),
  // keyed by playlist id, with 'singles' for videos not in a playlist. Used to
  // show "page count of total" when a group spans several pages.
  const groupCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of sortedVideos) {
      const key = v.playlistId ?? 'singles';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [sortedVideos]);

  // Group a page of videos by playlist (singles first), sorted alphabetically.
  const buildGroupedVideos = useCallback(
    (videos: LinkType[]): VideoGroup[] => {
      // Bucket the page by playlist id; videos without a playlist use null.
      const map = new Map<string | null, LinkType[]>();
      videos.forEach((video) => {
        const key = video.playlistId ?? null;
        let arr = map.get(key);
        if (!arr) {
          arr = [];
          map.set(key, arr);
        }
        arr.push(video);
      });

      // Playlist groups come next, sorted by their display name, with their
      // videos sorted by title.
      const result: VideoGroup[] = [];
      for (const [id, vids] of map) {
        if (id !== null) {
          result.push({
            playlistId: id,
            playlistName: playlistNameById.get(id) ?? null,
            videos: [...vids].sort((a, b) => compareText(a.title, b.title))
          });
        }
      }
      result.sort((a, b) =>
        compareText(a.playlistName ?? '', b.playlistName ?? '')
      );

      // "Единични видеа" always goes first when such videos are on the page.
      const singles = map.get(null) ?? [];
      if (singles.length > 0) {
        result.unshift({
          playlistId: null,
          playlistName: null,
          videos: [...singles].sort((a, b) => compareText(a.title, b.title))
        });
      }
      return result;
    },
    [playlistNameById]
  );

  const toggleSelect = useCallback(
    (id: string) =>
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    []
  );

  // Selections can span pages, so resolve their full documents from the cache
  // instead of relying only on the videos of the currently visible page.
  const selectedVideos = useMemo(
    () =>
      sortedVideos
        .filter((v) => selectedIds.has(v._id))
        .map((v) => getCached(v._id))
        .filter((v): v is LinkType => Boolean(v)),
    [selectedIds, sortedVideos, getCached]
  );

  const openSelected = useCallback(
    () =>
      setDialogPlaylist({
        _id: 'videoteka-selected',
        title: 'Избрани видеа',
        items: selectedVideos
      }),
    [selectedVideos]
  );

  const renderResults = useCallback(
    (ctx: VideotekaSubTabContext) => {
      const openSingle = (video: LinkType) =>
        setDialogPlaylist({
          _id: video._id,
          title: video.title,
          items: [video]
        });

      const openPlaylist = (group: VideoGroup) =>
        setDialogPlaylist({
          _id: group.playlistId ?? 'singles',
          title: group.playlistName ?? 'Единични видеа',
          items: group.videos
        });

      // Show "this page of total" when a group spans several pages, otherwise
      // just the total (they are the same on a single-page group).
      const groupCountLabel = (group: VideoGroup) => {
        const total =
          groupCounts.get(group.playlistId ?? 'singles') ?? group.videos.length;
        return group.videos.length < total
          ? `${group.videos.length} от ${total}`
          : `${total}`;
      };

      // Pagination is rendered above and below the results. Keep it visible
      // even while the page documents are still loading.
      const pagination = ctx.renderPagination();

      if (pageLoading) {
        return <PageResultsSpinner pagination={pagination} />;
      }

      // Group only the current page; the counts above still come from the
      // full index so a playlist split across pages shows "x от total".
      const videoGroups = buildGroupedVideos(pageVideos);
      return (
        <>
          <div className="videoteka-youtube-header">
            <h2 className="u-font--primary--m u-theme--color--darker">
              YouTube видеа ({videoIndex.length})
            </h2>
            {selectedIds.size > 0 ? (
              <Button
                outline
                small
                faIconClass="fas fa-play-circle"
                label={`Пусни избраните (${selectedIds.size})`}
                onClick={openSelected}
              />
            ) : (
              <Button
                outline
                small
                disabled
                faIconClass="fas fa-play-circle"
                label="Пусни избраните"
              />
            )}
          </div>
          {pagination}
          {videoGroups.map((group) => (
            <div
              key={group.playlistId ?? 'singles'}
              className="videoteka-playlist-group u-spacing"
            >
              <div className="videoteka-group-header">
                {group.playlistId ? (
                  <>
                    <span>
                      <i className="fas fa-list u-space--quarter--right"></i>
                      {group.playlistName ?? group.playlistId}
                      <span className="videoteka-group-count">
                        {' '}
                        ({groupCountLabel(group)})
                      </span>
                    </span>
                    <Button
                      outline
                      small
                      faIconClass="fas fa-play-circle"
                      label="Пусни плейлиста"
                      onClick={() => openPlaylist(group)}
                    />
                  </>
                ) : (
                  <span>Единични видеа ({groupCountLabel(group)})</span>
                )}
              </div>
              {group.videos.map((video, i) => (
                <VideoLinkBlock
                  key={video._id || i}
                  video={video}
                  appliedTopics={ctx.applied?.topic ? [ctx.applied.topic] : []}
                  isSelected={selectedIds.has(video._id)}
                  onToggleSelect={() => toggleSelect(video._id)}
                  onPlay={() => openSingle(video)}
                  showPlaylist={false}
                  highlightText={ctx.applied?.text ?? ''}
                />
              ))}
            </div>
          ))}
          {pagination}
        </>
      );
    },
    [
      pageLoading,
      pageVideos,
      videoIndex.length,
      selectedIds,
      groupCounts,
      toggleSelect,
      openSelected,
      buildGroupedVideos
    ]
  );

  return (
    <>
      <VideotekaSubTab
        isActive={isActive}
        initTopicTitle={initTopicTitle}
        initAuthor={initAuthor}
        initText={initText}
        initAll={initAll}
        page={page}
        onSearch={onSearch}
        onPageChange={onPageChange}
        resultsId={RESULTS_ID}
        pageSize={VIDEOS_PER_PAGE}
        filterType="videos"
        caption={
          <>
            Търсете отделни видеа по тематика, автор или думи от заглавието или
            описанието. Можете да изберете няколко видеа и да ги пуснете
            последователно във вградения плеър без реклами.
          </>
        }
        getTopics={getVideoTopics}
        getAuthors={getVideoAuthors}
        fetchResults={fetchResults}
        totalResults={videoIndex.length}
        noResults={videoIndex.length === 0}
        renderResults={renderResults}
      />

      {selectedIds.size > 0 && (
        <div className="videoteka-sticky-bar">
          <Button
            faIconClass="fas fa-play-circle"
            label={`Пусни избраните (${selectedIds.size})`}
            onClick={openSelected}
          />
        </div>
      )}

      <VideoPlayerDialog
        isOpen={dialogPlaylist !== null}
        playlist={dialogPlaylist}
        title={dialogPlaylist?.title ?? ''}
        playIndex={0}
        onClose={() => setDialogPlaylist(null)}
      />
    </>
  );
};
