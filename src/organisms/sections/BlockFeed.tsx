// From alps BlockFeed
// updated blocks type, use types from src/alps
import renderItems from 'alps-library/helpers/renderItems';
import AdvertisementBlock, {
  AdvertisementBlockProps
} from 'src/pages/advertisement/AdvertisementBlock';

import {
  MediaBlock,
  MediaBlockProps
} from 'src/alps/molecules/blocks/MediaBlock';
import { GridSeven } from 'alps-library/atoms/grids/GridSeven';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { BlockFeedProps as AlpsBlockFeedProps } from 'alps-library/organisms/sections/BlockFeed/BlockFeed';

export interface BlockFeedProps extends Omit<
  AlpsBlockFeedProps,
  'blocks' | 'mediaBlockComponent'
> {
  /**
   * Items for rendering MediaBlock components
   */
  blocks?: MediaBlockProps[] | AdvertisementBlockProps[];
  mediaBlockComponent?: 'MediaBlock' | 'AdvertisementBlock';
}

export const BlockFeed = ({
  blocks = [],
  blocksType = 'row',
  mediaBlockComponent = 'MediaBlock',
  grid = false,
  gridItemProps = { sizeAtS: '3', sizeAtXL: '2' }
}: BlockFeedProps): JSX.Element => {
  const itemsProps = {
    type: blocksType
  };

  const ItemComponent =
    mediaBlockComponent === 'MediaBlock' ? MediaBlock : AdvertisementBlock;

  const renderBlock = (block: MediaBlockProps | AdvertisementBlockProps) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ItemComponent {...itemsProps} {...(block as any)} />
  );

  const renderGridBlock = (
    block: MediaBlockProps | AdvertisementBlockProps
  ) => <GridItem {...gridItemProps}>{renderBlock(block)}</GridItem>;

  return (
    <section className="c-section c-section__block-feed u-spacing--double">
      {grid ? (
        <GridSeven className={'l-grid l-grid--7-col u-no-gutters l-grid-wrap'}>
          {renderItems(blocks, renderGridBlock, '')}
        </GridSeven>
      ) : (
        renderItems(blocks, ItemComponent, itemsProps)
      )}
    </section>
  );
};
