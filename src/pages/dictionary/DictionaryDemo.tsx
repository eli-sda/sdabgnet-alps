import { useState, useEffect } from 'react';
import { DictionaryType } from 'src/contexts/DictionaryContext';
import { DictionaryList } from './DictionaryList';

export const DictionaryDemo = (): JSX.Element => {
  const [dictionaryData, setDictionaryData] = useState<DictionaryType[]>([]);

  useEffect(() => {
    fetch('/json/dictionary.json')
      .then((res) => res.json())
      .then((data: DictionaryType[]) => {
        setDictionaryData(data);
      })
      .catch((err) => {
        console.error('Failed to load dictionary.json', err);
        setDictionaryData([]);
      });
  }, []);

  return <DictionaryList items={dictionaryData} />;
};
