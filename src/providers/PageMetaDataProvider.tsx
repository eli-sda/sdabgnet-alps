import { ReactNode, useState } from 'react';
import { PageMetaDataContext } from 'src/contexts/PageMetaDataContext';
import { PageMetaType } from 'src/utils/PageMeta';

export const PageMetaDataProvider = ({ children }: { children: ReactNode }) => {
  const [pageMeta, setPageMeta] = useState<PageMetaType>();
  return (
    <PageMetaDataContext.Provider
      value={{
        pageMeta,
        setPageMeta
      }}
    >
      {children}
    </PageMetaDataContext.Provider>
  );
};
