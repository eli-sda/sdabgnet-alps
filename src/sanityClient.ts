import { createClient } from '@sanity/client';

const clientVreses = createClient({
  projectId: import.meta.env.VITE_SANITY_VERSES_PROJECT_ID as string,
  dataset: import.meta.env.VITE_SANITY_DATASET as string,
  apiVersion: '2022-03-07',
  useCdn: import.meta.env.VITE_SANITY_DATASET === 'production' // `true` for fast, cached responses
});

export default clientVreses;
