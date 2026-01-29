import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { ImageType } from 'alps-library/atoms/images/ImageType';
import { ContentBlock } from 'src/alps/molecules/blocks/ContentBlock';
import './PageLinkItem.scss';

export type BaseLinkType = {
  url: string;
  title: string;
};

export type PageLinkItemType = BaseLinkType & {
  description: string;
  img?: ImageType;
  sizeAtM?: string;
  sizeAtXL?: string;
};

export const PageLinkItem = ({
  url,
  title,
  description,
  img,
  sizeAtM = '3',
  sizeAtXL = '2'
}: PageLinkItemType) => {
  return (
    <>
      <GridItem
        className={
          'u-padding--sides u-space--triple--bottom l-grid-item page-link-item'
        }
        sizeAtM={sizeAtM}
        sizeAtXL={sizeAtXL}
      >
        <ContentBlock
          title={title}
          description={description}
          url={url}
          cta="Отвори страницата"
          image={img || undefined}
        ></ContentBlock>
      </GridItem>
    </>
  );
};
