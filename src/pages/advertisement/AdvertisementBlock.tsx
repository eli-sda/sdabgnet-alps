import moment from 'moment';
import { MediaImage } from 'src/alps/molecules/blocks/MediaImage';
import presets from 'alps-library/molecules/blocks/mediaBlock/MediaBlock.presets';
import useClasses from 'alps-library/helpers/useClasses';
import { MediaBlockProps } from 'src/alps/molecules/blocks/MediaBlock';
import 'src/alps/molecules/blocks/MediaBlock.scss';
import './AdvertisementBlock.scss';
import { PortableTextBlock } from '@portabletext/types';
import { CustomPortableText } from 'src/utils/CustomPortableText';

/**
 * Extended MediaBlock
 */

export type AdvertisementBlockProps = Omit<
  MediaBlockProps,
  'description' | 'date'
> & {
  description: Array<PortableTextBlock>;
  date: string;
  name: string;
  place: string;
  email: string;
  phone: string;
  hasViber?: boolean;
};

const AdvertisementBlock = ({
  asBackgroundImage = false,
  blockProps,
  date,
  description,
  name,
  place,
  email,
  phone,
  hasViber = false,
  image,
  type
}: //archivePage, row
AdvertisementBlockProps): JSX.Element => {
  type = 'archivePage';
  // Get preset props current type
  const preset = presets[type];

  const blockType = 'type' in preset ? (preset.type as string) : type;

  const wrapClasses = useClasses(`advertisement c-media-block c-block`, {
    [`c-block__${blockType}`]: blockType
  });

  const phones = phone
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <div className={` ${wrapClasses}`} {...blockProps}>
        {image && (
          <MediaImage
            className={`${'image' in preset ? preset.image : ''}`}
            asBackgroundImage={asBackgroundImage}
            image={image}
            url={image.srcSet[1200]}
          />
        )}
        <div
          className={`c-block__content flex-1 ${
            'content' in preset ? preset.content : ''
          }`}
        >
          <div className={'c-block__group u-spacing'}>
            <div className="u-width--100p u-spacing">
              {description && (
                <div
                  className={`c-block__description-wrapper u-spacing
                }`}
                >
                  <CustomPortableText value={description} />
                </div>
              )}

              <div>
                <p>
                  <strong>{name}</strong>
                  {place && ` от ${place}`}
                </p>

                <p>
                  <i className="fa fa-envelope"></i>{' '}
                  <a href={`mailto:${email}`}>{email}</a>
                </p>

                <p>
                  {phones.map((p, i) => {
                    const tel = p.replace(/\D/g, ''); // href numbers only
                    return (
                      <span key={i}>
                        <i className="fa fa-phone"></i>{' '}
                        <a href={`tel:${tel}`}>{p}</a>
                        {i < phones.length - 1 ? ', ' : ''}
                      </span>
                    );
                  })}
                </p>
                {hasViber && (
                  <p>
                    <i className="fa fa-whatsapp"></i> Viber:{' '}
                    <a href={`viber://chat?number=${phone}`}>{phone}</a>
                  </p>
                )}
              </div>
            </div>
            {date && (
              <div
                className={`c-block__meta ${
                  'meta' in preset ? preset.meta : ''
                }`}
              >
                {date && (
                  <time
                    className="c-block__date u-text-transform--upper"
                    dateTime={date}
                  >
                    {moment(date).format('DD.MM.YYYY')}
                  </time>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="u-background-color--winter u-space--right w70" />
    </>
  );
};

export default AdvertisementBlock;
