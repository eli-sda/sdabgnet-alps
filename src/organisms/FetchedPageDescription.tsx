/**
 * Fetching meta description from external URL (not working with facebook URLs)
 * and show it in the component.
 */

import { useEffect, useMemo, useState } from 'react';

import { fetchMetaDescription } from 'src/utils/ExternalPageDescription';
import { Definition } from 'alps-library/atoms/lists/definition/Definition';

export const FetchedPageDescription = ({ pageURL }: { pageURL: string }) => {
  const [metaDescription, setMetaDescription] = useState<string>('');

  //for testing fetching meta description from external URL
  useEffect(() => {
    const fetchDescription = async () => {
      const result = await fetchMetaDescription(pageURL);
      console.log(result.description);
      setMetaDescription(result.description || ' ');
    };
    void fetchDescription();
  }, [pageURL]);

  const items = useMemo(() => {
    return [
      {
        title: `Description by URL ${pageURL}`,
        text: metaDescription
      }
    ];
  }, [pageURL, metaDescription]);

  return metaDescription && <Definition items={items} />;
};
