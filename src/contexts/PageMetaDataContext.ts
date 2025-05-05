import { createContext, useContext } from 'react';
import { PageMetaType } from 'src/utils/PageMeta';

type PageMetaDataContextType = {
  pageMeta: PageMetaType | undefined;
  setPageMeta: (pageMeta: PageMetaType) => void;
};

export const PageMetaDataContext = createContext<PageMetaDataContextType>({
  pageMeta: undefined,
  setPageMeta: () => {}
});

export function usePageMetaDataContext() {
  const context = useContext(PageMetaDataContext);

  return context;
}
