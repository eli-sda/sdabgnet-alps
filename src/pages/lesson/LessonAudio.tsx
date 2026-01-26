import React from 'react';
import ReactJkMusicPlayer, {
  ReactJkMusicPlayerLocale
} from 'react-jinke-music-player';
import { bgMusicPlayerLocale } from '../../utils/bgMusicPlayerLocale';
import { suppressMusicPlayerWarnings } from '../../utils/suppressMusicPlayerWarnings';

interface LessonAudioProps {
  year: number;
  quarter: number;
  week: number;
  title: string;
  getContainer?: () => HTMLElement;
}

const LessonAudio: React.FC<LessonAudioProps> = ({
  year,
  quarter,
  week,
  title,
  getContainer
}) => {
  // Suppress music player warnings/errors when component mounts
  React.useEffect(() => {
    suppressMusicPlayerWarnings();
  }, []);

  const audioUrl = `https://web.3-16.bg/lessons/${year}_Q${quarter}/${year}_Q${quarter}_Lesson_${week}.mp3`;

  return (
    <ReactJkMusicPlayer
      audioLists={[
        {
          name: `Урок ${week} ${title}`,
          singer: `Радио 3:16`,
          cover: '/img/logos/radio3-16_white_red.svg',
          musicSrc: audioUrl
        }
      ]}
      mode="full"
      defaultPosition={{
        right: 100,
        bottom: 120
      }}
      autoPlay={false}
      locale={bgMusicPlayerLocale as ReactJkMusicPlayerLocale}
      showDownload={false}
      showThemeSwitch={false}
      showReload={false}
      showDestroy={false}
      showMiniModeCover={false}
      showPlay={true}
      spaceBar={true}
      showPlayMode={false}
      showLyric={false}
      showMediaSession={false}
      remove={false}
      clearPriorAudioLists={true}
      defaultPlayMode="order"
      getContainer={getContainer}
    />
  );
};

export default LessonAudio;
