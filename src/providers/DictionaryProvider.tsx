import { ReactNode, useState } from 'react';
import {
  DictionaryContext,
  DictionaryType
} from 'src/contexts/DictionaryContext';

export const DictionaryProvider = ({ children }: { children: ReactNode }) => {
  const [dictionary, setDictionary] = useState<DictionaryType[]>();
  const [lastLoaded, setLastLoaded] = useState<string>();

  return (
    <DictionaryContext.Provider
      value={{
        dictionary,
        setDictionary,
        lastLoaded,
        setLastLoaded
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};
