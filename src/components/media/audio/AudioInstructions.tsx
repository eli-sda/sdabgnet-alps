import { ContentBlockExpand } from 'alps-library/molecules/blocks/contentBlockExpand/ContentBlockExpand';
import './AudioInstructions.scss';

export type AudioInstructionsType =
  | 'audiobook'
  | 'seminars'
  | 'sermons'
  | 'music'
  | 'bible';

type TypeText = {
  listen: string;
  share: string;
  item: string;
  titles?: string; // default: 'заглавия'
  progressUnit?: string; // default: 'кой запис'
  nextUnit?: string; // default: 'следващо аудио'
  nextPronoun?: string; // default: 'то'
  hideDownloadAll?: boolean;
};

const typeText: Record<AudioInstructionsType, TypeText> = {
  audiobook: {
    listen: 'избрана аудиокнига',
    share: 'аудиокнига или конкретно аудио от нея',
    item: 'аудиокнигата'
  },
  seminars: {
    listen: 'избран семинар',
    share: 'семинар или конкретно аудио от него',
    item: 'семинара'
  },
  sermons: {
    listen: 'избран списък от проповеди',
    share: 'списък от проповеди или конкретно аудио от него',
    item: 'проповедта'
  },
  music: {
    listen: 'избран списък от песни',
    share: 'поредицата от песни или конкретно аудио от нея',
    item: 'аудиото'
  },
  bible: {
    listen: 'аудио Библията',
    share: 'аудио Библията или конкретно аудио от нея',
    item: 'Библията',
    titles: 'глави на Библията',
    progressUnit: 'коя глава',
    nextUnit: 'следващата глава',
    nextPronoun: 'тя',
    hideDownloadAll: true
  }
};

interface AudioInstructionsProps {
  type: AudioInstructionsType;
  className?: string;
}

export const AudioInstructions = ({
  type,
  className = ''
}: AudioInstructionsProps) => {
  const {
    listen,
    share,
    item,
    titles = 'заглавия',
    progressUnit = 'кой запис',
    nextUnit = 'следващо аудио',
    nextPronoun = 'то',
    hideDownloadAll = false
  } = typeText[type];
  return (
    <ContentBlockExpand
      kicker="Помощ "
      title="Как да използвате аудио поредиците"
      className={`audio-instructions${className ? ` ${className}` : ''}`}
    >
      <p className="audio-instructions__caption">
        • Използвайте бутона{' '}
        <span style={{ whiteSpace: 'nowrap' }}>
          <span className="audio-instructions__caption__icon-wrapper">
            <img
              className="icon"
              src="/images/icons/o-icon__audio.svg"
              alt="Аудио икона"
              width="18"
              height="18"
            />
          </span>
          ,
        </span>{' '}
        за да слушате {listen}.
        <br />• В отворения аудио плеър чрез бутона{' '}
        <img
          className="icon"
          src="/img/icons/playlist-icon.svg"
          alt="Плейлист икона"
          width="18"
          height="18"
        />{' '}
        можете да видите списъка с всички {titles}.
        <br />• За да изтеглите{' '}
        {!hideDownloadAll && (
          <>
            всички аудио файлове от поредицата в архив (zip-формат), използвайте
            бутона &quot;Изтегли всички&quot;, а за да изтеглите{' '}
          </>
        )}
        текущия файл, използвайте иконата{' '}
        <img
          className="icon"
          src="/img/icons/download-icon.svg"
          alt="Изтегли икона"
          width="20"
          height="20"
        />{' '}
        от плеъра.
        <br />• Можете да споделите линк към {share}.
        <br />• Вашият напредък ({progressUnit} слушате) се помни автоматично.
        Натиснете{' '}
        <span style={{ whiteSpace: 'nowrap' }}>
          <i className="fas fa-bookmark u-color--white u-background-color--ming u-padding--quarter"></i>
          ,
        </span>{' '}
        за да запазите точната секунда, на която прекъсвате {item}. Щом
        започнете {nextUnit}, {nextPronoun} автоматично ще стане вашето ново
        запомнено място.
      </p>
    </ContentBlockExpand>
  );
};
