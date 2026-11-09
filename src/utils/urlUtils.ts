interface ShareUrlParams {
  id: string;
  title?: string;
  path?: string;
}

// Unicode letters/numbers and the RFC 3986 unreserved characters stay readable
// (including Cyrillic). `[`/`]` are technically reserved but are kept readable
// too; everything else, including quotes, is percent-encoded so messengers do
// not cut the link.
const SAFE_QUERY_CHAR = /[\p{L}\p{N}\-._~[\]]/u;

/**
 * Encodes a query key/value so it stays valid while Cyrillic remains readable.
 * Spaces become `+`; reserved characters (`&`, `=`, `#`, `?`, `+`, `%`, ...)
 * are still percent-encoded, so they cannot break the query.
 */
const encodeReadableQueryValue = (value: string): string =>
  Array.from(value)
    .map((char) => {
      if (char === ' ') return '+';
      if (SAFE_QUERY_CHAR.test(char)) return char;
      return encodeURIComponent(char);
    })
    .join('');

const serializeReadableEntries = (
  entries: Iterable<[string, string]>
): string =>
  Array.from(entries)
    .map(
      ([key, value]) =>
        `${encodeReadableQueryValue(key)}=${encodeReadableQueryValue(value)}`
    )
    .join('&');

/** Serializes URLSearchParams as `key=value&...` without encoding Cyrillic. */
export const serializeReadableParams = (params: URLSearchParams): string =>
  serializeReadableEntries(params.entries());

const serializeReadableRecord = (params: Record<string, string>): string =>
  serializeReadableEntries(Object.entries(params));

/** Builds a URL with readable query params and an optional hash. */
export const buildReadableUrl = (
  base: string,
  params: Record<string, string>,
  hash?: string
): string => {
  const query = serializeReadableRecord(params);
  return `${base}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
};

export const generateShareUrl = ({ id, title }: ShareUrlParams): string => {
  const params: Record<string, string> = {};
  if (title) params.title = title;

  return buildReadableUrl(
    `${window.location.origin}${window.location.pathname}`,
    params,
    id
  );
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
