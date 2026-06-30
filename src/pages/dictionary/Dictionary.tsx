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
            В Библията „Духът на пророчеството“ е посочен като един от
            специалните дарове, чрез които Бог ръководи, насърчава и предпазва
            Своя народ. Писанията на Елън Г. Уайт не заместват Свещеното
            Писание, а служат като светлина, която ни води обратно към него. В
            този списък ще откриете вдъхновени мисли и коментари по ключови
            библейски теми, чиято цел е да обогатят личното ви изследване и да
            ви дадат практични насоки за вярата в ежедневието.
          </p>
          <p>
            <i>
              Речникът расте с помощта на доброволци. Ако искате да участвате,{' '}
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
