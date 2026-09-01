import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'src/alps/atoms/Button';
import { LinkType, PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { useVideotekaFilters } from 'src/hooks/useVideotekaFilters';
import { VideoLinkBlock } from './VideoLinkBlock';
import { VideoPlayerDialog } from 'src/components/media/video/VideoPlayerDialog';
import { VideotekaSubTab, VideotekaSubTabContext } from './VideotekaSubTab';
import type { SearchSource, VideotekaApplied } from './types';

type VideoGroup = {
  playlistId: string | null;
  playlistName: string | null;
  videos: LinkType[];
};

const VIDEOS_PER_PAGE = 20;
const RESULTS_ID = 'videoteka-video-results';

export interface VideoTabProps {
  isActive: boolean;
  initTopicTitle: string;
  initAuthor: string;
  initText: string;
  page: number;
  onSearch: (applied: VideotekaApplied, source?: SearchSource) => void;
  onPageChange: (page: number) => void;
}

export const VideoTab = ({
  isActive,
  initTopicTitle,
  initAuthor,
  initText,
  page,
  onSearch,
  onPageChange
}: VideoTabProps) => {
  const { getVideoTopics, getVideoAuthors, searchVideos } =
    useVideotekaFilters();
  const [videos, setVideos] = useState<LinkType[]>([]);
  const [dialogPlaylist, setDialogPlaylist] = useState<PlaylistType | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchResults = useCallback(
    (applied: VideotekaApplied, setLoading: (l: boolean) => void) => {
      const { topic, author, text } = applied;
      if (!topic && !author && !text) {
        setVideos([]);
        return;
      }
      setLoading(true);
      searchVideos(topic?._id ?? null, topic?.title ?? '', author, text)
        .then(setVideos)
        .catch((err) => {
          console.error('Failed to load videos', err);
          setVideos([]);
        })
        .finally(() => setLoading(false));
    },
    [searchVideos]
  );

  const youtubeVideos = useMemo<LinkType[]>(
    () => videos.filter((v) => v.isResource !== true),
    [videos]
  );

  useScrollToHash({
    enabled: youtubeVideos.length > 0
  });

  useEffect(() => {
    setSelectedIds(new Set());
  }, [videos]);

  const stripQuotes = (s: string) => s.replace(/^["'„“]+/, '');

  // Build a stable playlist name for every playlist id so a playlist's videos
  // sort contiguously (keyed by the same id used for grouping), and the pages
  // stay alphabetical without another playlist appearing between its parts.
  const playlistNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const v of youtubeVideos) {
      if (v.playlistId && !map.has(v.playlistId)) {
        map.set(v.playlistId, v.keyWords?.[0] ?? v.playlistId);
      }
    }
    return map;
  }, [youtubeVideos]);

  // Sort the full result set so singles come first (grouped under "Единични
  // видеа"), then by playlist name, then by video title.
  const sortedYoutubeVideos = useMemo<LinkType[]>(() => {
    const locCompare = (a: string, b: string) =>
      stripQuotes(a).localeCompare(stripQuotes(b), 'bg', {
        sensitivity: 'base',
        numeric: true
      });

    return [...youtubeVideos].sort((a, b) => {
      const pa = a.playlistId
        ? (playlistNameById.get(a.playlistId) ?? a.playlistId)
        : '';
      const pb = b.playlistId
        ? (playlistNameById.get(b.playlistId) ?? b.playlistId)
        : '';
      const byPlaylist = locCompare(pa, pb);
      return byPlaylist !== 0 ? byPlaylist : locCompare(a.title, b.title);
    });
  }, [youtubeVideos, playlistNameById]);

  // Total video count per group across the whole result set (not just the page),
  // keyed by playlist id, with 'singles' for videos not in a playlist.
  const groupCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of sortedYoutubeVideos) {
      const key = v.playlistId ?? 'singles';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [sortedYoutubeVideos]);

  // Group a page of videos by playlist (singles first), sorted alphabetically.
  const buildGroupedVideos = useCallback(
    (pageVideos: LinkType[]): VideoGroup[] => {
      const sortByTitle = (a: LinkType, b: LinkType) =>
        a.title
          .replace(/^["'„“]+/, '')
          .localeCompare(b.title.replace(/^["'„“]+/, ''), 'bg', {
            sensitivity: 'base',
            numeric: true
          });

      const map = new Map<string | null, LinkType[]>();
      pageVideos.forEach((video: LinkType) => {
        const key = video.playlistId ?? null;
        let arr = map.get(key);
        if (!arr) {
          arr = [];
          map.set(key, arr);
        }
        arr.push(video);
      });
      const result: VideoGroup[] = [];
      for (const [id, vids] of map) {
        if (id !== null) {
          result.push({
            playlistId: id,
            playlistName:
              playlistNameById.get(id) ?? vids[0].keyWords?.[0] ?? null,
            videos: [...vids].sort(sortByTitle)
          });
        }
      }
      result.sort((a, b) =>
        stripQuotes(a.playlistName ?? '').localeCompare(
          stripQuotes(b.playlistName ?? ''),
          'bg',
          { sensitivity: 'base', numeric: true }
        )
      );
      const singles = map.get(null) ?? [];
      if (singles.length > 0) {
        result.unshift({
          playlistId: null,
          playlistName: null,
          videos: [...singles].sort(sortByTitle)
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

  const selectedVideos = useMemo(
    () => youtubeVideos.filter((v) => selectedIds.has(v._id)),
    [selectedIds, youtubeVideos]
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

      const pageVideos = sortedYoutubeVideos.slice(
        (ctx.effectivePage - 1) * VIDEOS_PER_PAGE,
        ctx.effectivePage * VIDEOS_PER_PAGE
      );
      const videoGroups = buildGroupedVideos(pageVideos);
      return (
        <>
          <div className="videoteka-youtube-header">
            <h2 className="u-font--primary--m u-theme--color--darker">
              YouTube видеа ({youtubeVideos.length})
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
          {ctx.renderPagination()}
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
                        (
                        {groupCounts.get(group.playlistId ?? '') ??
                          group.videos.length}
                        )
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
                  <span>
                    Единични видеа (
                    {groupCounts.get('singles') ?? group.videos.length})
                  </span>
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
                />
              ))}
            </div>
          ))}
          {ctx.renderPagination()}
        </>
      );
    },
    [
      youtubeVideos.length,
      sortedYoutubeVideos,
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
        page={page}
        onSearch={onSearch}
        onPageChange={onPageChange}
        resultsId={RESULTS_ID}
        pageSize={VIDEOS_PER_PAGE}
        filterType="videos"
        caption={
          <>
            Изберете поне един критерий за търсене на YouTube видеа от нашата
            колекция. Можете да филтрирате по тема, автор или да въведете
            ключова дума в заглавието или описанието.
          </>
        }
        getTopics={getVideoTopics}
        getAuthors={getVideoAuthors}
        fetchResults={fetchResults}
        totalResults={youtubeVideos.length}
        noResults={videos.length === 0}
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
