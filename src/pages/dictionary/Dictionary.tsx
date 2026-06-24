import { useState, useMemo, useEffect } from 'react';
import { Button } from 'src/alps/atoms/Button';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { DictionaryType } from 'src/contexts/DictionaryContext';
import { getTitle } from 'src/utils/Navigation';
import { useDictionary } from 'src/hooks/useDictionary';
import { DictionaryList } from './DictionaryList';
import './Dictionary.scss';

const Dictionary = (): JSX.Element => {
  const breadcrumbsUrls = [routes.info(), routes.info('dictionary')];

  const [dictionaryData, setDictionaryData] = useState<DictionaryType[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

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

  const availableLetters = useMemo(() => {
    const letters = new Set(
      dictionaryData.map((item) => item.topic.charAt(0).toUpperCase())
    );
    return Array.from(letters).sort((a, b) => a.localeCompare(b, 'bg'));
  }, [dictionaryData]);

  const filteredTopics = useMemo(() => {
    if (!selectedLetter) {
      return dictionaryData;
    }

    return dictionaryData.filter((item) =>
      item.topic.toUpperCase().startsWith(selectedLetter)
    );
  }, [dictionaryData, selectedLetter]);

  const handleLetterClick = (letter: string | null) => {
    setSelectedLetter(letter);
  };

  return (
    <Page
      title={getTitle(routes.info('dictionary'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <div className="dictionary-page">
        <p className='u-color--black'>
          В Библията „Духът на пророчеството“ е посочен като един от специалните
          дарове, чрез които Бог ръководи, насърчава и предпазва Своя народ.
          Писанията на Елън Г. Уайт не заместват Свещеното Писание, а служат
          като светлина, която ни води обратно към него. В този списък ще
          откриете вдъхновени мисли и коментари по ключови библейски теми, чиято
          цел е да обогатят личното ви изследване и да ви дадат практични насоки
          за вярата в ежедневието.
        </p>

        <div
          id="dictionary-tabs"
          className="dictionary-tabs u-padding u-space--bottom"
        >
          <Button
            onClick={() => handleLetterClick(null)}
            className={`dictionary-tab-btn ${selectedLetter === null ? 'is-active' : ''}`}
            label="Всички"
          />
          {availableLetters.map((letter) => (
            <Button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={`dictionary-tab-btn ${selectedLetter === letter ? 'is-active' : ''}`}
              label={letter}
            />
          ))}
        </div>

        <DictionaryList key={selectedLetter || 'all'} items={filteredTopics} />
      </div>
    </Page>
  );
};

export default Dictionary;
