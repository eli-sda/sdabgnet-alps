import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { VideoTab, VideoApplied } from './VideoTab';
import { PlaylistTab, PlaylistApplied } from './PlaylistTab';
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

function applyVideoParams(next: URLSearchParams, applied: VideoApplied | null) {
  next.delete('pTopic'); next.delete('pAuthor'); next.delete('pText');
  if (applied?.topic) next.set('vTopic', applied.topic.title); else next.delete('vTopic');
  if (applied?.author) next.set('vAuthor', applied.author); else next.delete('vAuthor');
  if (applied?.text) next.set('vText', applied.text); else next.delete('vText');
}

function applyPlaylistParams(next: URLSearchParams, applied: PlaylistApplied | null) {
  next.delete('vTopic'); next.delete('vAuthor'); next.delete('vText');
  if (applied?.topic) next.set('pTopic', applied.topic.title); else next.delete('pTopic');
  if (applied?.author) next.set('pAuthor', applied.author); else next.delete('pAuthor');
  if (applied?.text) next.set('pText', applied.text); else next.delete('pText');
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const Videoteka = () => {
  const breadcrumbsUrls = [routes.videoteka];
  const [searchParams, setSearchParams] = useSearchParams();

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
  const [vApplied, setVApplied] = useState<VideoApplied | null>(null);
  const [pApplied, setPApplied] = useState<PlaylistApplied | null>(null);

  const handleTabChange = (_e: React.SyntheticEvent, v: ActiveTab) => {
    setActiveTab(v);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', v);
      if (v === 'videos') applyVideoParams(next, vApplied);
      else applyPlaylistParams(next, pApplied);
      return next;
    });
  };

  const handleVideoSearch = (applied: VideoApplied) => {
    setVApplied(applied);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'videos');
      applyVideoParams(next, applied);
      return next;
    });
  };

  const handlePlaylistSearch = (applied: PlaylistApplied) => {
    setPApplied(applied);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'playlists');
      applyPlaylistParams(next, applied);
      return next;
    });
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
