import { getImageTypeByUrl } from 'src/utils/ImageHelper';
import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';
import { Button } from 'src/alps/atoms/Button';

export type FeedItemType = {
  title: string;
  link: string;
  date: string;
  imgUrl: string;
};

export const FeedItem = ({ title, link, date, imgUrl }: FeedItemType) => {
  const img = imgUrl ? getImageTypeByUrl(imgUrl) : undefined;

  return (
    <MediaBlock
      type="stacked"
      titleAs="h4"
      title={title}
      url={link}
      image={img}
      additionalContent={
        <>
          <div className="c-block__meta u-space--zero u-font--secondary--xs u-theme--color--base">
            <time className="c-block__date u-text-transform--upper">
              {date}
            </time>
          </div>
          <Button as="a" label="Отвори" small url={link} isExternal />
        </>
      }
    />
  );
};
