import { useEffect, useState, useCallback } from 'react';
import { BaseSearch } from 'alps-library/molecules/forms/elements/BaseSearch';
import { Caption } from 'alps-library/atoms/text/Caption';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { LinksData, MediaListSection } from './links/MediaLinksPage';

const Churches = () => {
  const breadcrumbsUrls = [routes.info(), routes.info('churches')];

  const [bgChurchesLinks, setBgChurchesLinks] = useState<LinksData[]>([]);
  const [filteredChurchesLinks, setFilteredChurchesLinks] = useState<
    LinksData[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetch('/json/adventis-online-churches.json')
      .then((res) => res.json())
      .then((data: LinksData[]) => {
        setBgChurchesLinks(data);
        setFilteredChurchesLinks(data);
      })
      .catch((err) => {
        console.error('Failed to load adventis-online-churches.json', err);
        setBgChurchesLinks([]);
        setFilteredChurchesLinks([]);
      });
  }, []);

  const filterLinks = useCallback(
    (query: string) => {
      const q = query?.trim().toLowerCase() || '';
      if (!q) {
        setFilteredChurchesLinks(bgChurchesLinks);
        return;
      }

      const filtered = bgChurchesLinks
        .map((section) => {
          const matchedItems = section.items.filter((item) => {
            const title = (item.title || '').toLowerCase();

            return title.includes(q);
          });

          return matchedItems.length > 0
            ? { ...section, items: matchedItems }
            : null;
        })
        .filter((s): s is LinksData => s !== null);

      setFilteredChurchesLinks(filtered);
    },
    [bgChurchesLinks]
  );

  return (
    <Page
      title="Български адвентни църкви"
      kicker={getTitle(routes.info())}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <div className="u-spacing--double">
        <Caption>
          За да намерите най-близката до вас адвентна църква, посетете{' '}
          <a
            href="https://www.adventist.bg/nameri-carkva"
            target="_blank"
            rel="noopener noreferrer"
          >
            страницата на СЦАСД
          </a>
          , където има интерактивна карта и списък с всички църкви в България.
        </Caption>

        <BaseSearch
          placeholder="Търси по гр./с./име на църква (напр. екзарх)"
          hideSearchButton
          onSearch={(e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            setSearchQuery(v);
            filterLinks(v);
          }}
          onSubmit={() => {
            return false;
          }}
        />

        {bgChurchesLinks.length > 0 && filteredChurchesLinks.length === 0 ? (
          <Caption>Няма намерени резултати.</Caption>
        ) : (
          <MediaListSection
            sections={filteredChurchesLinks}
            doubleSpace={false}
          />
        )}
      </div>
    </Page>
  );
};
export default Churches;
