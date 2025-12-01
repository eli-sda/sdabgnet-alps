import './PageLinkItem.scss'
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { ContentBlock } from 'src/alps/molecules/blocks/ContentBlock';
import { ImageType } from 'alps-library/atoms/images/ImageType';

export type PageLinkItemType = {
  url: string;
  title: string;
  description: string;
  img?: ImageType;
  sizeAtM?: string;
  sizeAtXL?: string;
};

export const PageLinkItem = ({ url, title, description, img, sizeAtM = '3', sizeAtXL = '2' }: PageLinkItemType) => {
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
