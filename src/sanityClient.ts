import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// In dev (localhost) use a token to authenticate — keep the token in .env (gitignored)
const token = import.meta.env.DEV
  ? (import.meta.env.VITE_SANITY_SDABGNET_DEV_TOKEN as string)
  : undefined;

const versesToken = import.meta.env.DEV
  ? (import.meta.env.VITE_SANITY_VERSES_DEV_TOKEN as string)
  : undefined;

//for https://daily-verses.sanity.studio/
export const clientVreses = createClient({
  projectId: import.meta.env.VITE_SANITY_VERSES_PROJECT_ID as string,
  dataset: import.meta.env.VITE_SANITY_DATASET as string,
  apiVersion: '2022-03-07',
  useCdn: !import.meta.env.DEV, // `true` for fast, cached responses
  token: versesToken
});

//for https://sdabgnet.sanity.studio/
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_SDABGNET_PROJECT_ID as string,
  dataset: import.meta.env.VITE_SANITY_DATASET as string,
  apiVersion: '2025-11-21',
  useCdn: !import.meta.env.DEV, // `true` for fast, cached responses
  token,
  perspective: 'previewDrafts' // Enables drafts (with token & useCdn: false, e.g. in DEV)
});

const builder = imageUrlBuilder(client);
const builderVreses = imageUrlBuilder(clientVreses);

// Helper
export const urlFor = (source: SanityImageSource, isVersesClient = false) =>
  isVersesClient ? builderVreses.image(source) : builder.image(source);
