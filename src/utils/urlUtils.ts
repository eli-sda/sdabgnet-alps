interface ShareUrlParams {
  id: string;
  title?: string;
  path?: string;
}

export const generateShareUrl = ({
  id,
  title,
  path
}: ShareUrlParams): string => {
  const currentPath = path || window.location.pathname;
  const baseUrl = `${window.location.origin}${currentPath}`;
  const url = new URL(baseUrl);

  if (title) {
    url.searchParams.set('title', title);
  }

  url.hash = id;

  return url.toString();
};

/**
 * Checks if a given hash from the URL matches the ID of any item in an array.
 */
export const hasMatchingItemHash = <T extends Record<string, unknown>>(
  items: T[] | undefined | null,
  hash: string,
  idKey: keyof T = '_id'
): boolean => {
  if (!items || !items.length || !hash) return false;

  const targetHashId = hash.replace('#', '');
  return items.some((item) => item[idKey] === targetHashId);
};
