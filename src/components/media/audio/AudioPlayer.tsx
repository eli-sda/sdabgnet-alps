import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import ReactJkMusicPlayer, {
  ReactJkMusicPlayerLocale
} from 'react-jinke-music-player';
import { createDynamicMusicPlayerLocale } from 'src/utils/bgMusicPlayerLocale';
import { suppressMusicPlayerWarnings } from 'src/utils/suppressMusicPlayerWarnings';
import { PLAYER_RESOURCES_FOLDER } from 'src/constants';
import { PlaylistType } from 'src/contexts/PlaylistsContext';

import 'src/styles/MusicPlayer.scss';

interface AudioPlayerProps {
  playlist: PlaylistType;
  playIndex?: number;
  onPlayIndexChange?: (index: number) => void;
  onAudioPlay: () => void;
  onAudioPause: () => void;
  initialTime?: number;
}

export interface AudioPlayerHandle {
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
}

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  (
    {
      playlist,
      playIndex = 0,
      onPlayIndexChange,
      onAudioPlay,
      onAudioPause,
      initialTime
    },
    ref
  ) => {
    useEffect(() => {
      suppressMusicPlayerWarnings();
    }, []);

    const audioElementRef = useRef<HTMLAudioElement | null>(null);

    // Set initial time on mount or when playlist changes
    useEffect(() => {
      if (
        audioElementRef.current &&
        typeof initialTime === 'number' &&
        initialTime > 0
      ) {
        audioElementRef.current.currentTime = initialTime;
      }
    }, [playlist, initialTime]);

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          void audioElementRef.current?.play();
        },
        pause: () => {
          audioElementRef.current?.pause();
        },
        getCurrentTime: () => audioElementRef.current?.currentTime ?? 0
      }),
      []
    );

    const { title, author, imageUrl, items = [] } = playlist;

    // Create dynamic locale with playlist title
    const dynamicLocale = createDynamicMusicPlayerLocale(title);

    const audioLists = items.map((item) => ({
      name: item.title || title || '',
      singer: item.author || author || '',
      musicSrc: `${PLAYER_RESOURCES_FOLDER}${item.path.replace(/^\/+/, '')}`,
      cover: imageUrl ? `${imageUrl}?w=300` : '/images/audio-cover.svg'
    }));

    return (
      <ReactJkMusicPlayer
        playIndex={playIndex}
        audioLists={audioLists}
        mode="full"
        defaultPosition={{ right: 100, bottom: 120 }}
        autoPlay
        locale={dynamicLocale as ReactJkMusicPlayerLocale}
        showDownload
        showThemeSwitch={false}
        showReload={false}
        showDestroy={false}
        showMiniModeCover={false}
        showPlay
        spaceBar
        showPlayMode={false}
        showLyric={false}
        showMediaSession={false}
        remove={false}
        clearPriorAudioLists
        defaultPlayMode="order"
        sortableOptions={{ disabled: true }}
        onPlayIndexChange={onPlayIndexChange}
        onAudioPlay={() => onAudioPlay()}
        onAudioPause={() => onAudioPause()}
        getAudioInstance={(audio) => {
          audioElementRef.current = audio;
        }}
      />
    );
  }
);

// improve linting/display in React devtools
AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
