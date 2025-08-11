import { FaHeadphones } from 'react-icons/fa';

// Intentionally not typing as ReactJkMusicPlayerCustomLocale to allow extra keys for the player
export const bgMusicPlayerLocale = {
  playModeText: {
    order: 'Подред',
    orderLoop: 'Повтаряй списъка',
    singleLoop: 'Повтаряй аудиото',
    shufflePlay: 'Разбъркай'
  },
  openText: 'Отвори',
  closeText: 'Затвори',
  emptyText: 'Няма аудио',
  clickToPlayText: 'Пусни',
  clickToPauseText: 'Пауза',
  nextTrackText: 'Следващ',
  previousTrackText: 'Предишен',
  reloadText: 'Презареди',
  volumeText: 'Сила на звука',
  playListsText: 'Плейлист',
  toggleLyricText: 'Покажи/скрий текста',
  toggleMiniModeText: 'Смени на мини режим',
  destroyText: 'Затвори',
  downloadText: 'Изтегли',
  //   download: 'Изтегли',
  lightThemeText: 'Светла тема',
  darkThemeText: 'Тъмна тема',
  controllerTitle: <FaHeadphones />,
  removeAudioListsText: 'Премахни плейлиста',
  emptyLyricText: 'Няма текст',
  clickToDeleteText: (name: string) => `Кликнете за изтриване: ${name}`,

  // play: 'Пусни',
  // pause: 'Пауза',
  // next: 'Следващ',
  // previous: 'Предишен',
  // reload: 'Презареди',
  // volume: 'Сила на звука',
  // mute: 'Заглуши',

  toggleMiniMode: 'Мини режим',

  lrc: {
    empty: 'Няма текст',
    searching: 'Търсене...',
    fail: 'Неуспешно зареждане'
  },

  clickToNextText: 'Към следващия',
  clickToPrevText: 'Към предишния',
  clickToDestroyText: 'Кликнете за затваряне',
  clickToDownloadText: 'Кликнете за изтегляне',
  clickToThemeText: 'Кликнете за смяна на тема',
  clickToPlayModeText: 'Кликнете за смяна на режим',
  clickToMiniModeText: 'Кликнете за мини режим',
  clickToReloadText: 'Кликнете за презареждане',
  switchThemeText: 'Смени тема',
  mobile: undefined,
  mini: undefined
  // Add all extra keys required by the player (fallback to English if not localized)

  //   muteText: 'Mute',
  //   playListsPanelText: 'Playlist',
  //   miniModePanelText: 'Mini mode',
  //   orderPlayText: 'Order',
  //   orderLoopText: 'Order loop',
  //   singleLoopText: 'Single loop',
  //   shufflePlayText: 'Shuffle',

  //   removeAudioListText: 'Remove',
  //   playListsPanelTitle: 'Playlist',

  //   audioArtist: 'Artist'
};
