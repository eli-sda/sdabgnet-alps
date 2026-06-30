import { useState, useEffect } from 'react';
import routes from 'src/routes';
import { PARTICIPATE_FORM_URL } from 'src/constants';
import { Page } from 'src/organisms/Page';
import { DictionaryType } from 'src/contexts/DictionaryContext';
import { getTitle } from 'src/utils/Navigation';
import { useDictionary } from 'src/hooks/useDictionary';
import { DictionaryList } from './DictionaryList';

const Dictionary = (): JSX.Element => {
  const breadcrumbsUrls = [routes.info(), routes.info('dictionary')];

  const [dictionaryData, setDictionaryData] = useState<DictionaryType[]>([]);

  const { getDictionary } = useDictionary();

  useEffect(() => {
    getDictionary()
      .then((data: DictionaryType[]) => {
        setDictionaryData(data);
      })
      .catch((err) => {
        console.error('Failed to load dictionary:', err);
      });
  }, [getDictionary]);

  return (
    <Page
      title={getTitle(routes.info('dictionary'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <div className="dictionary-page">
        <section className="u-spacing--half text">
          <p>
            „Духът на пророчеството“ е духовен дар, проявен в писанията на Елън
            Г. Уайт, чрез който Бог дава напътствия на Своя народ. Тук ще
            намерите цитати от нейните книги по различни теми, заедно с
            библейски препратки към съответните стихове. <br />
            Използвайте азбучния филтър, за да изберете тема.
          </p>
          <p>
            <i>
              Справочникът се допълва с помощта на доброволци. Ако желаете да
              участвате,{' '}
              <a
                href={PARTICIPATE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                попълнете този формуляр
              </a>
              .
            </i>
          </p>
        </section>

        <DictionaryList items={dictionaryData} />
      </div>
    </Page>
  );
};

export default Dictionary;
