import { createContext, useContext } from 'react';

export type PoetryType = {
  title: string;
  author?: string;
  date?: string;
  text: string;
};

export type PoetryContextType = {
  poetry: PoetryType[] | undefined;
  setPoetry: (poetry: PoetryType[]) => void;
  lastLoaded: string | undefined;
  setLastLoaded: (date: string) => void;
};

export const PoetryContext = createContext<PoetryContextType>({
  poetry: undefined,
  setPoetry: () => {},
  lastLoaded: undefined,
  setLastLoaded: () => {}
});

export function usePoetryContext() {
  const context = useContext(PoetryContext);

  return context;
}
