import React from 'react';
import useClasses from 'alps-library/helpers/useClasses';
import renderItems from 'alps-library/helpers/renderItems';

import { blockTypes } from 'alps-library/organisms/sections/pageHeaderFeature/PageHeaderFeature';
import {
  MediaBlock,
  MediaBlockProps
} from 'src/alps/molecules/blocks/MediaBlock';

export interface PageHeaderFeatureProps {
  blocks?: MediaBlockProps[];
  /**
   * Specify the type of your  blockType
   */
  blockType?: keyof typeof blockTypes;
  /**
   * Specify whether the PageHeader should be a hasScroll variant
   */
  hasScroll?: boolean;
  /**
   * Specify this parameter for Media Block includes in this component
   */
  asBackgroundImage?: boolean;
}

export const PageHeaderFeature2 = ({
  blocks,
  blockType = 'feature',
  hasScroll = false,
  asBackgroundImage
}: PageHeaderFeatureProps): JSX.Element => {
  const headerClasses = useClasses('c-page-header c-page-header__feature', {
    'c-page-header__3-col': blockType === 'column',
    'has-scroll': hasScroll
  });

  return (
    <header className={headerClasses}>
      <div className="c-page-header__content">
        {blocks ? (
          renderItems(blocks, MediaBlock, { type: blockType })
        ) : (
          <MediaBlock type={blockType} asBackgroundImage={asBackgroundImage} />
        )}
      </div>
      {hasScroll && <a href="#" className="c-page-header__scroll" />}
    </header>
  );
};
