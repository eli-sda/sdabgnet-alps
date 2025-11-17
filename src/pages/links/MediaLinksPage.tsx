import { useMemo } from 'react';
import { iconConfig } from 'alps-library/atoms/icons/_config';
import { PageHeaderLong } from 'alps-library/organisms/sections/pageHeaderLong/PageHeaderLong';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import routes from 'src/routes';
import { MediaType } from 'src/constants';
import { PageSection } from 'src/organisms/PageSection';
import { getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { LinksBlock } from './LinksBlock';

interface MediaLinksPageProps {
  mediaType: MediaType;
  linksJson: LinkGroup[] | LinksData[];
  asideJson?: LinkGroup[] | LinksData[];
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

const faIcons: Record<string, string> = {
  сайт: 'globe',
  facebook: 'facebook',
  youtube: 'youtube',
  instagram: 'instagram',
  'google play': 'android',
  'app store': 'apple'
};

const alpsIcons: Record<string, keyof typeof iconConfig.iconNamesMap> = {
  'tik tok': 'tiktok'
};

const getFaIcon = (type: string) => faIcons[type];
const getAlpsIcon = (type: string) => alpsIcons[type];

const isSectionsArray = (
  data: LinkGroup[] | LinksData[]
): data is LinksData[] => {
  return data.length > 0 && 'section' in data[0];
};

const ensureSections = (data: LinkGroup[], defaultTitle = ''): LinksData[] => {
  if (!data || data.length === 0) return [];

  return [
    {
      section: defaultTitle,
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
      faIcon: getFaIcon(type),
      icon: getAlpsIcon(type),
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

const SectionList = ({
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
          {arr.map(({ id, section }) => (
            <a
              key={id}
              href={`#${id}`}
              className="o-button o-button--lighter u-space--half--right"
            >
              {section}
              <i
                className="fa fa-level-down u-space--half--left"
                aria-hidden="true"
              ></i>
            </a>
          ))}
        </div>
      );
    }
    return <></>;
  }, [mainSections, asideSections]);

  return (
    <>
      <PageHeaderLong title={getTitle(routes.media(mediaType))} />
      <PageSection breadcrumbsUrls={breadcrumbsUrls}>
        {topNavSections}
      </PageSection>
      <PageSection
        aside={
          asideSections.length > 0 && (
            <SectionList
              sections={asideSections}
              doubleSpace={isDoubleSpacing}
            />
          )
        }
      >
        <section className="u-spacing--double">
          <SectionList sections={mainSections} doubleSpace={isDoubleSpacing} />
        </section>
      </PageSection>
    </>
  );
};

export default MediaLinksPage;
