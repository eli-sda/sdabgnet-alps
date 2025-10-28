// This script fetches data from Sanity and adds links to their corresponding playlists
// Based on the keyword matching between playlist titles and link keywords

import { client, SanityDocument } from './constants';

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
    // Fetch all audio playlists (sermons, audiobook, seminars)
    const playlists: PlaylistDocument[] = await client.fetch(`
      *[_type == "playlist" && type in ["sermons", "audio-book", "seminars"] && isResource == true]{
        _id,
        _type,
        title,
        items
      }
    `);

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
 * For series links (with number prefix), sort numerically
 * For non-series links, sort alphabetically
 */
function sortLinks(links: LinkDocument[]): LinkDocument[] {
  return links.sort((a, b) => {
    // Type guard to ensure we have valid objects with fileName
    if (!a?.fileName || !b?.fileName) {
      return 0;
    }

    const aHasNumber = /^\d+\s*-/.test(a.fileName);
    const bHasNumber = /^\d+\s*-/.test(b.fileName);

    if (aHasNumber && bHasNumber) {
      // Both have numbers, sort numerically
      const aMatch = a.fileName.match(/^(\d+)/);
      const bMatch = b.fileName.match(/^(\d+)/);
      const aNum = parseInt(aMatch?.[1] || '0');
      const bNum = parseInt(bMatch?.[1] || '0');
      return aNum - bNum;
    } else if (aHasNumber) {
      return -1; // a comes first
    } else if (bHasNumber) {
      return 1; // b comes first
    } else {
      // Neither has numbers, sort alphabetically by author name
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
