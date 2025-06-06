import { useCallback, useEffect, useMemo, useRef } from 'react';
import { usePagesMetaDataContext } from '../contexts/PageMetaDataContext';
import { PageMetaType } from 'src/utils/PageMeta';
import { getResponsiveBackground } from 'src/utils/ImageHelper';
import { useLocation } from 'react-router-dom';
import { loadPagesMeta } from 'src/utils/FetchHelper';

export function usePagesMeta() {
  const { pagesMeta, setPagesMeta } = usePagesMetaDataContext();
  const location = useLocation();
  const isLoaded = useRef<boolean>(false);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    if (!pagesMeta) {
      loadPagesMeta()
        .then((metaMap) => {
          setPagesMeta(metaMap);
        })
        .catch((err) => {
          console.error('Failed to fetch pages meta:', err);
        });
    }
  });

  const pageMeta: PageMetaType | null = useMemo(() => {
    const path = location.pathname;
    return pagesMeta && path ? pagesMeta[path] || pagesMeta['/'] : null;
  }, [pagesMeta, location.pathname]);

  const getMetaMap = useCallback(
    (paths: string[]) => {
      if (!pagesMeta) return {};

      const map: Record<string, PageMetaType> = {};
      paths.forEach((path) => {
        if (pagesMeta[path]) {
          map[path] = pagesMeta[path];
        }
      });
      return map;
    },
    [pagesMeta]
  );

  const pageBackground = useMemo(() => {
    if (pageMeta?.headerImage) {
      return getResponsiveBackground(pageMeta.headerImage);
    }
    return undefined;
  }, [pageMeta]);

  return { pageMeta, getMetaMap, pageBackground };
}
