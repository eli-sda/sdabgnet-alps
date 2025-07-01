import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { GridSeven } from 'alps-library/atoms/grids/GridSeven';
import { Text } from 'alps-library/atoms/text/Text';

export interface ArchiveContentProps {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
}

//taken from alps ArchivePage
export const ArchiveContent = ({
  children,
  sidebar
}: ArchiveContentProps): JSX.Element => {
  return (
    <GridSeven
      className="l-main__content u-padding--zero--sides u-spacing--double--until-xxlarge l-grid l-grid--7-col l-grid-wrap--6-of-7 u-shift--left--1-col--at-xxlarge"
      id="top"
      as="section"
    >
      <GridItem className="c-article" sizeAtL="4" sizeAtXL="3">
        <Text
          as="article"
          className="c-article__body u-space--top"
          hasDropcap={false}
          spacing={'double'}
        >
          <GridItem
            className={
              'u-spacing--double u-no-gutters u-shift--right--1-col--at-large l-grid-item--5-col l-grid-item--l--4-col l-grid-item--xl--3-col'
            }
          >
            {children}
            {/* <BlockFeed blocks={articles} blocksType="archivePage" />
          {pagination && <Pagination {...pagination} />} */}
          </GridItem>
        </Text>
      </GridItem>

      <div className="c-sidebar u-padding--zero--sides u-spacing l-grid-item l-grid-item--l--2-col l-grid-item--xl--2-col">
        {sidebar}
      </div>
    </GridSeven>
  );
};
