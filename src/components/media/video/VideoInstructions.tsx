import './VideoInstructions.scss';

interface VideoInstructionsProps {
  className?: string;
}

export const VideoInstructions = ({
  className = ''
}: VideoInstructionsProps) => {
  return (
    <div className={`video-instructions${className ? ` ${className}` : ''}`}>
      <p className="video-instructions__caption">
        • С бутона{' '}
        <span className="video-instructions__caption__bookmark-btn-wrap">
          <button className="o-button o-button--small">
            <i className="fas fa-share-alt u-space--quarter--right"></i>Вземи
            линк
          </button>
        </span>{' '}
        (или с иконата до всяко видео) споделяте линк към конкретното видео.
        <br />• Вашият напредък (кое видео гледате) се помни автоматично.
        Натиснете{' '}
        <span className="video-instructions__caption__bookmark-btn-wrap">
          <button className="o-button o-button--small">
            <i className="fas fa-bookmark u-space--quarter--right"></i>Запомни
          </button>
        </span>
        , за да запазите <strong>точната секунда</strong>, на която прекъсвате
        видеото. Щом
        започнете следващо видео, то автоматично ще стане вашето ново запомнено
        място. <em>(Запазва се само в текущия браузър.)</em>
        <br />• Ако отворите видеото през споделен линк и имате запомнено място,
        ще се появи бутон{' '}
        <span className="video-instructions__caption__bookmark-btn-wrap">
          <button className="o-button o-button--small">
            <i className="fas fa-play u-space--quarter--right"></i>Пусни от
            запомненото
          </button>
        </span>
        , с който продължавате оттам.
      </p>
    </div>
  );
};
