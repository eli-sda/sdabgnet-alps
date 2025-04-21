import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

//for https://daily-verses.sanity.studio/
export const clientVreses = createClient({
  projectId: import.meta.env.VITE_SANITY_VERSES_PROJECT_ID as string,
  dataset: import.meta.env.VITE_SANITY_DATASET as string,
  apiVersion: '2022-03-07',
  useCdn: import.meta.env.VITE_SANITY_DATASET === 'production' // `true` for fast, cached responses
});

//for https://sdabgnet.sanity.studio/
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_SDABGNET_PROJECT_ID as string,
  dataset: import.meta.env.VITE_SANITY_DATASET as string,
  apiVersion: '2022-03-07',
  useCdn: import.meta.env.VITE_SANITY_DATASET === 'production' // `true` for fast, cached responses
});

const builder = imageUrlBuilder(client);

// Helper
export const urlFor = (source: SanityImageSource) => builder.image(source);
