import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { BreadcrumbItemProps } from 'src/alps/molecules/navigation/Breadcrumbs';

export type PageMetaType = {
  title: string;
  path: string;
  description: string;
  headerImage: SanityImageSource | null;
  imageUrl: string;
  keyWords: string[];
};

export type PageMetaMap = {
  [key: string]: PageMetaType;
};

export type PageMetaProps = {
  meta?: PageMetaType;
  breadcrumbs: BreadcrumbItemProps[];
};

const PageMeta = ({ meta, breadcrumbs }: PageMetaProps) => {
  const metaTitle = useMemo(() => {
    let pageTitle = meta?.title.trim() || '';
    if (!pageTitle) {
      // generate the title based on breadcrumbs
      const items = [...breadcrumbs];
      if (items.length > 0) {
        items.shift();
        const titles = items.map((b) => b.text).reverse();
        pageTitle = titles.join(' - ');
      }
    }
    if (pageTitle) {
      pageTitle += ' - ';
    }
    return `${pageTitle}Адвентната българска мреж@`;
  }, [breadcrumbs, meta?.title]);

  const keyWords = useMemo(() => {
    if (meta?.keyWords) {
      return meta.keyWords.join(', ');
    }
    return '';
  }, [meta?.keyWords]);

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        {meta?.description && (
          <meta name="description" content={meta.description} />
        )}
        <meta name="keywords" content={keyWords} />
        {meta?.imageUrl && <meta property="image" content={meta.imageUrl} />}
      </Helmet>
    </>
  );
};
export default PageMeta;
