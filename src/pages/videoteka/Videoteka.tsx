import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Caption } from 'alps-library/atoms/text/Caption';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { usePagesMeta } from 'src/hooks/usePagesMeta';
import type { SearchSource, VideotekaApplied } from './types';
import { VideoTab } from './VideoTab';
import { PlaylistTab } from './PlaylistTab';
import './Videoteka.scss';

type ActiveTab = 'videos' | 'playlists';

// ---------------------------------------------------------------------------
// Session persistence
// ---------------------------------------------------------------------------

const VIDEOTEKA_STORAGE = 'videoteka-session';

type VideotekaSession = {
  tab: ActiveTab;
  vPage: number;
  vTopicTitle: string;
  vAuthor: string;
  vText: string;
  vAll: boolean;
  pPage: number;
  pTopicTitle: string;
  pAuthor: string;
  pText: string;
  pAll: boolean;
};

function readSession(): VideotekaSession | null {
  try {
    const raw = sessionStorage.getItem(VIDEOTEKA_STORAGE);
    return raw ? (JSON.parse(raw) as VideotekaSession) : null;
  } catch {
    return null;
  }
}

function saveSession(s: VideotekaSession): void {
  try {
    sessionStorage.setItem(VIDEOTEKA_STORAGE, JSON.stringify(s));
  } catch {
    // quota exceeded or private browsing — ignore
  }
}

// ---------------------------------------------------------------------------
// URL helpers — extracted to keep component function complexity under limit
// ---------------------------------------------------------------------------

function applyTabParams(
  next: URLSearchParams,
  tab: ActiveTab,
  applied: VideotekaApplied | null,
  page: number
) {
  const prefix = tab === 'videos' ? 'v' : 'p';
  const otherPrefix = tab === 'videos' ? 'p' : 'v';

  // The URL must only ever describe the active tab; the other tab's filters are
  // kept in session storage only, so drop any stale ones carried over here.
  (['Topic', 'Author', 'Text', 'Page', 'All'] as const).forEach((key) =>
    next.delete(`${otherPrefix}${key}`)
  );

  if (applied?.all) next.set(`${prefix}All`, 'true');
  else next.delete(`${prefix}All`);
  if (applied?.topic) next.set(`${prefix}Topic`, applied.topic.title);
  else next.delete(`${prefix}Topic`);
  if (applied?.author) next.set(`${prefix}Author`, applied.author);
  else next.delete(`${prefix}Author`);
  if (applied?.text) next.set(`${prefix}Text`, applied.text);
  else next.delete(`${prefix}Text`);
  next.set(`${prefix}Page`, String(page));
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const Videoteka = () => {
  const breadcrumbsUrls = [routes.videoteka];
  const { pageMeta, pageBackground } = usePagesMeta();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // URL params take priority; fall back to last session when navigating without params
  const hasUrlFilters =
    searchParams.has('vTopic') ||
    searchParams.has('vAuthor') ||
    searchParams.has('vText') ||
    searchParams.has('vAll') ||
    searchParams.has('vPage') ||
    searchParams.has('pTopic') ||
    searchParams.has('pAuthor') ||
    searchParams.has('pText') ||
    searchParams.has('pAll') ||
    searchParams.has('pPage') ||
    searchParams.has('tab');
  const session = hasUrlFilters ? null : readSession();

  const initRef = useRef({
    tab:
      (searchParams.get('tab') as ActiveTab | null) ?? session?.tab ?? 'videos',
    vPage: parseInt(searchParams.get('vPage') ?? '', 10) || session?.vPage || 1,
    vTopicTitle: searchParams.get('vTopic') ?? session?.vTopicTitle ?? '',
    vAuthor: searchParams.get('vAuthor') ?? session?.vAuthor ?? '',
    vText: searchParams.get('vText') ?? session?.vText ?? '',
    vAll: searchParams.get('vAll') === 'true' || (session?.vAll ?? false),
    pPage: parseInt(searchParams.get('pPage') ?? '', 10) || session?.pPage || 1,
    pTopicTitle: searchParams.get('pTopic') ?? session?.pTopicTitle ?? '',
    pAuthor: searchParams.get('pAuthor') ?? session?.pAuthor ?? '',
    pText: searchParams.get('pText') ?? session?.pText ?? '',
    pAll: searchParams.get('pAll') === 'true' || (session?.pAll ?? false)
  });

  const [activeTab, setActiveTab] = React.useState<ActiveTab>(
    initRef.current.tab
  );

  // Tracks the active tab synchronously so a tab's async init can tell whether
  // it is still the one on screen before writing to the URL.
  const activeTabRef = useRef<ActiveTab>(initRef.current.tab);

  // Applied filters tracked here for URL sync and session save only
  const [vApplied, setVApplied] = useState<VideotekaApplied | null>(null);
  const [pApplied, setPApplied] = useState<VideotekaApplied | null>(null);

  const [vPage, setVPage] = useState(initRef.current.vPage);
  const [pPage, setPPage] = useState(initRef.current.pPage);

  // Sync page/tab state from the URL when the browser back/forward changes it,
  // so navigating history moves between found pages. Skipped on first mount
  // (initRef already captured the initial URL) and after our own navigations.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const tab = searchParams.get('tab');
    if (tab === 'videos' || tab === 'playlists') {
      const pageFromUrl = parseInt(
        searchParams.get(`${tab === 'videos' ? 'v' : 'p'}Page`) ?? '',
        10
      );
      activeTabRef.current = tab;
      setActiveTab(tab);
      if (pageFromUrl > 0) {
        if (tab === 'videos') {
          setVPage(pageFromUrl);
        } else {
          setPPage(pageFromUrl);
        }
      }
    }
  }, [searchParams]);

  const hashMatch = location.hash.match(
    /^#(video-)?([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i
  );

  const validHash = hashMatch ? `#${hashMatch[1] ?? ''}${hashMatch[2]}` : '';
  const updateParams = (
    tab: ActiveTab,
    applied: VideotekaApplied | null,
    page: number,
    source: SearchSource = 'user',
    replace = true
  ) => {
    const next =
      source === 'init'
        ? new URLSearchParams(searchParams)
        : new URLSearchParams();

    next.set('tab', tab);
    applyTabParams(next, tab, applied, page);

    void navigate(
      source === 'init'
        ? { search: '?' + next.toString(), hash: validHash }
        : { search: '?' + next.toString() },
      { replace }
    );
  };

  const handleTabChange = (_e: React.SyntheticEvent, v: ActiveTab) => {
    activeTabRef.current = v;
    setActiveTab(v);
    updateParams(
      v,
      v === 'videos' ? vApplied : pApplied,
      v === 'videos' ? vPage : pPage
    );
  };

  const handleVideoSearch = (
    applied: VideotekaApplied,
    source: SearchSource = 'user'
  ) => {
    setVApplied(applied);
    // A new user search starts at page 1; an init (restored URL/session) keeps
    // the page already read from the URL so shared links land on the right page.
    const page = source === 'init' ? vPage : 1;
    setVPage(page);
    // Only the active tab may put filters in the URL; a restored inactive tab
    // keeps its filters in session/state until it is actually opened.
    if (source === 'init' && activeTabRef.current !== 'videos') return;
    updateParams('videos', applied, page, source);
  };

  const handlePlaylistSearch = (
    applied: VideotekaApplied,
    source: SearchSource = 'user'
  ) => {
    setPApplied(applied);
    const page = source === 'init' ? pPage : 1;
    setPPage(page);
    // Only the active tab may put filters in the URL; a restored inactive tab
    // keeps its filters in session/state until it is actually opened.
    if (source === 'init' && activeTabRef.current !== 'playlists') return;
    updateParams('playlists', applied, page, source);
  };

  const handleVideoPageChange = (page: number) => {
    setVPage(page);
    updateParams('videos', vApplied, page, 'user', false);
  };

  const handlePlaylistPageChange = (page: number) => {
    setPPage(page);
    updateParams('playlists', pApplied, page, 'user', false);
  };

  // Persist applied filters so navigating away and back restores the last search
  useEffect(() => {
    saveSession({
      tab: activeTab,
      vPage,
      vTopicTitle: vApplied?.topic?.title ?? '',
      vAuthor: vApplied?.author ?? '',
      vText: vApplied?.text ?? '',
      vAll: !!vApplied?.all,
      pPage,
      pTopicTitle: pApplied?.topic?.title ?? '',
      pAuthor: pApplied?.author ?? '',
      pText: pApplied?.text ?? '',
      pAll: !!pApplied?.all
    });
  }, [activeTab, vPage, pPage, vApplied, pApplied]);

  return (
    <Page
      title={getTitle(routes.videoteka) || pageMeta?.title || ''}
      breadcrumbsUrls={breadcrumbsUrls}
      background={pageBackground}
      blockType="wrap6"
      pageClassName="videoteka-page u-spacing"
    >
      <div className="u-width--100p full-page">
        <Caption>
          Колекция от YouTube видеа и плейлисти, събрани от различни адвентни
          канали.
        </Caption>
      </div>
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

        {/*
          Use div[hidden] instead of TabPanel so both tabs stay mounted after
          first activation — preserving loaded Sanity data when switching tabs.
        */}
        <div
          role="tabpanel"
          hidden={activeTab !== 'videos'}
          className="videoteka-tab-panel full-page"
        >
          <VideoTab
            isActive={activeTab === 'videos'}
            initTopicTitle={initRef.current.vTopicTitle}
            initAuthor={initRef.current.vAuthor}
            initText={initRef.current.vText}
            initAll={initRef.current.vAll}
            page={vPage}
            onSearch={handleVideoSearch}
            onPageChange={handleVideoPageChange}
          />
        </div>

        <div
          role="tabpanel"
          hidden={activeTab !== 'playlists'}
          className="videoteka-tab-panel full-page"
        >
          <PlaylistTab
            isActive={activeTab === 'playlists'}
            initTopicTitle={initRef.current.pTopicTitle}
            initAuthor={initRef.current.pAuthor}
            initText={initRef.current.pText}
            initAll={initRef.current.pAll}
            page={pPage}
            onSearch={handlePlaylistSearch}
            onPageChange={handlePlaylistPageChange}
          />
        </div>
      </TabContext>
    </Page>
  );
};

export default Videoteka;
