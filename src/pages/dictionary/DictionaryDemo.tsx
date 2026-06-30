import { useState, useEffect } from 'react';
import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import { DictionaryType } from 'src/contexts/DictionaryContext';
import { DictionaryList } from './DictionaryList';

export const DictionaryDemo = (): JSX.Element => {
  const [dictionaryData, setDictionaryData] = useState<DictionaryType[]>([]);

  useEffect(() => {
    fetch('/json/dictionary.json')
      .then((res) => res.json())
      .then((data: DictionaryType[]) => {
        data.sort((a, b) => a.topic.localeCompare(b.topic, 'bg'));
        setDictionaryData(data);
      })
      .catch((err) => {
        console.error('Failed to load dictionary.json', err);
        setDictionaryData([]);
      });
  }, []);

  return (
    <section id="dictionary-demo" className="u-spacing">
      <HeadingBlock title="Демо Речник" />
      <DictionaryList items={dictionaryData} itemsPerPage={10} />
    </section>
  );
};
