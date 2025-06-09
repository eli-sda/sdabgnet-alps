import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { ContentBlock } from 'src/alps/molecules/blocks/ContentBlock';

export type PageLinkItemType = {
  url: string;
  title: string;
  description: string;
};

export const PageLinkItem = ({ url, title, description }: PageLinkItemType) => {
  return (
    <>
      <GridItem
        className={
          'u-padding--sides u-space--triple--bottom l-grid-item page-link-item'
        }
        sizeAtM={'3'}
        sizeAtXL={'2'}
      >
        <ContentBlock
          title={title}
          description={description}
          url={url}
          cta="Виж повече"
        ></ContentBlock>
      </GridItem>
    </>
  );
};
