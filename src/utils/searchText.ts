/** Escapes a string so it can be used literally inside a RegExp. */
export const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Builds a case-insensitive word-start pattern for a search term, so it matches standalone and inflected forms (e.g. рак, ракът, рака) but not words containing it later (характер). */
export const wordStartPattern = (term: string): string =>
  `(?<![\\p{L}\\p{N}_])${escapeRegExp(term)}`;

/** Tests whether a term appears at the start of a word in the given text. */
export const matchesWordStart = (
  value: string | null | undefined,
  term: string
): boolean => {
  const trimmed = term.trim();
  if (!value || !trimmed) return false;
  return new RegExp(wordStartPattern(trimmed), 'iu').test(value);
};