import { useMemo } from 'react';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { RelatedPostsProps } from 'src/alps/organisms/asides/RelatedPosts';
import { Page } from 'src/organisms/Page';
import routes from 'src/routes';
import { MediaType } from 'src/constants';
import { getFaIconClass, LinkItem } from 'src/utils/Links';
import { getTitle } from 'src/utils/Navigation';
import { LinksBlock } from './LinksBlock';

interface MediaLinksPageProps {
  mediaType: MediaType;
  linksJson: LinkGroup[] | LinksData[];
  asideJson?: LinkGroup[] | LinksData[];
  relatedPosts?: RelatedPostsProps;
  isDoubleSpacing?: boolean;
  children?: React.ReactNode;
}

export type LinkGroup = {
  title: string;
  link?: string;
  description?: string;
  colorDescription?: string;
  image?: string;
  image40?: string;
  links?: LinkItem[];
};

export type LinksData = {
  section: string;
  id: string;
  items: LinkGroup[];
};

const isSectionsArray = (
  data: LinkGroup[] | LinksData[]
): data is LinksData[] => {
  return data.length > 0 && 'section' in data[0];
};

const ensureSections = (data: LinkGroup[]): LinksData[] => {
  if (!data || data.length === 0) return [];

  return [
    {
      section: '',
      id: 'links',
      items: data
    }
  ];
};

const renderLinksBlocks = (groups: LinkGroup[]) =>
  groups.map(
    (
      { title, link, description, colorDescription, image, image40, links },
      i
    ) => {
      const buttons = links?.map(({ url, type }) => ({
        label: type,
        url,
        faIconClass: `${getFaIconClass(type)} fa-lg`,
        hideExternalIcon: true,
        outline: true,
        isExternal: true
      }));

      return (
        <LinksBlock
          key={i}
          title={title}
          link={link}
          description={description}
          colorDescription={colorDescription}
          picture={image}
          smallImage={image40}
          buttons={buttons}
        />
      );
    }
  );

export const MediaListSection = ({
  sections,
  doubleSpace
}: {
  sections: LinksData[];
  doubleSpace: boolean;
}) => (
  <>
    {sections.map(({ id, section, items }) => (
      <div
        key={id}
        id={id}
        className={`u-spacing${doubleSpace ? '--double' : ''}`}
      >
        {section && <HeadingBlock title={section} />}
        {renderLinksBlocks(items)}
      </div>
    ))}
  </>
);

const MediaLinksPage = ({
  mediaType,
  linksJson,
  asideJson = [],
  relatedPosts,
  isDoubleSpacing = false,
  children
}: MediaLinksPageProps): JSX.Element => {
  const breadcrumbsUrls = [routes.info(), routes.media(), routes.media(mediaType)];

  const mainSections = useMemo(
    () => (isSectionsArray(linksJson) ? linksJson : ensureSections(linksJson)),
    [linksJson]
  );
  const asideSections = useMemo(
    () => (isSectionsArray(asideJson) ? asideJson : ensureSections(asideJson)),
    [asideJson]
  );

  const asideContent =
    asideSections.length > 0 ? (
      <>
        {asideSections.length > 0 && (
          <MediaListSection
            sections={asideSections}
            doubleSpace={isDoubleSpacing}
          />
        )}
      </>
    ) : undefined;

  return (
    <Page
      title={getTitle(routes.media(mediaType))}
      breadcrumbsUrls={breadcrumbsUrls}
      aside={asideContent}
      relatedPosts={relatedPosts}
    >
      <section className="u-spacing--double">
        {children}

        <MediaListSection
          sections={mainSections}
          doubleSpace={isDoubleSpacing}
        />
      </section>
    </Page>
  );
};

export default MediaLinksPage;
