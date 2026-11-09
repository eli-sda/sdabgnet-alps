// Експортира YouTube ID-тата на видеата от Видеотеката, за които липсва
// описание и/или теми в Sanity. Файловете `video_ids.txt` се подават на
// `transcribe.py`, който извлича БГ субтитрите. От субтитрите после се
// генерират описанието и темите, които се записват обратно в Sanity.

import { saveAs } from 'file-saver';
import { zipSync } from 'fflate';

import { extractYouTubeId } from 'src/utils/extractVideoId';
import { cleanedDescription } from 'src/utils/Links';
import { client } from './constants';

type VideoDocument = {
  _id: string;
  title?: string | null;
  URL?: string | null;
  description?: string | null;
  topicCount: number;
};

type PlaylistDocument = {
  _id: string;
  title?: string | null;
  videoIds?: string[] | null;
};

/** Кои видеа да се изберат: без описание, без теми или поне едно от двете. */
export type EnrichmentFilter = 'description' | 'topics' | 'either';

type VideoToEnrich = {
  videoId: string;
  title: string;
  sanityId: string;
  hasDescription: boolean;
  hasTopics: boolean;
};

type PlaylistGroup = {
  title: string;
  videos: VideoToEnrich[];
};

const VIDEOS_QUERY = `*[_type == "link" && type == "video" && isResource != true] {
  _id,
  title,
  URL,
  description,
  "topicCount": count(topics)
}`;

// Вградените плейлисти, които имат видеа в `items` — тяхната подредба дава
// видеата на плейлиста. Празните плейлисти не ни трябват.
const EMBEDDED_PLAYLISTS_QUERY = `*[
  _type == "playlist"
  && (type == "video" || type == "video-book")
  && isResource != true
  && count(items[_type == "reference"]) > 0
] | order(title asc) {
  _id,
  title,
  "videoIds": items[@._type == "reference"]._ref
}`;

// extractYouTubeId не познава /shorts/ URL-и, а те също са видеа в Sanity.
const SHORTS_URL_RE = /youtube\.com\/shorts\/([^"&?/\s]+)/i;

const getYouTubeId = (url?: string | null): string => {
  if (!url) return '';
  const shortsMatch = url.match(SHORTS_URL_RE);
  return shortsMatch ? shortsMatch[1] : extractYouTubeId(url);
};

// Същата проверка като при показване на описанието в Видеотеката: описание,
// което съдържа само ред "thumbnail: <url>", се брои за празно.
const hasRealDescription = (description?: string | null): boolean =>
  !!description && cleanedDescription(description).trim().length > 0;

const needsEnrichment = (
  video: VideoToEnrich,
  filter: EnrichmentFilter
): boolean => {
  if (filter === 'description') return !video.hasDescription;
  if (filter === 'topics') return !video.hasTopics;
  return !video.hasDescription || !video.hasTopics;
};

const filterLabel = (filter: EnrichmentFilter): string =>
  ({
    description: 'без описание',
    topics: 'без теми',
    either: 'без описание или без теми'
  })[filter];

const enrichmentReason = (video: VideoToEnrich): string => {
  if (!video.hasDescription && !video.hasTopics) {
    return '[без описание и без теми]';
  }

  return video.hasDescription ? '[без теми]' : '[без описание]';
};

const toVideoToEnrich = (doc: VideoDocument): VideoToEnrich | null => {
  const videoId = getYouTubeId(doc.URL);
  if (!videoId) return null;

  return {
    videoId,
    title: doc.title?.trim() ?? '',
    sanityId: doc._id,
    hasDescription: hasRealDescription(doc.description),
    hasTopics: (doc.topicCount ?? 0) > 0
  };
};

const sortByTitle = (videos: VideoToEnrich[]): VideoToEnrich[] =>
  [...videos].sort((a, b) => a.title.localeCompare(b.title, 'bg'));

/** Съдържание на `video_ids.txt` (редовете с "#" се игнорират от transcribe.py). */
const buildIdsFile = (videos: VideoToEnrich[], header: string): string => {
  const generatedAt = new Date().toISOString().slice(0, 10);

  // Заглавието стои на отделен ред точно над ID-то.
  const lines = videos.flatMap((video, index) => [
    `# ${index + 1}. ${video.title || '(без заглавие)'} ${enrichmentReason(video)}`,
    video.videoId
  ]);

  return [
    `# ${header}`,
    `# Генерирано на ${generatedAt} от exportVideoIdsForTranscription.ts`,
    `# Общо: ${videos.length}`,
    '',
    ...lines
  ].join('\r\n');
};

/** Име на папка в ZIP-а — без забранените за Windows символи. */
const sanitizeFolderName = (name: string): string => {
  const cleaned = name
    .replace(/[<>:"/\\|?*]+/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
    .replace(/[. ]+$/g, '');

  return cleaned || 'без-име';
};

const uniqueFolderName = (title: string, used: Set<string>): string => {
  const base = sanitizeFolderName(title);
  let name = base;
  let index = 2;

  while (used.has(name.toLowerCase())) {
    name = `${base} (${index})`;
    index++;
  }

  used.add(name.toLowerCase());
  return name;
};

const fetchVideos = (): Promise<VideoDocument[]> =>
  client.fetch<VideoDocument[]>(VIDEOS_QUERY);

const encode = (text: string): Uint8Array => new TextEncoder().encode(text);

/**
 * Един `video_ids.txt` за всички видеа (без групиране). Полезно за проверка на
 * дубликатите — видеата с повече от един link документ се отчитат в конзолата.
 */
export async function exportVideoIdsForTranscription(
  filter: EnrichmentFilter = 'either'
): Promise<void> {
  console.log(`Starting export of video ids (filter: "${filter}")...`);

  try {
    const documents = await fetchVideos();
    console.log(`Fetched ${documents.length} videos from Sanity.`);

    const videosById = new Map<string, VideoToEnrich>();
    // Всички link документи за един YouTube ID — за да се видят дубликатите.
    const documentsById = new Map<string, VideoDocument[]>();
    let withoutYouTubeId = 0;

    for (const doc of documents) {
      const videoId = getYouTubeId(doc.URL);

      if (!videoId) {
        withoutYouTubeId++;
        continue;
      }

      const sameVideoDocs = documentsById.get(videoId) ?? [];
      documentsById.set(videoId, [...sameVideoDocs, doc]);

      const video = toVideoToEnrich(doc);
      if (!video || !needsEnrichment(video, filter)) continue;

      // Едно и също видео може да е добавено като няколко link документа.
      if (videosById.has(videoId)) continue;

      videosById.set(videoId, video);
    }

    const videos = sortByTitle([...videosById.values()]);
    const duplicateVideos = [...documentsById.entries()].filter(
      ([, docs]) => docs.length > 1
    );

    const missingDescription = videos.filter((v) => !v.hasDescription).length;
    const missingTopics = videos.filter((v) => !v.hasTopics).length;

    console.log(`\n🎬 Видеа за обогатяване: ${videos.length}`);
    console.log(`   - без описание: ${missingDescription}`);
    console.log(`   - без теми:     ${missingTopics}`);

    if (withoutYouTubeId > 0) {
      console.warn(
        `⚠️ Пропуснати ${withoutYouTubeId} видеа без разпознаваем YouTube ID (не са youtube.com).`
      );
    }

    if (duplicateVideos.length > 0) {
      console.warn(
        `⚠️ Открити ${duplicateVideos.length} YouTube ID-та с повече от един link документ. ` +
          'В списъка е включен само първият — останалите дубликати трябва да се изтрият в Sanity:'
      );

      for (const [videoId, docs] of duplicateVideos) {
        const [kept, ...rest] = docs;
        console.warn(
          `   ${videoId} — оставен: ${kept._id} "${kept.title ?? ''}"`
        );
        for (const doc of rest) {
          console.warn(`      дубликат: ${doc._id} "${doc.title ?? ''}"`);
        }
      }
    }

    if (videos.length === 0) {
      console.log('✅ Няма видеа за обогатяване с този филтър.');
      return;
    }

    console.table(
      videos.map((video) => ({
        video_id: video.videoId,
        title: video.title,
        description: video.hasDescription ? '✓' : '—',
        topics: video.hasTopics ? '✓' : '—'
      }))
    );

    saveAs(
      new Blob([buildIdsFile(videos, `YouTube ID-та ${filterLabel(filter)} в Sanity`)], {
        type: 'text/plain;charset=utf-8'
      }),
      'video_ids.txt'
    );

    console.log(
      '\n💾 Изтеглен файл "video_ids.txt" — копирай го при transcribe.py и стартирай скрипта.'
    );
  } catch (error) {
    console.error('❌ Error in exportVideoIdsForTranscription:', error);
  }
}

/**
 * Групира видеата по вградените плейлисти и изтегля ZIP с папка на плейлист,
 * във всяка от които има `video_ids.txt` за transcribe.py. Видеата, които не са
 * в нито един плейлист, отиват в отделна папка "Без плейлист".
 */
export async function exportVideoIdsByPlaylist(
  filter: EnrichmentFilter = 'description'
): Promise<void> {
  console.log(`Starting export of video ids by playlist (filter: "${filter}")...`);

  try {
    const [documents, playlists] = await Promise.all([
      fetchVideos(),
      client.fetch<PlaylistDocument[]>(EMBEDDED_PLAYLISTS_QUERY)
    ]);

    console.log(
      `Fetched ${documents.length} videos and ${playlists.length} вградени плейлиста.`
    );

    const documentsById = new Map(documents.map((doc) => [doc._id, doc]));
    const inEmbeddedPlaylist = new Set<string>();
    const withoutYouTubeUrl: string[] = [];
    const groups: PlaylistGroup[] = [];

    for (const playlist of playlists) {
      const seenVideoIds = new Set<string>();
      const videos: VideoToEnrich[] = [];

      for (const linkId of playlist.videoIds ?? []) {
        const doc = documentsById.get(linkId);
        if (!doc) continue;

        inEmbeddedPlaylist.add(linkId);

        const video = toVideoToEnrich(doc);
        if (!video) {
          withoutYouTubeUrl.push(doc.title ?? doc._id);
          continue;
        }

        if (!needsEnrichment(video, filter)) continue;
        if (seenVideoIds.has(video.videoId)) continue;

        seenVideoIds.add(video.videoId);
        videos.push(video);
      }

      if (videos.length > 0) {
        groups.push({
          title: playlist.title?.trim() || playlist._id,
          videos: sortByTitle(videos)
        });
      }
    }

    // Видеата, които не са във вграден плейлист, отиват в отделна папка.
    const seenWithoutPlaylist = new Set<string>();
    const withoutPlaylist: VideoToEnrich[] = [];

    for (const doc of documents) {
      if (inEmbeddedPlaylist.has(doc._id)) continue;

      const video = toVideoToEnrich(doc);
      if (!video) {
        withoutYouTubeUrl.push(doc.title ?? doc._id);
        continue;
      }

      if (!needsEnrichment(video, filter)) continue;

      if (seenWithoutPlaylist.has(video.videoId)) continue;

      seenWithoutPlaylist.add(video.videoId);
      withoutPlaylist.push(video);
    }

    if (withoutPlaylist.length > 0) {
      groups.push({
        title: 'Без плейлист',
        videos: sortByTitle(withoutPlaylist)
      });
    }

    const totalVideos = groups.reduce(
      (sum, group) => sum + group.videos.length,
      0
    );

    console.log(`\n🎬 Плейлисти с видеа ${filterLabel(filter)}: ${groups.length}`);
    console.log(`   - общо видеа: ${totalVideos}`);
    console.log(`   - извън плейлист: ${withoutPlaylist.length}`);

    if (withoutYouTubeUrl.length > 0) {
      console.warn(
        `⚠️ Пропуснати ${withoutYouTubeUrl.length} видеа без разпознаваем YouTube ID.`
      );
    }

    if (groups.length === 0) {
      console.log('✅ Няма видеа за обогатяване с този филтър.');
      return;
    }

    const files: Record<string, Uint8Array> = {};
    const usedFolderNames = new Set<string>();

    for (const group of groups) {
      const folder = uniqueFolderName(group.title, usedFolderNames);
      files[`${folder}/video_ids.txt`] = encode(
        buildIdsFile(
          group.videos,
          `Плейлист "${group.title}" — видео ID-та ${filterLabel(filter)}`
        )
      );
    }

    const generatedAt = new Date().toISOString().slice(0, 10);
    const summary = [
      '# Видеа за обогатяване по плейлисти',
      `# Генерирано на ${generatedAt} от exportVideoIdsForTranscription.ts`,
      `# Плейлисти: ${groups.length}, общо видеа: ${totalVideos}`,
      '',
      ...groups.map(
        (group) =>
          `${String(group.videos.length).padStart(5)}  ${group.title}`
      )
    ].join('\r\n');

    files['_обобщение.txt'] = encode(summary);

    saveAs(
      new Blob([zipSync(files)], { type: 'application/zip' }),
      'video_ids_by_playlist.zip'
    );

    console.table(
      groups.map((group) => ({
        playlist: group.title,
        videos: group.videos.length
      }))
    );

    console.log(
      '\n💾 Изтеглен файл "video_ids_by_playlist.zip" — взимаш папката на плейлиста, ' +
        'копираш вътрешния video_ids.txt при transcribe.py и стартираш скрипта.'
    );
  } catch (error) {
    console.error('❌ Error in exportVideoIdsByPlaylist:', error);
  }
}
