import { useMemo } from 'react';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import routes from 'src/routes';
import { Button } from 'src/alps/atoms/Button';
import { MediaType } from 'src/constants';
import { PageSection } from 'src/organisms/PageSection';
import { RelatedPostsProps } from 'src/alps/organisms/asides/RelatedPosts';
import { getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { LinksBlock } from './LinksBlock';

interface MediaLinksPageProps {
  mediaType: MediaType;
  linksJson: LinkGroup[] | LinksData[];
  asideJson?: LinkGroup[] | LinksData[];
  relatedPosts?: RelatedPostsProps;
  isDoubleSpacing?: boolean;
}

type LinkItem = {
  url: string;
  type: 'сайт' | 'facebook' | 'youtube' | 'instagram' | 'tik tok';
};

export type LinkGroup = {
  title: string;
  description?: string;
  image?: string;
  image40?: string;
  links: LinkItem[];
};

export type LinksData = {
  section: string;
  id: string;
  items: LinkGroup[];
};

const faIconClasses: Record<string, string> = {
  сайт: 'fas fa-globe-americas',
  facebook: 'fab fa-facebook-f',
  youtube: 'fab fa-youtube',
  instagram: 'fab fa-instagram',
  'google play': 'fab fa-google-play',
  'app store': 'fab fa-app-store',
  'tik tok': 'fab fa-tiktok'
};

const getFaIconClass = (type: string) => faIconClasses[type];

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
  groups.map(({ title, description, image, image40, links }, i) => {
    const buttons = links.map(({ url, type }) => ({
      label: type,
      url,
      className: `link-button u-space--half--right ${
        links.length > 1 ? 'u-space--half--bottom' : ''
      }`,
      faIconClass: `${getFaIconClass(type)} fa-lg`,
      hideExternalIcon: true,
      simple: true,
      outline: true,
      isExternal: true
    }));

    return (
      <LinksBlock
        key={i}
        title={title}
        description={description}
        picture={image}
        smallImage={image40}
        buttons={buttons}
      />
    );
  });

export const SectionList = ({
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
  isDoubleSpacing = false
}: MediaLinksPageProps): JSX.Element => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.media(), routes.media(mediaType)];

  const mainSections = useMemo(
    () => (isSectionsArray(linksJson) ? linksJson : ensureSections(linksJson)),
    [linksJson]
  );
  const asideSections = useMemo(
    () => (isSectionsArray(asideJson) ? asideJson : ensureSections(asideJson)),
    [asideJson]
  );
  const topNavSections = useMemo(() => {
    const arr = [...mainSections, ...asideSections];
    if (arr.length > 1) {
      return (
        <div className="links-sections-nav u-spacing--half">
          {arr.map(({ id, section }, i) => (
            <Button
              key={i}
              as="a"
              url={`#${id}`}
              label={section}
              className="u-space--half--right"
              faIconClass="fas fa-level-down-alt"
              iconPosition="right"
              isExternal={false}
              lighter={true}
            />
          ))}
        </div>
      );
    }
  }, [mainSections, asideSections]);

  const asideContent =
    asideSections.length > 0 ? (
      <>
        {asideSections.length > 0 && (
          <SectionList sections={asideSections} doubleSpace={isDoubleSpacing} />
        )}
      </>
    ) : undefined;

  return (
    <>
      <PageHeaderLong title={getTitle(routes.media(mediaType))} />
      <PageSection breadcrumbsUrls={breadcrumbsUrls}>
        {topNavSections}
      </PageSection>
      <PageSection aside={asideContent} relatedPosts={relatedPosts}>
        <section className="u-spacing--double">
          <SectionList sections={mainSections} doubleSpace={isDoubleSpacing} />
        </section>
      </PageSection>
    </>
  );
};

export default MediaLinksPage;
