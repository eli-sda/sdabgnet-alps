import { createContext, useContext } from 'react';

export type DictionaryType = {
  _id: string;
  topic: string;
  EGW_comments: string;
  verses: string[];
};

export type DictionaryContextType = {
  dictionary: DictionaryType[] | undefined;
  setDictionary: (dictionary: DictionaryType[]) => void;
  lastLoaded: string | undefined;
  setLastLoaded: (date: string) => void;
};

export const DictionaryContext = createContext<DictionaryContextType>({
  dictionary: undefined,
  setDictionary: () => {},
  lastLoaded: undefined,
  setLastLoaded: () => {}
});

export function useDictionaryContext() {
  const context = useContext(DictionaryContext);

  return context;
}
