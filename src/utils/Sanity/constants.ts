import { client as baseClient } from '../../sanityClient';

//for https://sdabgnet.sanity.studio/ - client with token for write operations
export const client = baseClient.withConfig({
  token: import.meta.env.VITE_SANITY_SDABGNET_EDIT_TOKEN as string // uncommenrt to use
});

// Define the type of the documents you'll fetch
export interface SanityDocument {
  _id: string;
  _type: string;
}

// Define the type for playlist documents with slug and image field (for fixing image issues)
export interface PlaylistDocument extends SanityDocument {
  _type: 'playlist';
  slug: string;
  image?: string | object | null;
}
