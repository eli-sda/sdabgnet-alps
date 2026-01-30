import moment from 'moment';
import { PortableTextBlock } from '@portabletext/types';
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
  const results = await clientVreses.fetch<
    {
      type: AdType;
      date: string;
      text: PortableTextBlock[];
    }[]
  >(
    `*[_type == "advertisement" && type in $types]
     | order(date desc)
     { type, date, text }`,
    { types }
  );

  const entries = Object.entries(
    results.reduce<
      Partial<Record<AdType, { date: string; text: PortableTextBlock[] }>>
    >((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = {
          date: item.date,
          text: item.text
        };
      }
      return acc;
    }, {})
  );

  return Object.fromEntries(entries) as Partial<
    Record<AdType, LatestAdvertisementItem>
  >;
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
            ({ date, json: null } as {
              date: moment.Moment;
              json: SunsetApiResponse | null;
            })
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
