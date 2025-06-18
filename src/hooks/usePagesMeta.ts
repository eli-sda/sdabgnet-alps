import { useCallback, useEffect, useMemo } from 'react';
import { usePagesMetaDataContext } from '../contexts/PagesMetaDataContext';
import { PageMetaType } from 'src/utils/PageMeta';
import { getResponsiveBackground } from 'src/utils/ImageHelper';
import { useLocation } from 'react-router-dom';
import { loadPagesMeta } from 'src/utils/FetchHelper';

export function usePagesMeta() {
  const { pagesMeta, setPagesMeta } = usePagesMetaDataContext();
  const location = useLocation();

  useEffect(() => {
    // Use a global variable to ensure only one fetch per session
    if ((window as unknown as { __PAGES_META_LOADED__?: boolean }).__PAGES_META_LOADED__) return;
    (window as unknown as { __PAGES_META_LOADED__?: boolean }).__PAGES_META_LOADED__ = true;

    if (!pagesMeta) {
      loadPagesMeta()
        .then((metaMap) => {
          setPagesMeta(metaMap);
        })
        .catch((err) => {
          console.error('Failed to fetch pages meta:', err);
        });
    }
  }, [pagesMeta, setPagesMeta]);

  const pageMeta: PageMetaType | null = useMemo(() => {
    let path = location.pathname;
    // for SS lesson the path is by year and quarter (like /church_life/lesson-cq/2023/1)
    // when the path is like /church_life/lesson-cq/2023/1/12
    const match = path.match(
      /(\/church_life\/lesson(?:-cq|-cc)?\/\d+\/\d+)\/\d+$/
    );
    if (match) {
      path = match[1];
    }
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
