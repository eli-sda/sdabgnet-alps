import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import type { SearchSource, VideotekaApplied } from './types';
import { VideoTab } from './VideoTab';
import { PlaylistTab } from './PlaylistTab';
import './Videoteka.scss';

type ActiveTab = 'videos' | 'playlists';

// ---------------------------------------------------------------------------
// Session persistence
// ---------------------------------------------------------------------------

const SESSION_KEY = 'videoteka-session';

type VideotekaSession = {
  tab: ActiveTab;
  vTopicTitle: string;
  vAuthor: string;
  vText: string;
  pTopicTitle: string;
  pAuthor: string;
  pText: string;
};

function readSession(): VideotekaSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as VideotekaSession) : null;
  } catch {
    return null;
  }
}

function saveSession(s: VideotekaSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
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
  applied: VideotekaApplied | null
) {
  const prefix = tab === 'videos' ? 'v' : 'p';

  if (applied?.topic) next.set(`${prefix}Topic`, applied.topic.title); else next.delete(`${prefix}Topic`);
  if (applied?.author) next.set(`${prefix}Author`, applied.author); else next.delete(`${prefix}Author`);
  if (applied?.text) next.set(`${prefix}Text`, applied.text); else next.delete(`${prefix}Text`);
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const Videoteka = () => {
  const breadcrumbsUrls = [routes.videoteka];
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // URL params take priority; fall back to last session when navigating without params
  const hasUrlFilters =
    searchParams.has('vTopic') ||
    searchParams.has('vAuthor') ||
    searchParams.has('vText') ||
    searchParams.has('pTopic') ||
    searchParams.has('pAuthor') ||
    searchParams.has('pText') ||
    searchParams.has('tab');
  const session = hasUrlFilters ? null : readSession();

  const initRef = useRef({
    tab: (searchParams.get('tab') as ActiveTab | null) ?? session?.tab ?? 'videos',
    vTopicTitle: searchParams.get('vTopic') ?? session?.vTopicTitle ?? '',
    vAuthor: searchParams.get('vAuthor') ?? session?.vAuthor ?? '',
    vText: searchParams.get('vText') ?? session?.vText ?? '',
    pTopicTitle: searchParams.get('pTopic') ?? session?.pTopicTitle ?? '',
    pAuthor: searchParams.get('pAuthor') ?? session?.pAuthor ?? '',
    pText: searchParams.get('pText') ?? session?.pText ?? ''
  });

  const [activeTab, setActiveTab] = React.useState<ActiveTab>(initRef.current.tab);

  // Applied filters tracked here for URL sync and session save only
  const [vApplied, setVApplied] = useState<VideotekaApplied | null>(null);
  const [pApplied, setPApplied] = useState<VideotekaApplied | null>(null);

  const updateParams = (
    tab: ActiveTab,
    applied: VideotekaApplied | null,
    source: SearchSource = 'user'
  ) => {
    const next =
      source === 'init' ? new URLSearchParams(searchParams) : new URLSearchParams();

    next.set('tab', tab);
    applyTabParams(next, tab, applied);

    navigate(
      source === 'init'
        ? { search: '?' + next.toString(), hash: location.hash }
        : { search: '?' + next.toString() },
      { replace: true }
    );
  };

  const handleTabChange = (_e: React.SyntheticEvent, v: ActiveTab) => {
    setActiveTab(v);
    updateParams(v, v === 'videos' ? vApplied : pApplied);
  };

  const handleVideoSearch = (
    applied: VideotekaApplied,
    source: SearchSource = 'user'
  ) => {
    setVApplied(applied);
    updateParams('videos', applied, source);
  };

  const handlePlaylistSearch = (
    applied: VideotekaApplied,
    source: SearchSource = 'user'
  ) => {
    setPApplied(applied);
    updateParams('playlists', applied, source);
  };

  // Persist applied filters so navigating away and back restores the last search
  useEffect(() => {
    saveSession({
      tab: activeTab,
      vTopicTitle: vApplied?.topic?.title ?? '',
      vAuthor: vApplied?.author ?? '',
      vText: vApplied?.text ?? '',
      pTopicTitle: pApplied?.topic?.title ?? '',
      pAuthor: pApplied?.author ?? '',
      pText: pApplied?.text ?? ''
    });
  }, [activeTab, vApplied, pApplied]);

  return (
    <Page
      title={getTitle(routes.videoteka)}
      breadcrumbsUrls={breadcrumbsUrls}
      blockType="wrap6"
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
          <Tab label="Видеа" value="videos" className="o-button o-button--outline" />
          <Tab label="Плейлисти" value="playlists" className="o-button o-button--outline" />
        </TabList>

        {/*
          Use div[hidden] instead of TabPanel so both tabs stay mounted after
          first activation — preserving loaded Sanity data when switching tabs.
        */}
        <div role="tabpanel" hidden={activeTab !== 'videos'} className="videoteka-tab-panel full-page">
          <VideoTab
            isActive={activeTab === 'videos'}
            initTopicTitle={initRef.current.vTopicTitle}
            initAuthor={initRef.current.vAuthor}
            initText={initRef.current.vText}
            onSearch={handleVideoSearch}
          />
        </div>

        <div role="tabpanel" hidden={activeTab !== 'playlists'} className="videoteka-tab-panel full-page">
          <PlaylistTab
            isActive={activeTab === 'playlists'}
            initTopicTitle={initRef.current.pTopicTitle}
            initAuthor={initRef.current.pAuthor}
            initText={initRef.current.pText}
            onSearch={handlePlaylistSearch}
          />
        </div>
      </TabContext>
    </Page>
  );
};

export default Videoteka;
