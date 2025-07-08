// from alps BlockFeed
// updated blocks type, use types from src/alps 
import renderItems from 'alps-library/helpers/renderItems';
import AdvertisementBlock, {
  AdvertisementBlockProps
} from 'src/pages/advertisement/AdvertisementBlock';

import { MediaBlock, MediaBlockProps } from 'src/alps/molecules/blocks/MediaBlock';
import { MediaBlockTypesMap } from 'alps-library/molecules/blocks/mediaBlock/MediaBlock';

export interface BlockFeedProps {
  /**
   * Items for rendering MediaBlock components
   */
  blocks?: MediaBlockProps[] | AdvertisementBlockProps[];
  /**
   * Specify the type of your blocksType
   */
  blocksType?: keyof typeof MediaBlockTypesMap;
  mediaBlockComponent: 'MediaBlock' | 'AdvertisementBlock';
}

export const BlockFeed = ({
  blocks = [],
  blocksType = 'row',
  mediaBlockComponent = 'MediaBlock'
}: BlockFeedProps): JSX.Element => {
  const itemsProps = {
    type: blocksType
  };

  const itemComponent =
    mediaBlockComponent === 'MediaBlock' ? MediaBlock : AdvertisementBlock;

  return (
    <section className="c-section c-section__block-feed u-spacing--double">
      {renderItems(blocks, itemComponent, itemsProps)}
    </section>
  );
};
