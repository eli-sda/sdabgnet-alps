import { useMemo } from 'react';
import { iconConfig } from 'alps-library/atoms/icons/_config';
import { IconWrap } from 'alps-library/atoms/icons/IconWrap';
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
  linksJson: LinkGroup[];
  linksTitle?: string;
  asideJson?: LinkGroup[];
  asideTitle?: string;
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

type LinksData = {
  section: string;
  id: string;
  items: LinkGroup[];
};

const faIcons: Record<string, string> = {
  сайт: 'globe',
  facebook: 'facebook',
  youtube: 'youtube',
  instagram: 'instagram'
};

const alpsIcons: Record<string, keyof typeof iconConfig.iconNamesMap> = {
  'tik tok': 'tiktok'
};

const getFaIcon = (type: string) => faIcons[type];
const getAlpsIcon = (type: string) => alpsIcons[type];

const ensureSections = (
  data: unknown,
  defaultTitle = 'Линкове'
): LinksData[] => {
  if (!data) return [];

  if (Array.isArray(data) && data.length) {
    if ('section' in data[0]) {
      return (data as LinksData[]).map((section, i) => ({
        ...section,
        id: section.id || `section-${i}`
      }));
    } else {
      return [
        {
          section: defaultTitle,
          id: 'links',
          items: data as LinkGroup[]
        }
      ];
    }
  }

  return [];
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
  linksTitle = '',
  asideJson = [],
  asideTitle = '',
  isDoubleSpacing = false
}: MediaLinksPageProps): JSX.Element => {
  useScrollToHash();

  const breadcrumbsUrls = [routes.media(), routes.media(mediaType)];

  const mainSections = useMemo(
    () => ensureSections(linksJson, linksTitle),
    [linksJson, linksTitle]
  );
  const asideSections = useMemo(
    () => ensureSections(asideJson, asideTitle),
    [asideJson, asideTitle]
  );
  const topNavSections = useMemo(
    () => [...mainSections, ...asideSections],
    [mainSections, asideSections]
  );

  const showAsideTitle = Boolean(
    asideTitle &&
      !(asideSections.length === 1 && asideSections[0].section === asideTitle)
  );

  return (
    <>
      <PageHeaderLong title={getTitle(routes.media(mediaType))} />
      <PageSection breadcrumbsUrls={breadcrumbsUrls}>
        {topNavSections.length > 1 && (
          <div className="links-sections-nav u-spacing--half">
            {topNavSections.map(({ id, section }) => (
              <a
                key={id}
                href={`#${id}`}
                className="o-button o-button--lighter u-space--half--right"
              >
                {section}
                <IconWrap
                  name="arrow-long-right"
                  className="u-space--half--left"
                />
              </a>
            ))}
          </div>
        )}
      </PageSection>
      <PageSection
        aside={
          asideSections.length > 0 && (
            <>
              {showAsideTitle && <HeadingBlock title={asideTitle} />}
              <SectionList
                sections={asideSections}
                doubleSpace={isDoubleSpacing}
              />
            </>
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
