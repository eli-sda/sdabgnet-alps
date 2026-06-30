import { createContext, useContext } from 'react';
import { PageMetaMap } from 'src/utils/PageMeta';

type PagesMetaDataContextType = {
  pagesMeta?: PageMetaMap;
  setPagesMeta: (pagesMeta: PageMetaMap) => void;
};

export const PagesMetaDataContext = createContext<PagesMetaDataContextType>({
  pagesMeta: undefined,
  setPagesMeta: () => {}
});

export function usePagesMetaDataContext() {
  const context = useContext(PagesMetaDataContext);

  return context;
}
