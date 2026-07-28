import moment from 'moment';
import { client, clientVreses } from 'src/sanityClient';
import { PageMetaMap, PageMetaType } from './PageMeta';
import {
  AdvertisementsMap,
  AdvertisementType,
  LatestAdvertisementItem
} from 'src/contexts/AdvertisementsContext';
import { AdType, AD_TYPES } from 'src/constants';
import { QuestionType } from 'src/contexts/QuestionsContext';
import {
  LinkType,
  PlaylistType,
  SeminarRelatedPresentationsType
} from 'src/contexts/PlaylistsContext';
import { DailyVerseType } from 'src/contexts/DailyVerseContext';
import { SunsetEvent } from 'src/contexts/SunsetContext';
import { CarouselAdType } from 'src/contexts/CarouselAdsContext';
import { PoetryType } from 'src/contexts/PoetryContext';
import { DictionaryType } from 'src/contexts/DictionaryContext';

export const loadPagesMeta = async (): Promise<PageMetaMap> => {
  const query = `*[_type == "page"] {
      title,
      "path": path.current,
      description,
      keyWords,
      headerImage,
      image,
      "imageUrl": headerImage.asset->url
    }`;

  // Fetch the page meta data from Sanity
  const data: PageMetaType[] = await client.fetch(query);
  const metaMap: PageMetaMap = {};

  data.forEach((meta) => {
    if (!meta.path) return;
    metaMap[meta.path] = meta;
  });
  return metaMap;
};

export const loadAdvertisements = async (): Promise<AdvertisementsMap> => {
  const adQuery = `*[_type == "advertisement"] | order(date desc) {
    _id,
    type,
    date,
    name,
    place,
    email,
    phone,
    hasViber,
    text,
    image
  }`;

  const advertisements: AdvertisementType[] = await clientVreses.fetch(adQuery);
  const adsMap: AdvertisementsMap = {};

  advertisements.forEach((ad) => {
    if (!ad.type) return;

    if (!adsMap[ad.type]) {
      adsMap[ad.type] = [];
    }

    adsMap[ad.type].push(ad);
  });

  return adsMap;
};

export const loadLatestAdvertisement = async (
  types: AdType[] = AD_TYPES
): Promise<Partial<Record<AdType, LatestAdvertisementItem>>> => {
  // Build GROQ projection for all types
  const projection = types
    .map(
      (type) =>
        `"${type}": *[_type == "advertisement" && type == "${type}"] | order(date desc)[0]{type, date, text}`
    )
    .join(',\n');

  const query = `{${projection}}`;
  const result: Partial<Record<AdType, LatestAdvertisementItem>> =
    await clientVreses.fetch(query);
  // result is an object: { type1: {type, date, text}, type2: {...}, ... }
  // Remove undefined/null values (if no ad for type)
  const filtered: Partial<Record<AdType, LatestAdvertisementItem>> = {};
  for (const type of types) {
    if (result[type]) {
      filtered[type] = result[type];
    }
  }
  return filtered;
};

export const loadHealthAdvertisements = async (): Promise<
  AdvertisementType[]
> => {
  const adQuery = `*[_type == "advertisement" && references(*[_type == "topic" && title == $topicTitle]._id)] | order(date desc) {
    _id,
    type,
    date,
    name,
    place,
    email,
    phone,
    hasViber,
    text,
    image
}`;

  const healthAdvertisements: AdvertisementType[] = await clientVreses.fetch(
    adQuery,
    { topicTitle: 'здраве' }
  );

  return healthAdvertisements;
};

export const loadQuestions = async (): Promise<QuestionType[]> => {
  const questionsQuery = `*[_type == "questionAnswer"] | order(_createdAt desc) {
   name,
   text,
   answer
}`;

  const questions: QuestionType[] = await clientVreses.fetch(questionsQuery);

  return questions;
};

export const loadPagePlaylists = async (
  pagePath: string
): Promise<PlaylistType[]> => {
  const query = `*[_type == "page" && path.current == $pagePath][0] {
    "playlists": items[]->{
      _id,
      author,
      title,
      description,
      "imageUrl": image.asset -> url,
      "items": items[_type == "reference"]->{
        _id,
        author,
        title,
        description,
        "path": select(isResource == true => ^.slug.current + "/" + fileName, true => URL),
        size,
      }
    }
  }`;

  const result: { playlists: (PlaylistType | null)[] } | null =
    await client.fetch(query, { pagePath });
  const playlists =
    result?.playlists?.filter((p): p is PlaylistType => p != null) ?? [];
  return playlists.map((p) => ({
    ...p,
    items: p.items?.filter((item) => item != null)
  }));
};

export const loadPlaylists = async (
  type: string,
  isResource?: boolean,
  title?: string
): Promise<PlaylistType[]> => {
  const titleFilter = title ? `&& title == '${title}'` : '';
  const isResourceFilter =
    isResource === true
      ? '&& isResource == true'
      : isResource === false
        ? '&& (isResource != true)'
        : '';

  const playlistQuery = `*[
    _type == "playlist"
    ${isResourceFilter}
    && type == '${type}'
    ${titleFilter}
    && count(items[_type == "reference"]) > 0
  ] | order(_createdAt desc) {
    _id,
    // isResource,
    // type,
    author,
    title,
    description,
    // keyWords,
    "imageUrl": image.asset -> url,
    "items": items[_type == "reference"]->{
      _id,
      // isResource,
      author,
      title,
      description,
      "path": select(isResource == true => ^.slug.current + "/" + fileName, true => URL),
      size,
      // keyWords
    }
  }`;

  const rawPlaylists: (PlaylistType | null)[] =
    await client.fetch(playlistQuery);
  return rawPlaylists
    .filter((p): p is PlaylistType => p != null)
    .map((p) => ({
      ...p,
      items: p.items?.filter((item) => item != null)
    }));
};

export const loadLinks = async (type: string): Promise<LinkType[]> => {
  const linkQuery = `*[
    _type == "link"
    && isResource == true
    && type == "${type}"
  ] | order(_createdAt desc) {
    _id,
    // type,
    // isResource,
    author,
    title,
    description,
    size,
    // keyWords,
    // image,
    "path": select(isResource == true => "images/" + fileName,
    true => URL
    )
  }`;

  return await client.fetch(linkQuery);
};

// Helper: filter out numeric-only and empty tags
export const filterTags = (tags?: (string | null)[] | null): string[] => {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((t) => (t == null ? '' : String(t).trim()))
    .filter((t) => t !== '' && !/^\d+$/.test(t));
};

/** Fetch all topic documents — list is managed dynamically in Sanity Studio */
export const loadAllTopics = async (): Promise<
  { _id: string; title: string }[]
> => {
  const query = `*[_type == "topic"] | order(title asc) { _id, title }`;
  return await client.fetch(query);
};

/** Topics referenced by non-resource video links */
export const loadAllVideoTopics = async (): Promise<
  { _id: string; title: string }[]
> => {
  const query = `*[_type == "topic" && _id in *[_type == "link" && type == "video" && isResource != true].topics[]._ref] | order(title asc) { _id, title }`;
  return await client.fetch(query);
};

/** Topics referenced by embedded video playlists or YouTube-link playlists */
export const loadAllPlaylistTopics = async (): Promise<
  { _id: string; title: string }[]
> => {
  const query = `*[_type == "topic" && (
    _id in *[_type == "playlist" && type == "video" && isResource != true].topics[]._ref ||
    _id in *[_type == "link" && type == "playlist" && isResource != true].topics[]._ref
  )] | order(title asc) { _id, title }`;
  return await client.fetch(query);
};

const TITLE_PREFIX_RE = /^(д-р|п-р|проф\.|професор)\s+/i;

const stripTitlePrefix = (name: string) =>
  name.replace(TITLE_PREFIX_RE, '').trim();

const normalizeAuthor = (name: string): string => {
  const match = name.match(TITLE_PREFIX_RE);
  if (!match) return name;
  const prefix = match[1].toLowerCase().replace('професор', 'проф.');
  const canonicalPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  return `${canonicalPrefix} ${stripTitlePrefix(name)}`;
};

// load authors of not resource videos
export const loadAllVideoAuthors = async (): Promise<string[]> => {
  const query = `array::unique(*[_type == "link" && type == "video" && isResource != true && defined(author) && author != ""].author)`;
  const authors: string[] = await client.fetch(query);
  // Normalize prefix casing and deduplicate (e.g. "д-р X" and "Д-р X" → "Д-р X")
  const seen = new Map<string, string>();
  for (const a of authors) {
    const normalized = normalizeAuthor(a);
    const key = normalized.toLowerCase();
    if (!seen.has(key)) seen.set(key, normalized);
  }
  return [...seen.values()].sort((a, b) =>
    stripTitlePrefix(a).localeCompare(stripTitlePrefix(b), 'bg')
  );
};

const collator = new Intl.Collator('bg', {
  numeric: true,
  sensitivity: 'base'
});

export const loadVideosByFilters = async (
  topicIds: string[],
  author: string,
  text: string
): Promise<LinkType[]> => {
  const filterParts: string[] = [
    '_type == "link"',
    'type == "video"',
    'isResource != true'
  ];
  const params: Record<string, unknown> = {};

  if (topicIds.length > 0) {
    filterParts.push('count(topics[_ref in $topicIds]) > 0');
    params.topicIds = topicIds;
  }
  if (author) {
    filterParts.push('lower(coalesce(author, "")) == lower($author)');
    params.author = author;
  }
  if (text) {
    filterParts.push(
      '(lower(coalesce(title, "")) match $textPattern || lower(coalesce(description, "")) match $textPattern)'
    );
    params.textPattern = `*${text.toLowerCase()}*`;
  }

  const linkQuery = `*[
    ${filterParts.join('\n    && ')}
  ] | order(title asc) {
    _id,
    title,
    size,
    isResource,
    keyWords,
    author,
    description,
    "topics": topics[]->{ _id, title },
    "playlistId": *[_type == 'playlist' && defined(^.keyWords[0]) && title == ^.keyWords[0]][0]._id,
    "path": URL
  }`;

  const results: LinkType[] = await client.fetch(linkQuery, params);
  return results
    .map((link) => {
      const filtered = filterTags(link.keyWords as string[] | null);
      return {
        ...link,
        keyWords: filtered.length ? filtered : null
      } as LinkType;
    })
    .sort((a, b) => collator.compare(a.title, b.title));
};

export const loadAllPlaylistAuthors = async (): Promise<string[]> => {
  // Authors from embedded playlists
  const embeddedQuery = `array::unique(*[_type == "playlist" && type == "video" && isResource != true && defined(author) && author != ""].author)`;
  // Authors from YouTube-link playlists
  const ytQuery = `array::unique(*[_type == "link" && type == "playlist" && isResource != true && defined(author) && author != ""].author)`;

  const [embedded, yt] = await Promise.all([
    client.fetch<string[]>(embeddedQuery),
    client.fetch<string[]>(ytQuery)
  ]);

  const seen = new Map<string, string>();
  for (const a of [...embedded, ...yt]) {
    const normalized = normalizeAuthor(a);
    const key = normalized.toLowerCase();
    if (!seen.has(key)) seen.set(key, normalized);
  }
  return [...seen.values()].sort((a, b) =>
    stripTitlePrefix(a).localeCompare(stripTitlePrefix(b), 'bg')
  );
};

export type PlaylistSearchResults = {
  embedded: PlaylistType[];
  ytLinks: LinkType[];
};

export const loadPlaylistsByFilters = async (
  topicIds: string[],
  author: string,
  text: string
): Promise<PlaylistSearchResults> => {
  const topicFilter =
    topicIds.length > 0 ? '&& count(topics[_ref in $topicIds]) > 0' : '';
  const authorFilter = author
    ? '&& lower(coalesce(author, "")) == lower($author)'
    : '';
  const textFilter = text
    ? '&& (lower(coalesce(title, "")) match $textPattern || lower(coalesce(description, "")) match $textPattern)'
    : '';
  const params: Record<string, unknown> = {};
  if (topicIds.length > 0) params.topicIds = topicIds;
  if (author) params.author = author;
  if (text) params.textPattern = `*${text.toLowerCase()}*`;

  const embeddedQuery = `*[
    _type == "playlist"
    && type == "video"
    && isResource != true
    && count(items[_type == "reference"]) > 0
    ${topicFilter}
    ${authorFilter}
    ${textFilter}
  ] | order(title asc) {
    _id,
    author,
    title,
    description,
    "imageUrl": image.asset -> url,
    "topics": topics[]->{ _id, title },
    "items": items[_type == "reference"]->{_id, author, title, description, "path": URL, size}
  }`;

  const ytQuery = `*[
    _type == "link"
    && type == "playlist"
    && isResource != true
    ${topicFilter}
    ${authorFilter}
    ${textFilter}
  ] | order(title asc) {
    _id,
    title,
    description,
    author,
    "topics": topics[]->{ _id, title },
    "path": URL
  }`;

  const [embedded, ytLinks] = await Promise.all([
    client.fetch<PlaylistType[]>(embeddedQuery, params),
    client.fetch<LinkType[]>(ytQuery, params)
  ]);

  return { embedded, ytLinks };
};

export const loadSeminarRelatedPresentations = async (): Promise<
  SeminarRelatedPresentationsType[]
> => {
  const presentationsQuery = `*[
      _type == "playlist"
      && type == "presentations"
      && title in *[_type == "playlist" && type == "seminars"].title
    ]{
      _id,
      title
    }`;

  return await client.fetch(presentationsQuery);
};

export const loadPoetry = async (): Promise<PoetryType[]> => {
  const poetryQuery = `*[_type == "poetry"] | order(_createdAt desc) {
  title,
  author,
  date,
  text
  }`;

  const poetry: PoetryType[] = await clientVreses.fetch(poetryQuery);

  return poetry;
};

export const loadCarouselAds = async (): Promise<CarouselAdType[]> => {
  const carouselAdsQuery = `*[_type == "carouselAd"] | order(_createdAt desc) {
   title,
   description,
   image,
   buttonLabel,
   url
}`;

  const carouselAds: CarouselAdType[] = await client.fetch(carouselAdsQuery);

  return carouselAds;
};

export const loadDailyVerse = async (date: string): Promise<DailyVerseType> => {
  const dailyVerseQuery = `*[
    _type=='verse'
    && date == $date][0] {
    date,
    title,
    text,
    verse,
    comment,
    halfYear->{author, title}
  }`;

  return await clientVreses.fetch(dailyVerseQuery, { date });
};

export const loadDictionary = async (): Promise<DictionaryType[]> => {
  const dictionaryQuery = `*[_type == "dictionary"] {
    _id,
    topic,
    EGW_comments,
    verses
}`;

  return await clientVreses.fetch(dictionaryQuery);
};

/**
 * Load sunset times for all Fridays and Saturdays in the month of the provided date.
 * @param monthDate ISO date string (e.g. '2025-11-01') or Date object representing a day in target month
 * @param lat latitude
 * @param lng longitude
 */
interface SunsetApiResponse {
  results: { sunset: string };
  status: string;
}

export const loadSunset = async (
  fetchDates: moment.Moment[],
  lat: number,
  lng: number
): Promise<SunsetEvent[]> => {
  const results = await Promise.all(
    fetchDates.map((date) => {
      const apiUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${date.format(
        'YYYY-MM-DD'
      )}&formatted=0`;
      return fetch(apiUrl)
        .then((res) => res.json())
        .then((json: SunsetApiResponse) => ({ date, json }))
        .catch(
          () =>
            ({ date, json: null }) as {
              date: moment.Moment;
              json: SunsetApiResponse | null;
            }
        );
    })
  );

  const evts: { title: string; start: string; end: string }[] = [];
  for (const r of results) {
    if (!r.json || r.json.status !== 'OK') continue;
    const sunset = moment(r.json.results.sunset).format('HH:mm');
    const parts = sunset.split(':').map(Number);
    const start = r.date.clone().hour(parts[0]).minute(parts[1]);
    evts.push({
      title: `${sunset}ч.`,
      start: start.toISOString(),
      end: start.toISOString()
    });
  }

  return evts;
};

// Validate URL to prevent open redirect vulnerability
export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    // Allow only http/https protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      console.warn(
        `URL blocked: Invalid protocol "${parsedUrl.protocol}" for URL: ${url}`
      );
      return false;
    }

    // Allow relative URLs (same origin)
    if (parsedUrl.origin === window.location.origin) {
      return true;
    }

    // Whitelist of allowed external domains for donations and related content
    const allowedDomains = [
      'sdabg.net',
      'adra.bg',
      'asi-bg.org',
      'radiosvetlina.org',
      'ltv.bg',
      'lifeinhope.com',
      'zdravencentarmedovo.com',
      'healthcare-bg.com',
      'yanikabg.com',
      'facebook.com'
    ];

    const isAllowed = allowedDomains.some(
      (domain) =>
        parsedUrl.hostname === domain ||
        parsedUrl.hostname.endsWith('.' + domain)
    );

    if (!isAllowed) {
      console.warn(
        `URL blocked: Domain "${parsedUrl.hostname}" is not in whitelist. URL: ${url}`
      );
    }

    return isAllowed;
  } catch {
    console.warn(`URL blocked: Invalid URL format: ${url}`);
    return false;
  }
};
