// This script fixes the slug field in playlist documents
// by converting string slugs to proper slug objects
import { client, PlaylistDocument } from './constants';

export function fixSlugs() {
  void fixPlaylistSlugs();
}

async function fixPlaylistSlugs() {
  const documents: PlaylistDocument[] = await client.fetch(
    '*[_type == "playlist" && string(slug) != null]'
  );

  for (const doc of documents) {
    await client
      .patch(doc._id)
      .set({
        slug: {
          _type: 'slug',
          current: doc.slug
        }
      })
      .commit();
  }

  console.log(`Updated ${documents.length} documents`);
}
