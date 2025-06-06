import { ReactNode, useState } from 'react';
import { PagesMetaDataContext } from 'src/contexts/PageMetaDataContext';
import { PageMetaMap } from 'src/utils/PageMeta';

export const PagesMetaDataProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [pagesMeta, setPagesMeta] = useState<PageMetaMap>();
  return (
    <PagesMetaDataContext.Provider
      value={{
        pagesMeta,
        setPagesMeta
      }}
    >
      {children}
    </PagesMetaDataContext.Provider>
  );
};
