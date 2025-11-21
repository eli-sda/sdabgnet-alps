import React, { useEffect } from 'react';
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
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  playlist,
  playIndex = 0,
  onPlayIndexChange
}) => {
  useEffect(() => {
    suppressMusicPlayerWarnings();
  }, []);

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
    />
  );
};

export default AudioPlayer;
