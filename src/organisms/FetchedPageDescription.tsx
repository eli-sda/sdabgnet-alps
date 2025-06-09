/**
 * Fetching meta description from external URL (not working with facebook URLs)
 * and show it in the component.
 */

import { useEffect, useState } from 'react';
// import IconsColorsSizes from '../atoms/IconsColorsSizes';

import { fetchMetaDescription } from 'src/utils/ExternalPageDescription';

export const FetchedPageDescription = ({ pageURL }: { pageURL: string }) => {
  const [metaDescription, setMetaDescription] = useState<string>('');

  //for testing fetching meta description from external URL
  useEffect(() => {
    const fetchDescription = async () => {
      const result = await fetchMetaDescription(pageURL);
      console.log(result.description);
      setMetaDescription(result.description || '');
    };
    void fetchDescription();
  }, [pageURL]);

  return (
    <>
      <div>Description by URL {pageURL}</div>
      <div>{metaDescription}</div>
    </>
  );
};
