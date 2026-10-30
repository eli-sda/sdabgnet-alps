import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react';
import ReactJkMusicPlayer, {
  type ReactJkMusicPlayerInstance,
  type ReactJkMusicPlayerLocale
} from 'react-jinke-music-player';
import { createDynamicMusicPlayerLocale } from 'src/utils/bgMusicPlayerLocale';
import { suppressMusicPlayerWarnings } from 'src/utils/suppressMusicPlayerWarnings';
import { MAIN_RESOURCES_FOLDER } from 'src/constants';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import type { Expand, MediaPlayerControls } from '../MediaPlayerControls';

import 'src/styles/MusicPlayer.scss';

type AudioPlayerProps = Expand<
  MediaPlayerControls & {
    playlist: PlaylistType;
    onAudioPlay: () => void;
    onAudioPause: () => void;
  }
>;

export interface AudioPlayerHandle {
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
  seekTo: (time: number) => void;
}

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  (
    {
      playlist,
      playIndex = 0,
      onPlayIndexChange,
      onAudioPlay,
      onAudioPause,
      initialTime,
      onInitialTimeApplied,
      linkTrackId
    },
    ref
  ) => {
    useEffect(() => {
      suppressMusicPlayerWarnings();
    }, []);

    const handleAudioPlay = useCallback(() => {
      onInitialTimeApplied?.();
      onAudioPlay();
    }, [onAudioPlay, onInitialTimeApplied]);

    const audioElementRef = useRef<ReactJkMusicPlayerInstance | null>(null);
    // Instance ref is needed to patch the library's internal auto-advance step.
    const musicPlayerRef = useRef<InstanceType<
      typeof ReactJkMusicPlayer
    > | null>(null);
    // Prevents the shared-link seek from being applied more than once.
    const initialTimeAppliedRef = useRef(false);
    // Detects when the player has switched tracks and needs new metadata.
    const prevPlayIndexRef = useRef(playIndex);
    // Set when the shared-link track ends; the patched handlePlay consumes it.
    const autoAdvanceRef = useRef(false);

    const isLinkedTrackCurrent =
      !!linkTrackId && playlist.items?.[playIndex]?._id === linkTrackId;

    // Stop at the end of the track opened from a shared link.
    const handleAudioEnded = useCallback(() => {
      if (!isLinkedTrackCurrent) return;

      autoAdvanceRef.current = true;
    }, [isLinkedTrackCurrent]);

    // react-jinke-music-player always calls its internal handlePlay after `ended`
    // and has no "stop at end" mode. Patch it to pause on the shared-link track.
    // If a future version cannot be patched, protect the remembered item in
    // MediaPlaylistList's save effect instead.
    useEffect(() => {
      const instance = musicPlayerRef.current as unknown as {
        handlePlay?: (playMode: string, isNext?: boolean) => void;
        onAudioPause?: () => void;
        audio?: HTMLAudioElement;
      } | null;

      if (!instance || typeof instance.handlePlay !== 'function') return;

      const originalHandlePlay = instance.handlePlay;
      const patchedHandlePlay = (playMode: string, isNext?: boolean) => {
        // Manual next/prev must pass through; only an ended link track stops.
        if (autoAdvanceRef.current) {
          autoAdvanceRef.current = false;
          instance.audio?.pause();
          instance.onAudioPause?.();
          return;
        }

        originalHandlePlay(playMode, isNext);
      };

      instance.handlePlay = patchedHandlePlay;

      return () => {
        if (instance.handlePlay === patchedHandlePlay) {
          instance.handlePlay = originalHandlePlay;
        }
      };
    }, []);

    // Apply the requested start position (shared link or resume) before playback.
    useEffect(() => {
      const trackChanged = prevPlayIndexRef.current !== playIndex;
      prevPlayIndexRef.current = playIndex;

      if (typeof initialTime !== 'number' || initialTime <= 0) {
        initialTimeAppliedRef.current = false;
        return;
      }

      if (initialTimeAppliedRef.current) return;

      const audio = audioElementRef.current;
      if (!audio) return;

      let isCurrent = true;
      let seekedHandler: (() => void) | undefined;

      const completeSeek = () => {
        // Wait until seeking finishes and the requested position is reached.
        if (
          !isCurrent ||
          audio.seeking ||
          Math.abs(audio.currentTime - initialTime) >= 0.25
        ) {
          return false;
        }

        if (seekedHandler) {
          audio.removeEventListener('seeked', seekedHandler);
          seekedHandler = undefined;
        }

        initialTimeAppliedRef.current = true;
        audioElementRef.current?.togglePlay?.();
        return true;
      };

      const setInitialTime = () => {
        if (!isCurrent) return; // safety check in case audio element changes

        try {
          if (completeSeek()) return;

          seekedHandler = completeSeek;
          audio.addEventListener('seeked', seekedHandler);
          audio.currentTime = initialTime;
          completeSeek();
        } catch {
          // some mobile browsers may throw if seeking too early
        }
      };

      if (!trackChanged && audio.readyState >= 1) {
        // metadata is already loaded, seek immediately
        setInitialTime();
      } else {
        // wait for loadedmetadata of the (new) track
        audio.addEventListener('loadedmetadata', setInitialTime, {
          once: true
        });
      }

      return () => {
        isCurrent = false;
        audio.removeEventListener('loadedmetadata', setInitialTime);
        if (seekedHandler) {
          audio.removeEventListener('seeked', seekedHandler);
        }
      };
    }, [playlist, initialTime, playIndex]);

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          void audioElementRef.current?.play();
        },
        pause: () => {
          audioElementRef.current?.pause();
        },
        getCurrentTime: () => audioElementRef.current?.currentTime ?? 0,
        seekTo: (time: number) => {
          const audio = audioElementRef.current;
          if (!audio) return;
          try {
            audio.currentTime = time;
          } catch {
            // some mobile browsers may throw if seeking too early
          }
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
      musicSrc: `${MAIN_RESOURCES_FOLDER}${item.path.replace(/^\/+/, '')}`,
      cover: imageUrl ? `${imageUrl}?w=300` : '/images/audio-cover.svg'
    }));

    return (
      <ReactJkMusicPlayer
        ref={musicPlayerRef}
        playIndex={playIndex}
        audioLists={audioLists}
        mode="full"
        defaultPosition={{ right: 100, bottom: 120 }}
        autoPlay={typeof initialTime !== 'number' || initialTime <= 0}
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
        onAudioPlay={handleAudioPlay}
        onAudioPause={onAudioPause}
        onAudioEnded={handleAudioEnded}
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
