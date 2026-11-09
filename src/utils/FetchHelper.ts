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
import {
  PlaylistIndexItem,
  VideoIndexItem
} from 'src/contexts/VideotekaContext';

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
  titles?: string[]
): Promise<PlaylistType[]> => {
  const titleFilter = titles?.length
    ? `&& title in [${titles.map((title) => `"${title}"`).join(', ')}]`
    : '';
  const isResourceFilter =
    isResource === undefined
      ? ''
      : `&& isResource ${isResource ? '==' : '!='} true`;

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
    _id in *[_type == "playlist" && (type == "video" || type == "video-book") && isResource != true].topics[]._ref ||
    _id in *[_type == "link" && type == "playlist" && isResource != true].topics[]._ref
  )] | order(title asc) { _id, title }`;
  return await client.fetch(query);
};

const TITLE_PREFIX_RE = /^(д-р|п-р|проф\.|професор)\s+/i;

const stripTitlePrefix = (name: string) =>
  name.replace(TITLE_PREFIX_RE, '').trim();

const normalizeAuthor = (name: string): string => {
  const match = new RegExp(TITLE_PREFIX_RE).exec(name);
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

/**
 * Fetches only the fields needed to sort, group and paginate videos. The full
 * documents for the current page are loaded separately with `loadVideosByIds`,
 * so a search over 1000+ videos does not download every description/topic.
 */
export const loadVideoSearchIndex = async (
  topicIds: string[],
  author: string,
  text: string
): Promise<VideoIndexItem[]> => {
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
    filterParts.push('lower(coalesce(author, "")) match $authorPattern');
    params.authorPattern = `*${author.toLowerCase()}*`;
  }
  if (text) {
    // A trailing wildcard makes GROQ match the term only at the start of a
    // word, replacing the client-side word-start filter.
    filterParts.push(
      '(lower(coalesce(title, "")) match $textPattern || lower(coalesce(description, "")) match $textPattern)'
    );
    params.textPattern = `${text.toLowerCase()}*`;
  }

  // Small fields only: id/title for sorting, plus the playlist reference and
  // name so videos of the same playlist stay together across pages.
  const query = `*[
    ${filterParts.join('\n    && ')}
  ] | order(title asc) {
    _id,
    title,
    "playlistId": *[_type == 'playlist' && defined(^.keyWords[0]) && title == ^.keyWords[0]][0]._id,
    "playlistName": keyWords[0]
  }`;

  return await client.fetch<VideoIndexItem[]>(query, params);
};

/** Fetches the full video documents for one page of results. */
export const loadVideosByIds = async (ids: string[]): Promise<LinkType[]> => {
  if (ids.length === 0) return [];

  // Full documents for just one page of ids; the fields match what
  // VideoLinkBlock and the player need.
  const query = `*[
    _type == "link"
    && type == "video"
    && _id in $ids
  ] {
    _id,
    title,
    author,
    description,
    "topics": topics[]->{ _id, title },
    "playlistId": *[_type == 'playlist' && defined(^.keyWords[0]) && title == ^.keyWords[0]][0]._id,
    "path": URL
  }`;

  return await client.fetch<LinkType[]>(query, { ids });
};

export const loadAllPlaylistAuthors = async (): Promise<string[]> => {
  const query = `array::unique(
    *[_type == "playlist" && (type == "video" || type == "video-book") && isResource != true && defined(author) && author != ""].author
    + *[_type == "link" && type == "playlist" && isResource != true && defined(author) && author != ""].author
  )`;
  const authors = await client.fetch<string[]>(query);

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

export type PlaylistSearchResults = {
  embedded: PlaylistType[];
  ytLinks: LinkType[];
};

// The "SINGLE" playlist only collects individual videos and must not be
// listed as a playlist in the Videoteka playlists tab.
const isSinglePlaylist = (title?: string | null) =>
  !!title && title.toUpperCase().includes('SINGLE');

/**
 * Fetches only the ids/titles needed to sort and paginate both embedded and
 * YouTube playlists. Full documents for the current page are loaded with
 * `loadPlaylistsByIds`.
 */
export const loadPlaylistSearchIndex = async (
  topicIds: string[],
  author: string,
  text: string
): Promise<PlaylistIndexItem[]> => {
  const topicFilter =
    topicIds.length > 0 ? '&& count(topics[_ref in $topicIds]) > 0' : '';
  const authorFilter = author
    ? '&& lower(coalesce(author, "")) match $authorPattern'
    : '';
  const textFilter = text
    ? '&& (lower(coalesce(title, "")) match $textPattern || lower(coalesce(description, "")) match $textPattern)'
    : '';
  const params: Record<string, unknown> = {};
  if (topicIds.length > 0) params.topicIds = topicIds;
  if (author) params.authorPattern = `*${author.toLowerCase()}*`;
  if (text) params.textPattern = `${text.toLowerCase()}*`;

  // Both playlist document types are reduced to id/title. `kind` remembers
  // which loader should fetch the full documents for a page of results.
  const embeddedQuery = `*[
    _type == "playlist"
    && (type == "video" || type == "video-book")
    && isResource != true
    && count(items[_type == "reference"]) > 0
    ${topicFilter}
    ${authorFilter}
    ${textFilter}
  ] | order(title asc) { _id, title }`;

  const ytQuery = `*[
    _type == "link"
    && type == "playlist"
    && isResource != true
    ${topicFilter}
    ${authorFilter}
    ${textFilter}
  ] | order(title asc) { _id, title }`;

  type IndexTitle = { _id: string; title?: string | null };
  const [embedded, ytLinks] = await Promise.all([
    client.fetch<IndexTitle[]>(embeddedQuery, params),
    client.fetch<IndexTitle[]>(ytQuery, params)
  ]);

  const toIndex = (
    items: IndexTitle[],
    kind: PlaylistIndexItem['kind']
  ): PlaylistIndexItem[] =>
    items
      .filter((item) => !isSinglePlaylist(item.title))
      .map((item) => ({
        _id: item._id,
        title: item.title ?? '',
        kind
      }));

  return [...toIndex(embedded, 'embedded'), ...toIndex(ytLinks, 'yt')];
};

/** Fetches the full documents for one page of playlist results. */
export const loadPlaylistsByIds = async (
  items: PlaylistIndexItem[]
): Promise<PlaylistSearchResults> => {
  if (items.length === 0) return { embedded: [], ytLinks: [] };

  // Split by kind so a page made only of embedded playlists does not query
  // links (and vice versa), and each query gets only its own ids.
  const embeddedIds = items
    .filter((item) => item.kind === 'embedded')
    .map((item) => item._id);
  const ytIds = items
    .filter((item) => item.kind === 'yt')
    .map((item) => item._id);

  // The ids already come from the filtered index, so filters are not repeated
  // here. Embedded playlists bring their items because the player needs them.
  const embeddedQuery = `*[
    _type == "playlist"
    && (type == "video" || type == "video-book")
    && _id in $ids
  ] {
    _id,
    author,
    title,
    description,
    "imageUrl": image.asset -> url,
    "topics": topics[]->{ _id, title },
    "items": items[_type == "reference"]->{_id, author, title, description, "path": URL}
  }`;

  const ytQuery = `*[
    _type == "link"
    && type == "playlist"
    && _id in $ids
  ] {
    _id,
    title,
    description,
    author,
    "topics": topics[]->{ _id, title },
    "path": URL
  }`;

  const [embedded, ytLinks] = await Promise.all([
    embeddedIds.length > 0
      ? client.fetch<PlaylistType[]>(embeddedQuery, { ids: embeddedIds })
      : Promise.resolve([] as PlaylistType[]),
    ytIds.length > 0
      ? client.fetch<LinkType[]>(ytQuery, { ids: ytIds })
      : Promise.resolve([] as LinkType[])
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
        .catch(() => ({ date, json: null }));
    })
  );

  const evts: { title: string; start: string; end: string }[] = [];
  for (const r of results) {
    if (r.json?.status !== 'OK') continue;
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
      'novstart.com',
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
