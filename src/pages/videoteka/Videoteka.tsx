import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Autocomplete, TextField } from '@mui/material';
import { Form } from 'alps-library/molecules/forms/elements/Form.tsx';
import { TextField as AlpsTextField } from 'alps-library/molecules/forms/elements/TextField';
import { Caption } from 'alps-library/atoms/text/Caption';
import routes from 'src/routes';
import { Button } from 'src/alps/atoms/Button';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import {
  loadAllVideoTopics,
  loadAllPlaylistTopics,
  loadAllVideoAuthors,
  loadAllPlaylistAuthors,
  loadVideosByFilters,
  loadPlaylistsByFilters,
  PlaylistSearchResults
} from 'src/utils/FetchHelper';
import {
  LinkType,
  TopicType,
  PlaylistType
} from 'src/contexts/PlaylistsContext';
import { VideoLinkBlock } from './VideoLinkBlock';
import { PlaylistSearchBlock } from './PlaylistSearchBlock';
import { VideoPlayerDialog } from 'src/components/media/video/VideoPlayerDialog';
import './Videoteka.scss';

type VideoGroup = {
  playlistId: string | null;
  playlistName: string | null;
  videos: LinkType[];
};

type ActiveTab = 'videos' | 'playlists';

// ---------------------------------------------------------------------------
// Shared filter form
// ---------------------------------------------------------------------------

interface FilterFormProps {
  allTopics: TopicType[];
  allAuthors: string[];
  selectedTopics: TopicType[];
  selectedAuthor: string | null;
  searchText: string;
  onTopicsChange: (v: TopicType[]) => void;
  onAuthorChange: (v: string | null) => void;
  onSearchTextChange: (v: string) => void;
  onSearch: () => void;
}

const FilterForm = ({
  allTopics,
  allAuthors,
  selectedTopics,
  selectedAuthor,
  searchText,
  onTopicsChange,
  onAuthorChange,
  onSearchTextChange,
  onSearch
}: FilterFormProps) => {
  const hasFilters =
    selectedTopics.length > 0 || !!selectedAuthor || searchText.trim() !== '';

  return (
    <Form className="videoteka-search-wrapper" onSubmit={onSearch}>
      <div className="videoteka-filters-row">
        <div className="videoteka-field">
          <label className="videoteka-field__label">Теми</label>
          <Autocomplete<TopicType, true>
            multiple
            options={allTopics}
            value={selectedTopics}
            onChange={(_e, v) => onTopicsChange(v)}
            getOptionLabel={(o) => o.title}
            isOptionEqualToValue={(o, v) => o._id === v._id}
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
            onChange={(_e, v) => onAuthorChange(v)}
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
            onChange={(e) => onSearchTextChange(e.target.value)}
          />
        </div>
      </div>
      <Button label="Търси" disabled={!hasFilters} />
    </Form>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const Videoteka = () => {
  const breadcrumbsUrls = [routes.videoteka];

  const [searchParams, setSearchParams] = useSearchParams();

  // Capture initial URL params once for restoration after data loads
  const initRef = useRef({
    tab: (searchParams.get('tab') as ActiveTab | null) ?? 'videos',
    vTopicTitles: searchParams.getAll('vTopics'),
    vAuthor: searchParams.get('vAuthor') ?? '',
    vText: searchParams.get('vText') ?? '',
    pTopicTitles: searchParams.getAll('pTopics'),
    pAuthor: searchParams.get('pAuthor') ?? '',
    pText: searchParams.get('pText') ?? ''
  });

  const [activeTab, setActiveTab] = React.useState<ActiveTab>(
    initRef.current.tab
  );

  // Separate topics and authors per tab
  const [videoTopics, setVideoTopics] = useState<TopicType[]>([]);
  const [playlistTopics, setPlaylistTopics] = useState<TopicType[]>([]);
  const [videoAuthors, setVideoAuthors] = useState<string[]>([]);
  const [playlistAuthors, setPlaylistAuthors] = useState<string[]>([]);

  // ── Videos tab ────────────────────────────────────────────────────────────
  const [vTopics, setVTopics] = useState<TopicType[]>([]);
  const [vAuthor, setVAuthor] = useState<string | null>(null);
  const [vText, setVText] = useState('');
  const [vApplied, setVApplied] = useState<{
    topics: TopicType[];
    author: string;
    text: string;
  } | null>(null);
  const [videos, setVideos] = useState<LinkType[]>([]);
  const [vLoading, setVLoading] = useState(false);

  // ── Playlists tab ─────────────────────────────────────────────────────────
  const [pTopics, setPTopics] = useState<TopicType[]>([]);
  const [pAuthor, setPAuthor] = useState<string | null>(null);
  const [pText, setPText] = useState('');
  const [pApplied, setPApplied] = useState<{
    topics: TopicType[];
    author: string;
    text: string;
  } | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistSearchResults>({
    embedded: [],
    ytLinks: []
  });
  const [pLoading, setPLoading] = useState(false);

  // Video player dialog
  const [dialogPlaylist, setDialogPlaylist] = useState<PlaylistType | null>(
    null
  );

  // Sync the destination tab's applied filters back into the URL when switching
  const handleTabChange = (_e: React.SyntheticEvent, v: ActiveTab) => {
    setActiveTab(v);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', v);
      if (v === 'videos') {
        // Clear playlists params, restore video params from state
        next.delete('pTopics');
        next.delete('pAuthor');
        next.delete('pText');
        next.delete('vTopics');
        vApplied?.topics.forEach((t) => next.append('vTopics', t.title));
        if (vApplied?.author) next.set('vAuthor', vApplied.author);
        else next.delete('vAuthor');
        if (vApplied?.text) next.set('vText', vApplied.text);
        else next.delete('vText');
      } else {
        // Clear video params, restore playlists params from state
        next.delete('vTopics');
        next.delete('vAuthor');
        next.delete('vText');
        next.delete('pTopics');
        pApplied?.topics.forEach((t) => next.append('pTopics', t.title));
        if (pApplied?.author) next.set('pAuthor', pApplied.author);
        else next.delete('pAuthor');
        if (pApplied?.text) next.set('pText', pApplied.text);
        else next.delete('pText');
      }
      return next;
    });
  };

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      loadAllVideoTopics(),
      loadAllPlaylistTopics(),
      loadAllVideoAuthors(),
      loadAllPlaylistAuthors()
    ])
      .then(([vTopicsData, pTopicsData, vAuthors, pAuthors]) => {
        setVideoTopics(vTopicsData);
        setPlaylistTopics(pTopicsData);
        setVideoAuthors(vAuthors);
        setPlaylistAuthors(pAuthors);

        // Restore video filters from URL
        const {
          vTopicTitles,
          vAuthor: vAuthorInit,
          vText: vTextInit
        } = initRef.current;
        if (vTopicTitles.length > 0 || vAuthorInit || vTextInit) {
          const resolvedTopics = vTopicsData.filter((t) =>
            vTopicTitles.includes(t.title)
          );
          setVTopics(resolvedTopics);
          setVAuthor(vAuthorInit || null);
          setVText(vTextInit);
          setVApplied({
            topics: resolvedTopics,
            author: vAuthorInit,
            text: vTextInit
          });
        }

        // Restore playlist filters from URL
        const {
          pTopicTitles,
          pAuthor: pAuthorInit,
          pText: pTextInit
        } = initRef.current;
        if (pTopicTitles.length > 0 || pAuthorInit || pTextInit) {
          const resolvedTopics = pTopicsData.filter((t) =>
            pTopicTitles.includes(t.title)
          );
          setPTopics(resolvedTopics);
          setPAuthor(pAuthorInit || null);
          setPText(pTextInit);
          setPApplied({
            topics: resolvedTopics,
            author: pAuthorInit,
            text: pTextInit
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load initial data', err);
      });
  }, []);

  // ── Video search ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!vApplied) return;
    const { topics, author, text } = vApplied;
    if (topics.length === 0 && !author && !text) {
      setVideos([]);
      return;
    }
    setVLoading(true);
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
      .finally(() => setVLoading(false));
  }, [vApplied]);

  // ── Playlist search ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!pApplied) return;
    const { topics, author, text } = pApplied;
    if (topics.length === 0 && !author && !text) {
      setPlaylists({ embedded: [], ytLinks: [] });
      return;
    }
    setPLoading(true);
    loadPlaylistsByFilters(
      topics.map((t) => t._id),
      author,
      text
    )
      .then(setPlaylists)
      .catch((err) => {
        console.error('Failed to load playlists', err);
        setPlaylists({ embedded: [], ytLinks: [] });
      })
      .finally(() => setPLoading(false));
  }, [pApplied]);

  // ── Video tab helpers ─────────────────────────────────────────────────────
  const youtubeVideos = useMemo(
    () => videos.filter((v) => v.isResource !== true),
    [videos]
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedIds(new Set());
  }, [vApplied]);

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

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
      const key: string | null = video.playlistId ?? null;
      let arr = map.get(key);
      if (!arr) {
        arr = [];
        map.set(key, arr);
      }
      arr.push(video);
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

  const vHasApplied =
    vApplied &&
    (vApplied.topics.length > 0 || !!vApplied.author || !!vApplied.text);

  const pHasApplied =
    pApplied &&
    (pApplied.topics.length > 0 || !!pApplied.author || !!pApplied.text);

  const pNoResults =
    !pLoading &&
    pHasApplied &&
    playlists.embedded.length === 0 &&
    playlists.ytLinks.length === 0;

  return (
    <Page
      title={getTitle(routes.videoteka)}
      breadcrumbsUrls={breadcrumbsUrls}
      pageClassName="videoteka-page"
    >
      <TabContext value={activeTab}>
        <TabList
          onChange={handleTabChange}
          aria-label="Видеотека табове"
          className="videoteka-tabs u-theme--background-color--darker u-padding"
          slotProps={{ indicator: { sx: { display: 'none' } } }}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab
            label="Видеа"
            value="videos"
            className="o-button o-button--outline"
          />
          <Tab
            label="Плейлисти"
            value="playlists"
            className="o-button o-button--outline"
          />
        </TabList>

        {/* ─── Videos tab ─────────────────────────────────────────────── */}
        <TabPanel value="videos" className="videoteka-tab-panel">
          <div className="u-spacing--double">
            <section className="u-spacing">
              <Caption>
                Изберете поне един критерий за търсене на YouTube видеа от
                нашата колекция. Можете да филтрирате по теми, автор или да
                въведете ключова дума в заглавието или описанието.
              </Caption>
              <FilterForm
                allTopics={videoTopics}
                allAuthors={videoAuthors}
                selectedTopics={vTopics}
                selectedAuthor={vAuthor}
                searchText={vText}
                onTopicsChange={setVTopics}
                onAuthorChange={setVAuthor}
                onSearchTextChange={setVText}
                onSearch={() => {
                  const applied = {
                    topics: vTopics,
                    author: vAuthor ?? '',
                    text: vText.trim()
                  };
                  setVApplied(applied);
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set('tab', 'videos');
                    // Clear playlists tab params
                    next.delete('pTopics');
                    next.delete('pAuthor');
                    next.delete('pText');
                    next.delete('vTopics');
                    applied.topics.forEach((t) =>
                      next.append('vTopics', t.title)
                    );
                    if (applied.author) next.set('vAuthor', applied.author);
                    else next.delete('vAuthor');
                    if (applied.text) next.set('vText', applied.text);
                    else next.delete('vText');
                    return next;
                  });
                }}
              />
            </section>

            {vLoading && (
              <div className="centered-text">
                <i className="fas fa-spinner fa-pulse fa-5x u-space--triple"></i>
              </div>
            )}

            {!vLoading && youtubeVideos.length > 0 && (
              <section className="u-spacing--double">
                <div className="videoteka-youtube-header">
                  <h2 className="u-font--primary--m u-theme--color--darker">
                    YouTube видеа
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
                        appliedTopics={vApplied?.topics ?? []}
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

            {!vLoading && vHasApplied && videos.length === 0 && (
              <div className="u-spacing u-text-align--center">
                <p>Не са намерени резултати.</p>
              </div>
            )}
          </div>
        </TabPanel>

        {/* ─── Playlists tab ───────────────────────────────────────────── */}
        <TabPanel value="playlists" className="videoteka-tab-panel">
          <div className="u-spacing--double">
            <section className="u-spacing">
              <Caption>
                Изберете поне един критерий за търсене на YouTube видео
                поредици. Можете да филтрирате по теми, автор или да въведете
                ключова дума в заглавието или описанието. Вградените поредици се
                пускат директно в сайта, а YouTube плейлистите се отварят в
                YouTube.
              </Caption>
              <FilterForm
                allTopics={playlistTopics}
                allAuthors={playlistAuthors}
                selectedTopics={pTopics}
                selectedAuthor={pAuthor}
                searchText={pText}
                onTopicsChange={setPTopics}
                onAuthorChange={setPAuthor}
                onSearchTextChange={setPText}
                onSearch={() => {
                  const applied = {
                    topics: pTopics,
                    author: pAuthor ?? '',
                    text: pText.trim()
                  };
                  setPApplied(applied);
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set('tab', 'playlists');
                    // Clear videos tab params
                    next.delete('vTopics');
                    next.delete('vAuthor');
                    next.delete('vText');
                    next.delete('pTopics');
                    applied.topics.forEach((t) =>
                      next.append('pTopics', t.title)
                    );
                    if (applied.author) next.set('pAuthor', applied.author);
                    else next.delete('pAuthor');
                    if (applied.text) next.set('pText', applied.text);
                    else next.delete('pText');
                    return next;
                  });
                }}
              />
            </section>

            {pLoading && (
              <div className="centered-text">
                <i className="fas fa-spinner fa-pulse fa-5x u-space--triple"></i>
              </div>
            )}

            {!pLoading && pHasApplied && !pNoResults && (
              <PlaylistSearchBlock
                embedded={playlists.embedded}
                ytLinks={playlists.ytLinks}
                appliedTopics={pApplied?.topics ?? []}
              />
            )}

            {pNoResults && (
              <div className="u-spacing u-text-align--center">
                <p>Не са намерени резултати.</p>
              </div>
            )}
          </div>
        </TabPanel>
      </TabContext>

      {selectedIds.size > 0 && activeTab === 'videos' && (
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
    </Page>
  );
};

export default Videoteka;
