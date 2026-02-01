import { useEffect, useMemo, useState } from 'react';

import { ImageType } from 'alps-library/atoms/images/ImageType';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { MediaImage } from 'src/alps/molecules/blocks/MediaImage';
import { Button } from 'src/alps/atoms/Button';
import routes from 'src/routes';
import { AD_TYPES, AdType } from 'src/constants';
import { getTitle } from 'src/utils/Navigation';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import { BaseLinkType } from 'src/organisms/PageLinkItem';

import './AdvertisementsPreview.scss';
import { useAdvertisements } from 'src/hooks/useAdvertisements';
import { AdvertisementType } from 'src/contexts/AdvertisementsContext';
import { PortableTextBlock } from '@portabletext/types';
import moment from 'moment';

type AdverMeta = BaseLinkType & {
  image: ImageType;
  text: Array<PortableTextBlock>;
  date: string;
};

// Convert AdvertisementType to AdverMeta
function advertisementToAdverMeta(ad: AdvertisementType): AdverMeta {
  return {
    title: getTitle(routes.advertisement(ad.type)),
    url: routes.advertisement(ad.type),
    image: getImageTypeByUrl(`/img/ads/${ad.type}.png`),
    text: ad.text,
    date: ad.date
  };
}

const AdvertisementPreview = ({ title, url, image, text, date }: AdverMeta) => {
  const previewUrl = url + '#ads';

  return (
    <div className="advertisements-preview-item u-padding u-spacing">
      <MediaImage image={image} url={previewUrl} />
      <div className="u-spacing">
        <h4 className="centered-text c-block__title hyphens-auto u-font--primary--s u-theme--color--dark">
          {title}
        </h4>

        <div className="text u-width--100p multiline">
          {text &&
            (() => {
              // Convert PortableTextBlock to plain text
              // Take each paragraph as a separate element
              const paragraphs = text.map((block) => {
                if (typeof block === 'string') return block;
                if (block && typeof block === 'object' && 'children' in block) {
                  return (
                    (block.children as Array<{ text?: string }> | undefined)
                      ?.map((child) =>
                        typeof child.text === 'string' ? child.text : ''
                      )
                      .join('') || ''
                  );
                }
                return '';
              });
              const plain = paragraphs.join(' ');
              const limit = 200;
              if (plain.length > limit) {
                // Limit to the character limit, but do not cut a word
                let currentLen = 0;
                const limitedParagraphs = [];
                for (const p of paragraphs) {
                  if (currentLen >= limit) break;
                  let toAdd = p;
                  if (currentLen + p.length > limit) {
                    // Take the part up to the limit
                    let cut = p.slice(0, limit - currentLen);
                    // Cut to the last space so we don't break a word
                    const lastSpace = cut.lastIndexOf(' ');
                    if (lastSpace > 0) {
                      cut = cut.slice(0, lastSpace);
                      toAdd = cut;
                    } else {
                      // If there is no space, do not add this paragraph
                      break;
                    }
                  }
                  limitedParagraphs.push(toAdd);
                  currentLen += toAdd.length;
                }
                return (
                  <div className="c-block__description-wrapper u-spacing">
                    {limitedParagraphs.join('\n')}
                  </div>
                );
              } else {
                return (
                  <div className="c-block__description-wrapper u-spacing">
                    {paragraphs.join('\n')}
                  </div>
                );
              }
            })()}
        </div>
        <time className="u-theme--color--base u-font--secondary--xs u-space--top">
          <b>{moment(date).format('DD.MM.YYYY')}</b>
        </time>
        <div className="centered-text">
          <Button as="a" label="виж обявата" url={previewUrl} small />
        </div>
      </div>
    </div>
  );
};

export const AdvertisementsPreview = () => {
  const { getAdvertisements } = useAdvertisements();
  const [firstAdsByType, setFirstAdsByType] = useState<
    Record<AdType, AdverMeta | null>
  >({} as Record<AdType, AdverMeta | null>);

  useEffect(() => {
    let isMounted = true;
    void Promise.all(
      AD_TYPES.map(async (type) => {
        try {
          const ads: AdvertisementType[] = await getAdvertisements(type);
          const firstAd = ads && ads.length > 0 ? ads[0] : null;
          return {
            type,
            ad: firstAd ? advertisementToAdverMeta(firstAd) : null
          };
        } catch {
          return { type, ad: null };
        }
      })
    ).then((results) => {
      if (!isMounted) return;
      const adsByType: Record<AdType, AdverMeta | null> = {} as Record<
        AdType,
        AdverMeta | null
      >;
      results.forEach(({ type, ad }) => {
        adsByType[type] = ad;
      });
      setFirstAdsByType(adsByType);
    });
    return () => {
      isMounted = false;
    };
  }, [getAdvertisements]);

  const renderedItems = useMemo(() => {
    return AD_TYPES.map((type) => {
      const ad = firstAdsByType[type];
      if (!ad) return null;
      return <AdvertisementPreview {...ad} key={ad.url} />;
    });
  }, [firstAdsByType]);

  return (
    <section className="u-spacing">
      <HeadingBlock title="Последни обяви по категории" />
      <div className="advertisements-preview">{renderedItems}</div>
    </section>
  );
};
