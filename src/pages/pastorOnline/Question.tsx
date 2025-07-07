import { Image } from 'alps-library/atoms/images/Image';
import { PortableTextBlock } from '@portabletext/types';
import { CustomPortableText } from 'src/utils/CustomPortableText';

export interface QuestionProps {
  /**
   * Specify the avatar of your Comment
   */
  avatar: string;
  name: string;
  text: string | Array<PortableTextBlock>;
}

export const Question = ({
  avatar,
  name,
  text
}: QuestionProps): JSX.Element => {
  return (
    <div className="text c-comment--inner u-border--left u-space--bottom  u-theme--border-color--darker">
      <div className="c-comment__avatar u-space--right">
        <Image src={avatar} alt="картинка на потребител" />
      </div>
      <div className="c-comment__body u-spacing--quarter">
        <div className="c-comment__meta">
          <span
            className={
              'byline u-font--secondary--s can-be--white u-theme--color--darker'
            }
          >
            <p>{name}</p>
          </span>
        </div>
        {typeof text === 'string' ? (
          <p className="c-comment__content">{text}</p>
        ) : (
          <CustomPortableText value={text} />
        )}
      </div>
    </div>
  );
};
