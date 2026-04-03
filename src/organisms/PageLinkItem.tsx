import { IconType } from 'react-icons/lib';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { ImageType } from 'alps-library/atoms/images/ImageType';
import { iconConfig } from 'alps-library/atoms/icons/_config';
import { ContentBlock } from 'src/alps/molecules/blocks/ContentBlock';
import { ButtonProps } from 'src/alps/atoms/Button';
import './PageLinkItem.scss';

export type BaseLinkType = {
  url: string;
  title: string;
};

export type PageLinkItemType = BaseLinkType & {
  description: string;
  img?: ImageType;
  buttons?: ButtonProps[];
  sizeAtM?: string;
  sizeAtXL?: string;
  reactIcon?: IconType;
  faIconClass?: string;
  icon?: keyof typeof iconConfig.iconNamesMap;
};

export const PageLinkItem = ({
  url,
  title,
  description,
  img,
  buttons,
  sizeAtM = '3',
  sizeAtXL = '2',
  reactIcon,
  faIconClass,
  icon
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
          reactIcon={reactIcon}
          faIconClass={faIconClass}
          icon={icon}
          description={description}
          url={url}
          cta="Отвори страницата"
          image={img || undefined}
          buttons={buttons}
        ></ContentBlock>
      </GridItem>
    </>
  );
};
