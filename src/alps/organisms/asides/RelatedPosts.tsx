import React from 'react';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import renderItems from 'alps-library/helpers/renderItems';
import {
  MediaBlock,
  MediaBlockProps
} from 'src/alps/molecules/blocks/MediaBlock';

export interface RelatedPostsProps {
  blocks?: MediaBlockProps[];
  /**
   * Specify the heading of your RelatedPosts
   */
  heading?: string;
  /**
   * Specify the linkText of your RelatedPosts
   */
  linkText?: string;
  /**
   * Specify the url of your RelatedPosts
   */
  url?: string;
  /**
   * Specify the id of your RelatedPosts
   */
  id?: string;
}

export const RelatedPosts = ({
  blocks = [],
  heading = 'Heading',
  linkText,
  url,
  id
}: RelatedPostsProps): JSX.Element => {
  return (
    <div className="c-related-posts u-spacing" id={id}>
      <HeadingBlock title={heading} linkText={linkText} url={url} />
      <div className="c-related-posts__content u-spacing">
        {renderItems(blocks, MediaBlock, { type: 'relatedPost' })}
      </div>
    </div>
  );
};
