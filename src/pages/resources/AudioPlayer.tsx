import React, { useEffect } from 'react';
import ReactJkMusicPlayer, {
  ReactJkMusicPlayerLocale
} from 'react-jinke-music-player';
import { bgMusicPlayerLocale } from '../../utils/bgMusicPlayerLocale';
import { suppressMusicPlayerWarnings } from '../../utils/suppressMusicPlayerWarnings';
import { PLAYER_RESOURCES_FOLDER } from 'src/constants';
import { PlaylistType } from 'src/contexts/PlaylistsContext';

interface AudioPlayerProps {
  playlist: PlaylistType;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ playlist }) => {
  useEffect(() => {
    suppressMusicPlayerWarnings();
  }, []);

  const { title, author, imageUrl, items = [] } = playlist;

  const audioLists = items.map((item) => ({
    name: item.title || title || '',
    singer: item.author || author || '',
    musicSrc: `${PLAYER_RESOURCES_FOLDER}${item.path.replace(/^\/+/, '')}`,
    cover: imageUrl ? `${imageUrl}?w=300` : 'images/audio-cover.svg'
  }));

  return (
    <ReactJkMusicPlayer
      audioLists={audioLists}
      mode="full"
      defaultPosition={{ right: 100, bottom: 120 }}
      autoPlay
      locale={bgMusicPlayerLocale as ReactJkMusicPlayerLocale}
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
      // getContainer={getContainer}
    />
  );
};

export default AudioPlayer;
