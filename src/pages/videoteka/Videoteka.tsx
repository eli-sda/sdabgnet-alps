import { useEffect, useState, useMemo } from 'react';

import { Autocomplete, TextField } from '@mui/material';
import { Form } from 'alps-library/molecules/forms/elements/Form.tsx';
import { TextField as AlpsTextField } from 'alps-library/molecules/forms/elements/TextField';
import { Caption } from 'alps-library/atoms/text/Caption';
import routes from 'src/routes';
import { Button } from 'src/alps/atoms/Button';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import {
  loadAllTopics,
  loadAllVideoAuthors,
  loadVideosByFilters
} from 'src/utils/FetchHelper';
import { LinkType, TopicType } from 'src/contexts/PlaylistsContext';
import { VideoLinkBlock } from './VideoLinkBlock';
// import DownloadList from 'src/components/downloadList/DownloadList';
import { VideoPlayerDialog } from 'src/components/media/video/VideoPlayerDialog';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import './Videoteka.scss';

type VideoGroup = {
  playlistId: string | null;
  playlistName: string | null;
  videos: LinkType[];
};

const Videoteka = () => {
  const breadcrumbsUrls = [routes.videoteka];
  const [allTopics, setAllTopics] = useState<TopicType[]>([]);
  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<TopicType[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<{
    topics: TopicType[];
    author: string;
    text: string;
  } | null>(null);
  const [videos, setVideos] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAllTopics()
      .then(setAllTopics)
      .catch((err) => {
        console.error('Failed to load topics', err);
        setAllTopics([]);
      });
    loadAllVideoAuthors()
      .then(setAllAuthors)
      .catch((err) => {
        console.error('Failed to load authors', err);
        setAllAuthors([]);
      });
  }, []);

  useEffect(() => {
    if (!appliedFilters) return;
    const { topics, author, text } = appliedFilters;
    if (topics.length === 0 && !author && !text) {
      setVideos([]);
      return;
    }
    setIsLoading(true);
    loadVideosByFilters(
      topics.map((t) => t._id),
      author,
      text
    )
      .then(setVideos)
      .catch((err) => {
        console.error('Failed to load videos', err);
        setVideos([]);
      })
      .finally(() => setIsLoading(false));
  }, [appliedFilters]);

  const hasFilters =
    selectedTopics.length > 0 || !!selectedAuthor || searchText.trim() !== '';

  const handleSearch = () => {
    setAppliedFilters({
      topics: selectedTopics,
      author: selectedAuthor ?? '',
      text: searchText.trim()
    });
  };

  // TODO: resourceVideos - add them when possible to get the correct path for downloading from the playlist (have to add playlist in the keyWords[0])
  // Currently only none-resource videos are fetched
  const { /* resourceVideos,*/ youtubeVideos } = useMemo(() => {
    // const resourceVideos = videos.filter((video) => video.isResource === true);
    const youtubeVideos = videos.filter((video) => video.isResource !== true);
    return { /* resourceVideos,*/ youtubeVideos };
  }, [videos]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Reset selection when a new search is performed
  useEffect(() => {
    setSelectedIds(new Set());
  }, [appliedFilters]);

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const [dialogPlaylist, setDialogPlaylist] = useState<PlaylistType | null>(
    null
  );

  const selectedVideos = useMemo(
    () => youtubeVideos.filter((v) => selectedIds.has(v._id)),
    [selectedIds, youtubeVideos]
  );

  const openSingle = (video: LinkType) =>
    setDialogPlaylist({ _id: video._id, title: video.title, items: [video] });

  const openSelected = () =>
    setDialogPlaylist({
      _id: 'videoteka-selected',
      title: 'Избрани видеа',
      items: selectedVideos
    });

  const openPlaylist = (group: VideoGroup) =>
    setDialogPlaylist({
      _id: group.playlistId ?? 'singles',
      title: group.playlistName ?? 'Единични видеа',
      items: group.videos
    });

  const groupedVideos = useMemo((): VideoGroup[] => {
    const map = new Map<string | null, LinkType[]>();
    for (const video of youtubeVideos) {
      const key = video.playlistId ?? null;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(video);
    }
    const result: VideoGroup[] = [];
    for (const [id, vids] of map) {
      if (id !== null) {
        result.push({
          playlistId: id,
          playlistName: vids[0].keyWords?.[0] ?? null,
          videos: vids
        });
      }
    }
    const singles = map.get(null) ?? [];
    if (singles.length > 0) {
      result.push({ playlistId: null, playlistName: null, videos: singles });
    }
    return result;
  }, [youtubeVideos]);

  const hasAppliedFilters =
    appliedFilters &&
    (appliedFilters.topics.length > 0 ||
      !!appliedFilters.author ||
      !!appliedFilters.text);

  return (
    <Page title={getTitle(routes.videoteka)} breadcrumbsUrls={breadcrumbsUrls}>
      <div className="u-spacing--double">
        <section className="u-spacing">
          <Caption>
            Изберете поне един критерий за търсене на YouTube видеа от нашата
            колекция. Можете да филтрирате по теми, автор или да въведете
            ключова дума в заглавието или описанието. Резултатите ще се покажат
            по-долу, където можете да изберете видеа за гледане директно в сайта
            ни.
          </Caption>

          <Form
            className="videoteka-search-wrapper"
            onSubmit={() => handleSearch()}
          >
            <div className="videoteka-filters-row">
              <div className="videoteka-field">
                <label className="videoteka-field__label">Теми</label>
                <Autocomplete<TopicType, true>
                  multiple
                  options={allTopics}
                  value={selectedTopics}
                  onChange={(_event, newValue) => setSelectedTopics(newValue)}
                  getOptionLabel={(option) => option.title}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  clearText="Изчисти"
                  openText="Отвори"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Избери теми" />
                  )}
                />
              </div>
            </div>
            <div className="videoteka-filters-row">
              <div className="videoteka-field">
                <label className="videoteka-field__label">Автор</label>
                <Autocomplete<string, false>
                  options={allAuthors}
                  value={selectedAuthor}
                  onChange={(_event, newValue) => setSelectedAuthor(newValue)}
                  clearText="Изчисти"
                  openText="Отвори"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Търси автор" />
                  )}
                />
              </div>
            </div>
            <div className="videoteka-filters-row">
              <div className="videoteka-field">
                <AlpsTextField
                  label="Заглавие или описание"
                  name="searchText"
                  type="text"
                  value={searchText}
                  placeholder="Въведи ключова дума"
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
            <Button label="Търси" disabled={!hasFilters} />
          </Form>
        </section>
        {isLoading && (
          <div className="centered-text">
            <i className="fas fa-spinner fa-pulse fa-5x u-space--triple"></i>
          </div>
        )}

        {/* {!isLoading && resourceVideos.length > 0 && (
          <section className="u-spacing">
            <h2 className="u-font--primary--m u-theme--color--darker">
              Видео ресурси за изтегляне
            </h2>
            <DownloadList items={resourceVideos} />
          </section>
        )} */}

        {!isLoading && youtubeVideos.length > 0 && (
          <section className="u-spacing--double">
            <div className="videoteka-youtube-header">
              <h2 className="u-font--primary--m u-theme--color--darker">
                YouTube видеа
              </h2>
              {selectedIds.size > 0 && (
                <Button
                  outline
                  small
                  faIconClass="fas fa-play-circle"
                  label={`Пусни избраните (${selectedIds.size})`}
                  onClick={openSelected}
                />
              )}
              {selectedIds.size === 0 && (
                <Button
                  outline
                  small
                  disabled
                  faIconClass="fas fa-play-circle"
                  label="Пусни избраните"
                />
              )}
            </div>
            {groupedVideos.map((group) => (
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
                          ({group.videos.length})
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
                    <span>Единични видеа ({group.videos.length})</span>
                  )}
                </div>
                {group.videos.map((video, i) => (
                  <VideoLinkBlock
                    key={video._id || i}
                    video={video}
                    appliedTopics={appliedFilters?.topics ?? []}
                    isSelected={selectedIds.has(video._id)}
                    onToggleSelect={() => toggleSelect(video._id)}
                    onPlay={() => openSingle(video)}
                    showPlaylist={false}
                  />
                ))}
              </div>
            ))}
          </section>
        )}

        {!isLoading && hasAppliedFilters && videos.length === 0 && (
          <div className="u-spacing u-text-align--center">
            <p>Не са намерени резултати.</p>
          </div>
        )}
      </div>

      <VideoPlayerDialog
        isOpen={dialogPlaylist !== null}
        playlist={dialogPlaylist}
        title={dialogPlaylist?.title ?? ''}
        playIndex={0}
        onClose={() => setDialogPlaylist(null)}
      />
    </Page>
  );
};

export default Videoteka;
