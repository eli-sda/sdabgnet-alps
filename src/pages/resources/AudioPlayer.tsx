import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import ReactJkMusicPlayer, {
  ReactJkMusicPlayerLocale
} from 'react-jinke-music-player';
import { createDynamicMusicPlayerLocale } from '../../utils/bgMusicPlayerLocale';
import { suppressMusicPlayerWarnings } from '../../utils/suppressMusicPlayerWarnings';
import { PLAYER_RESOURCES_FOLDER } from 'src/constants';
import { PlaylistType } from 'src/contexts/PlaylistsContext';

interface AudioPlayerProps {
  playlist: PlaylistType;
  playIndex?: number;
  onPlayIndexChange?: (index: number) => void;
  onAudioPlay?: () => void;
  onAudioPause?: () => void;
}

export interface AudioPlayerHandle {
  play: () => void;
  pause: () => void;
}

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  (
    { playlist, playIndex = 0, onPlayIndexChange, onAudioPlay, onAudioPause },
    ref
  ) => {
    useEffect(() => {
      suppressMusicPlayerWarnings();
    }, []);

    const audioElementRef = useRef<HTMLAudioElement | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          void audioElementRef.current?.play();
        },
        pause: () => {
          audioElementRef.current?.pause();
        }
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
        onAudioPlay={() => onAudioPlay && onAudioPlay()}
        onAudioPause={() => onAudioPause && onAudioPause()}
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
