import { useEffect, useState } from 'react';
import { BaseSearch } from 'alps-library/molecules/forms/elements/BaseSearch';
import { Caption } from 'alps-library/atoms/text/Caption';
import routes from 'src/routes';
import { getTitle } from 'src/utils/Navigation';
import { filterSectionedData } from 'src/utils/filterHelpers';
import MediaLinksPage, { LinkGroup } from './MediaLinksPage';

const AdventistsOnline = (): JSX.Element => {
  const [bgLinks, setBgLinks] = useState<LinkGroup[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<LinkGroup[]>([]);

  useEffect(() => {
    fetch('/json/adventists-online.json')
      .then((res) => res.json())
      .then((data: LinkGroup[]) => {
        setBgLinks(data);
        setFilteredLinks(data);
      })
      .catch((err) => {
        console.error('Failed to load adventists-online.json', err);
        setBgLinks([]);
        setFilteredLinks([]);
      });
  }, []);

  return (
    <MediaLinksPage
      mediaType="bg-links"
      linksJson={filteredLinks}
      relatedPosts={{
        heading: 'Други връзки',
        blocks: [
          {
            title: 'Български адвентни църкви в мрежата',
            url: routes.info('churches'),
            category: getTitle(routes.info())
          },
          {
            title: getTitle(routes.media('institutions')),
            url: routes.media('institutions'),
            category: getTitle(routes.media())
          },
          {
            title: getTitle(routes.media('links')),
            url: routes.media('links'),
            category: getTitle(routes.media())
          }
        ]
      }}
    >
      <div>
        <BaseSearch
          placeholder="Търси по заглавие или описание"
          hideSearchButton
          onSearch={(e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            setFilteredLinks(
              filterSectionedData(bgLinks, v, ['title', 'description'])
            );
          }}
          onSubmit={() => false}
        />

        {bgLinks.length > 0 && filteredLinks.length === 0 && (
          <Caption>Няма намерени резултати.</Caption>
        )}
      </div>
    </MediaLinksPage>
  );
};

export default AdventistsOnline;
