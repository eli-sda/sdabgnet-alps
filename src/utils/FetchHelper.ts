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

export const loadQuestions = async (): Promise<QuestionType[]> => {
  const questionsQuery = `*[_type == "questionAnswer"] | order(_createdAt desc) {
   name,
   text,
   answer
}`;

  const questions: QuestionType[] = await clientVreses.fetch(questionsQuery);

  return questions;
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
        ? '&& (isResource == null || isResource == false)'
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

  return await client.fetch(playlistQuery);
};

export const loadLinks = async (type: string): Promise<LinkType[]> => {
  const linkQuery = `*[
    _type == "link"
    && isResource == true
    && type == "${type}"
  ] | order(_createdAt desc) {
    _id,
    // isResource,
    // type,
    // isResource,
    // type,
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

/**
 * Load videos filtered by topic _ids (references) OR legacy keyWords strings.
 * Pass topic._id values from loadAllTopics().
 */
export const loadLinksByTopics = async (
  topicIds: string[]
): Promise<LinkType[]> => {
  const linkQuery = `*[
    _type == "link"
    && type == "video"
    && count(topics[_ref in $topicIds]) > 0
  ] | order(_createdAt desc) {
    _id,
    title,
    size,
    isResource,
    keyWords,
    "topics": topics[]->{ _id, title },
    "path": select(isResource == true => "images/" + fileName, 
    true => URL
    )
  }`;

  const results: LinkType[] = await client.fetch(linkQuery, { topicIds });
  // Use helper to clean keyWords and keep null when none left
  return results.map((link) => {
    const filtered = filterTags(link.keyWords as string[] | null);
    return {
      ...link,
      keyWords: filtered.length ? filtered : null
    } as LinkType;
  });
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

export const loadStandalonePresentations = async (): Promise<LinkType[]> => {
  const presentationsQuery = `*[
    _type == "link" 
    && isResource == true 
    && type == "presentation"
    && !(_id in *[_type == "playlist" && type == "presentations"].items[]._ref)
  ] | order(_createdAt desc) {
    _id,
    author,
    title,
    description,
    size,
    "path": "presentations/" + fileName
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
