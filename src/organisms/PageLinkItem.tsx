import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { BreakoutBlock } from 'src/alps/molecules/blocks/BreakoutBlock';
import { themeBackgroundClass } from 'alps-library/global/colors';

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
          'u-padding--sides u-space--triple--bottom l-grid-item l-grid-item--l--5-col page-link-item'
        }
        sizeAtL={'3'}
        sizeAtXL={'2'}
      >
        <BreakoutBlock
          title={title}
          description={description}
          url={url}
          cta="Виж повече"
          backgroundClass={`${themeBackgroundClass}--dark`}
        />
      </GridItem>
    </>
  );
};
