import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isEqual } from 'lodash';
import { client } from 'src/sanityClient';
import { usePageMetaDataContext } from '../contexts/PageMetaDataContext';
import { PageMetaType } from 'src/utils/PageMeta';
import { getResponsiveBackground } from 'src/utils/ImageHelper';

export function usePageMeta() {
  const { pageMeta, setPageMeta } = usePageMetaDataContext();
  const location = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (isEqual(prevPath.current, location.pathname)) return;
    prevPath.current = location.pathname;

    const fetchMeta = async () => {
      const path = location.pathname;
      const query = `*[_type == "page" && path.current == $path][0]{
      title,
      "path": path.current,
      description,
      keyWords,
      headerImage,
      image,
      "imageUrl": headerImage.asset->url
    }`;

      const data: PageMetaType = await client.fetch(query, { path });
      setPageMeta(data);
    };

    fetchMeta().catch((err) => {
      console.error('Failed to fetch meta:', err);
    });
  }, [location.pathname, setPageMeta]);

  const pageBackground = useMemo(() => {
    if (pageMeta?.headerImage) {
      return getResponsiveBackground(pageMeta.headerImage);
    }
    return undefined;
  }, [pageMeta]);

  return { pageMeta, pageBackground };
}
