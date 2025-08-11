// TypeScript declaration for custom locale to help with intellisense and type errors
export interface ReactJkMusicPlayerCustomLocale {
  play: string;
  pause: string;
  next: string;
  previous: string;
  reload: string;
  volume: string;
  mute: string;
  openText: string;
  playListsText: string;
  toggleMiniMode: string;
  destroyText: string;
  download: string;
  lightThemeText: string;
  darkThemeText: string;
  switchThemeText: string;
  playModeText: {
    order: string;
    orderLoop: string;
    singleLoop: string;
    shufflePlay: string;
  };
  lrc: {
    empty: string;
    searching: string;
    fail: string;
  };
  closeText: string;
  emptyText: string;
  clickToPlayText: string;
  clickToPauseText: string;
  clickToNextText: string;
  clickToPrevText: string;
  clickToDestroyText: string;
  clickToDownloadText: string;
  clickToThemeText: string;
  clickToPlayModeText: string;
  clickToMiniModeText: string;
  clickToReloadText: string;
  mobile?: unknown;
  mini?: unknown;
}

// No need to redeclare ReactJkMusicPlayerLocale if it is identical
