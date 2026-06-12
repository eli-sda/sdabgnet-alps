// This script fetches data from Sanity and adds links to their corresponding playlists
// Based on the keyword matching between playlist titles and link keywords

import { client, SanityDocument } from './constants';

import musicLinksJson from './music-links.json';

// Build a map: playlistTitle -> [fileName, ...] from musicLinksJson
const playlistOrderMap: Record<string, string[]> = {};

function loadMusicLinksOrder() {
  if (Object.keys(playlistOrderMap).length > 0) {
    return; // already loaded
  }
  (musicLinksJson as { fileName: string; keyWords: string[] }[]).forEach(
    (item) => {
      const playlistTitle = item.keyWords && item.keyWords[0];
      if (playlistTitle) {
        if (!playlistOrderMap[playlistTitle]) {
          playlistOrderMap[playlistTitle] = [];
        }
        playlistOrderMap[playlistTitle].push(item.fileName);
      }
    }
  );
}

// Helper function to match and update playlists with their corresponding links
export async function populatePlaylistsWithLinks(
  playlists: PlaylistDocument[],
  links: LinkDocument[]
): Promise<number> {
  let totalUpdated = 0;

  for (const playlist of playlists) {
    const matchingLinks = links.filter((link) => {
      return link.keyWords && link.keyWords[0] === playlist.title;
    });

    if (matchingLinks.length === 0) {
      console.warn(`No matching links found for playlist: ${playlist.title}`);
      continue;
    }

    // Sort links by keyWords[1]
    const sortedMatchingLinks = sortLinksByKeyWords(matchingLinks);

    console.log(`\n📂 Playlist: "${playlist.title}"`);
    sortedMatchingLinks.forEach((link, idx) => {
      console.log(
        `      ${idx + 1}. "${link.title}" (keyWords[1]: ${link.keyWords[1]})`
      );
    });

    // Create references
    const itemReferences = sortedMatchingLinks.map((link) => ({
      _type: 'reference' as const,
      _ref: link._id,
      _key: `ref-${link._id}`
    }));

    // Patch the playlist document
    try {
      await client.patch(playlist._id).set({ items: itemReferences }).commit();

      console.log(
        `✅ Updated playlist "${playlist.title}" with ${sortedMatchingLinks.length} items`
      );
      totalUpdated++;
    } catch (error) {
      console.error(`❌ Failed to update playlist ${playlist._id}:`, error);
    }
  }

  return totalUpdated;
}

export interface PlaylistDocument extends SanityDocument {
  _type: 'playlist';
  title: string;
  items?: Array<{
    _type: 'reference';
    _ref: string;
    _key: string;
  }>;
}

// Define the type for link documents
export interface LinkDocument extends SanityDocument {
  _type: 'link';
  fileName: string;
  author: string;
  title: string;
  // size: number;
  // type: string;
  // isResource: boolean;
  keyWords: string[];
}

export function linkPlaylistsToItems() {
  void linkAudioPlaylistsToItems();
}

async function linkAudioPlaylistsToItems() {
  console.log('Starting to link audio playlists to their items...');
  let totalUpdated = 0;
  try {
    const playlists: PlaylistDocument[] = await client.fetch(
      // Fetch all audio playlists (sermons, audio-book, seminars)
      //   `
      //   *[_type == "playlist" && type in ["sermons", "audio-book", "seminars"] && isResource == true]{
      //     _id,
      //     _type,
      //     title,
      //     items
      //   }
      // `
      // Fetch all audio-book playlists without items
      //   `
      //    *[_type == "playlist" && type in ["audio-book"] && isResource == true && items==null]{
      //     _id,
      //     _type,
      //     title,
      //     items
      //   }
      // `
      // Fetch all audio-book playlists with specific titles
      `
       *[_type == "playlist" && type in ["audio-book"] && isResource == true &&  title in ["Копнежът на вековете", "Избрани вести - том 1", "Невероятни отговори на молитви", "Още невероятни отговори на молитви", "Когато се нуждаеш от още невероятни отговори на молитви"]]{
        _id,
        _type,
        title,
        items
      }
    `
    );

    // Fetch all audio links
    const links: LinkDocument[] = await client.fetch(`
      *[_type == "link" && type == "audio" && isResource == true]{
        _id,
        _type,
        title,
        author,
        fileName,
        keyWords
      }
    `);

    console.log(
      `Found ${playlists.length} playlists and ${links.length} links`
    );

    // Process each playlist
    for (const playlist of playlists) {
      // Find matching links for this playlist
      const matchingLinks = links.filter((link) => {
        // Check if any keyWord matches the playlist title exactly
        if (link.keyWords.includes(playlist.title)) {
          return true;
        }

        // Check if the playlist title matches when keyWords are joined with comma
        // for example: ["Миналото", "настоящето и бъдещето"]
        const joinedKeyWords = link.keyWords.join(', ');
        return joinedKeyWords === playlist.title;
      });

      if (matchingLinks.length === 0) {
        console.warn(`No matching links found for playlist: ${playlist.title}`);
        continue;
      }

      // Fix keyWords for links that match by joining multiple keyWords
      for (const link of matchingLinks) {
        const joinedKeyWords = link.keyWords.join(', ');
        if (joinedKeyWords === playlist.title && link.keyWords.length > 1) {
          console.log(
            `🔧 Fixing keyWords for link "${link.title}": [${link.keyWords
              .map((k) => `"${k}"`)
              .join(', ')}] → ["${playlist.title}"]`
          );

          try {
            await client
              .patch(link._id)
              .set({
                keyWords: [playlist.title]
              })
              .commit();

            // Update the local link data to reflect the change
            link.keyWords = [playlist.title];

            console.log(`✅ Updated keyWords for link: ${link.title}`);
          } catch (error) {
            console.error(
              `❌ Failed to update keyWords for link ${link._id}:`,
              error
            );
          }
        }
      }
      // Sort links by fileName to maintain order
      const sortedMatchingLinks = sortLinks(matchingLinks);
      console.log(`📂 Playlist: "${playlist.title}"`);
      console.log(`   Found ${sortedMatchingLinks.length} matching links:`);
      sortedMatchingLinks.forEach((link, idx) => {
        console.log(`      ${idx + 1}. "${link.title}"`);
      });

      // Create references to the matching links
      const itemReferences = sortedMatchingLinks.map((link) => ({
        _type: 'reference' as const,
        _ref: link._id,
        _key: `ref-${link._id}`
      }));

      // Update the playlist with the item references
      try {
        await client
          .patch(playlist._id)
          .set({
            items: itemReferences
          })
          .commit();

        console.log(
          `✅ Updated playlist "${playlist.title}" with ${sortedMatchingLinks.length} items`
        );
        totalUpdated++;
      } catch (error) {
        console.error(`❌ Failed to update playlist ${playlist._id}:`, error);
      }
    }

    console.log(
      `\n🎉 Successfully updated ${totalUpdated} playlists out of ${playlists.length}`
    );
  } catch (error) {
    console.error('❌ Error in linkAudioPlaylistsToItems:', error);
  }
}

/**
 * Sort links by fileName to maintain order
 * For series links (with number prefix or suffix), sort numerically
 * For non-series links, sort alphabetically
 */
function sortLinks(links: LinkDocument[]): LinkDocument[] {
  return links.sort((a, b) => {
    // Type guard to ensure we have valid objects with fileName
    if (!a?.fileName || !b?.fileName) {
      return 0;
    }

    // Check for numbers at the beginning (e.g., "01 Title.mp3")
    const aHasPrefix = /^\d+[\s-]/.test(a.fileName);
    const bHasPrefix = /^\d+[\s-]/.test(b.fileName);

    // Check for numbers before extension (e.g., "Title_31.mp3")
    const aHasSuffix = /_(\d+)\.\w+$/.test(a.fileName);
    const bHasSuffix = /_(\d+)\.\w+$/.test(b.fileName);

    // If both have prefix numbers, sort by prefix
    if (aHasPrefix && bHasPrefix) {
      const aMatch = a.fileName.match(/^(\d+)/);
      const bMatch = b.fileName.match(/^(\d+)/);
      const aNum = parseInt(aMatch?.[1] || '0');
      const bNum = parseInt(bMatch?.[1] || '0');
      return aNum - bNum;
    }
    // If both have suffix numbers, sort by suffix
    else if (aHasSuffix && bHasSuffix) {
      const aMatch = a.fileName.match(/_(\d+)\.\w+$/);
      const bMatch = b.fileName.match(/_(\d+)\.\w+$/);
      const aNum = parseInt(aMatch?.[1] || '0');
      const bNum = parseInt(bMatch?.[1] || '0');
      return aNum - bNum;
    }
    // If one has a number pattern and the other doesn't
    else if (aHasPrefix || aHasSuffix) {
      return -1; // a comes first
    } else if (bHasPrefix || bHasSuffix) {
      return 1; // b comes first
    }
    // Neither has numbers, sort alphabetically by author name
    else {
      const normalizedAuthorA = normalizeAuthor(a?.author || '');
      const normalizedAuthorB = normalizeAuthor(b?.author || '');
      return normalizedAuthorA.localeCompare(normalizedAuthorB, 'bg');
    }
  });
}

/**
 * Normalize author names for comparison
 */
function normalizeAuthor(author: string): string {
  if (!author) return '';

  return author
    .toLowerCase()
    .replace(/п-р\s*/g, '') // Remove "п-р " prefix
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Sort video links by keyWords[1] (numeric order)
 */
function sortLinksByKeyWords(links: LinkDocument[]): LinkDocument[] {
  return links.sort((a, b) => {
    const aNum = parseInt(a.keyWords[1] || '0');
    const bNum = parseInt(b.keyWords[1] || '0');
    return aNum - bNum;
  });
}

// Sorting logic based on json file
function sortMusicLinks(
  links: LinkDocument[],
  playlistTitle?: string
): LinkDocument[] {
  if (!playlistTitle || !playlistOrderMap[playlistTitle]) {
    return links;
  }
  const orderArr = playlistOrderMap[playlistTitle];
  const fileNameToOrder: Record<string, number> = {};
  orderArr.forEach((fileName, idx) => {
    fileNameToOrder[fileName] = idx;
  });
  return links.slice().sort((a, b) => {
    const aOrder = fileNameToOrder[a.fileName] ?? Number.MAX_SAFE_INTEGER;
    const bOrder = fileNameToOrder[b.fileName] ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });
}

export async function linkMusicPlaylistsToItems() {
  console.log('Starting to link music playlists to their items...');
  loadMusicLinksOrder();
  let totalUpdated = 0;
  try {
    const playlists: PlaylistDocument[] = await client.fetch(
      // Fetch all music playlists
      `*[_type == "playlist" && type in ["music"] && isResource == true] | order(title asc){
      _id,
      _type,
      title,
      items
    }`
    );

    // Fetch all music links
    const links: LinkDocument[] = await client.fetch(`
      *[_type == "link" && type == "music" && isResource == true]{
        _id,
        _type,
        title,
        author,
        fileName,
        keyWords
      }
    `);

    console.log(
      `Found ${playlists.length} playlists and ${links.length} links`
    );

    // Process each playlist
    for (const playlist of playlists) {
      // Find matching links for this playlist
      const matchingLinks = links.filter((link) => {
        // Check if any keyWord matches the playlist title exactly
        if (link.keyWords.includes(playlist.title)) {
          return true;
        }
      });

      if (matchingLinks.length === 0) {
        console.warn(`No matching links found for playlist: ${playlist.title}`);
        continue;
      }

      // Sort music links by fileName to maintain order
      const sortedMatchingLinks = sortMusicLinks(matchingLinks, playlist.title);
      console.log(`📂 Playlist: "${playlist.title}"`);
      console.log(`   Found ${sortedMatchingLinks.length} matching links:`);
      sortedMatchingLinks.forEach((link, idx) => {
        console.log(`      ${idx + 1}. "${link.title}" (${link.fileName}})`);
      });

      // Create references to the matching links
      const itemReferences = sortedMatchingLinks.map((link) => ({
        _type: 'reference' as const,
        _ref: link._id,
        _key: `ref-${link._id}`
      }));

      // Update the playlist with the item references
      try {
        await client
          .patch(playlist._id)
          .set({
            items: itemReferences
          })
          .commit();

        console.log(
          `✅ Updated playlist "${playlist.title}" with ${sortedMatchingLinks.length} items`
        );
        totalUpdated++;
      } catch (error) {
        console.error(`❌ Failed to update playlist ${playlist._id}:`, error);
      }
    }

    console.log(
      `\n🎉 Successfully updated ${totalUpdated} playlists out of ${playlists.length}`
    );
  } catch (error) {
    console.error('❌ Error in linkMusicPlaylistsToItems:', error);
  }
}

async function linkVideoPlaylistsToItems(playlistType: string) {
  console.log(
    `Starting to link ${playlistType} video playlists to their items...`
  );
  let totalUpdated = 0;
  try {
    const playlists: PlaylistDocument[] = await client.fetch(
      // Fetch all playlists of the given type without items
      `*[_type == "playlist" && type == "${playlistType}" && (items == null || count(items) == 0)] | order(title asc){
      _id,
      _type,
      title,
      items
    }`
    );

    // Get all playlist titles for filtering links
    const playlistTitles = playlists.map((p) => p.title);

    // Fetch video links with isResource == null where first keyWord matches one of the playlist titles
    const links: LinkDocument[] = await client.fetch(
      `*[_type == "link" && type == "video" && isResource == null && keyWords[0] in $playlistTitles]{
        _id,
        _type,
        title,
        author,
        fileName,
        keyWords
      }`,
      { playlistTitles }
    );

    console.log(
      `Found ${playlists.length} playlists and ${links.length} links`
    );

    // Match links to playlists and update in Sanity
    totalUpdated = await populatePlaylistsWithLinks(playlists, links);

    console.log(
      `\n🎉 Successfully updated ${totalUpdated} playlists out of ${playlists.length}`
    );
  } catch (error) {
    console.error('❌ Error in linkVideoPlaylistsToItems:', error);
  }
}

export async function linkBibleVideoPlaylistsToItems() {
  await linkVideoPlaylistsToItems('bible_ref');
}

export async function linkTestimoniesVideoPlaylistsToItems() {
  await linkVideoPlaylistsToItems('testimony');
}

export async function linkBookPlaylistsToItems() {
  const playlistType = 'books';

  console.log(`Starting to link ${playlistType} playlists to their items...`);

  let totalUpdated = 0;

  try {
    const playlists: PlaylistDocument[] = await client.fetch(
      // Fetch all playlists of the given type without items
      `*[_type == "playlist" && type == "${playlistType}" && isResource == true && (items == null || count(items) == 0)] | order(title asc){
      _id,
      _type,
      title,
      description,
      items
    }`
    );

    // Get all playlist titles for filtering links
    const playlistTitles = playlists.map((p) => p.title);

    // Fetch book links with isResource == true where first keyWord matches one of the playlist titles
    const links: LinkDocument[] = await client.fetch(
      `*[_type == "link" && type == "book" && isResource == true && keyWords[0] in $playlistTitles]{
        _id,
        _type,
        title,
        author,
        fileName,
        keyWords
      }`,
      { playlistTitles }
    );

    console.log(
      `Found ${playlists.length} playlists and ${links.length} links`
    );

    // Match links to playlists and update in Sanity
    totalUpdated = await populatePlaylistsWithLinks(playlists, links);

    console.log(
      `\n🎉 Successfully updated ${totalUpdated} playlists out of ${playlists.length}`
    );
  } catch (error) {
    console.error('❌ Error in linkBookPlaylistsToItems:', error);
  }
}

export async function linkHealthPlaylistsToItems() {
  console.log('Starting to link health playlists to their items...');
  let totalUpdated = 0;

  try {
    const targetPagePath = '/health/video';

    // Fetch the page document using path.current and extract the IDs of referenced playlists
    const pageQuery = `*[_type == "page" && path.current == "${targetPagePath}"][0] {
      "playlistIds": items[@._type == "reference"]._ref
    }`;

    const pageData = await client.fetch<{ playlistIds: string[] } | null>(pageQuery);

    if (!pageData || !pageData.playlistIds || pageData.playlistIds.length === 0) {
      console.warn(`No page found with path.current == "${targetPagePath}" or it has no referenced items.`);
      return;
    }

    const playlistIdsOnPage = pageData.playlistIds;
    console.log(`Found ${playlistIdsOnPage.length} playlist references on page ${targetPagePath}`);

    // Fetch only the empty playlists that are referenced on this specific page
    const playlists = await client.fetch<PlaylistDocument[]>(
      `*[_type == "playlist" && _id in $playlistIdsOnPage && (items == null || count(items) == 0)] {
        _id,
        _type,
        title,
        items
    }`,
      { playlistIdsOnPage }
    );

    if (!playlists || playlists.length === 0) {
      console.log('No empty playlists found on the target page that need updating.');
      return;
    }

    const playlistTitles = playlists.map((p) => p.title);

    // Fetch matching links
    const links = await client.fetch<LinkDocument[]>(
      `*[_type == "link" && keyWords[0] in $playlistTitles]{
        _id,
        _type,
        title,
        author,
        fileName,
        keyWords
      }`,
      { playlistTitles }
    );

    console.log(
      `Found ${playlists.length} empty playlists on page and ${links.length} potential matching links.`
    );

    // Match links to playlists and update in Sanity
    totalUpdated = await populatePlaylistsWithLinks(playlists, links);

    console.log(
      `\n🎉 Successfully updated ${totalUpdated} playlists out of ${playlists.length}`
    );
  } catch (error) {
    console.error('❌ Error in linkHealthPlaylistsToItems:', error);
  }
}

export async function linkVideosPlaylistsToItems(playlistFilter: string) {
  console.log(
    `Starting to link video playlists to their items with filter: "${playlistFilter}"...`
  );
  let totalUpdated = 0;

  try {
    // Inject the raw GROQ filter clause directly into the query string
    const playlists = await client.fetch<PlaylistDocument[]>(
      `*[_type == "playlist" && type == "video" && ${playlistFilter} && (items == null || count(items) == 0)] {
        _id,
        _type,
        title,
        items
      }`
    );

    if (!playlists || playlists.length === 0) {
      console.log(
        `No empty playlists found matching the filter "${playlistFilter}".`
      );
      return;
    }

    const playlistTitles = playlists.map((p) => p.title);
    console.log(
      `Found ${playlists.length} empty playlists matching the filter.`
    );

    // Fetch matching links
    const links = await client.fetch<LinkDocument[]>(
      `*[_type == "link" && keyWords[0] in $playlistTitles]{
        _id,
        _type,
        title,
        author,
        fileName,
        keyWords
      }`,
      { playlistTitles }
    );

    console.log(`Found ${links.length} potential matching links.`);

    totalUpdated = await populatePlaylistsWithLinks(playlists, links);

    console.log(
      `\n🎉 Successfully updated ${totalUpdated} playlists out of ${playlists.length}`
    );
  } catch (error) {
    console.error('❌ Error in linkVideosPlaylistsToItems:', error);
  }
}
