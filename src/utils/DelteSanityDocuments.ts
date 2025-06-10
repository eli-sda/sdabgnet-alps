import { createClient } from '@sanity/client';

//for https://sdabgnet.sanity.studio/
const client = createClient({
  projectId: import.meta.env.VITE_SANITY_SDABGNET_PROJECT_ID as string,
  dataset: import.meta.env.VITE_SANITY_DATASET as string,
  //token: import.meta.env.VITE_SANITY_SDABGNET_EDIT_TOKEN as string,//uncomment to use
  apiVersion: '2022-03-07',
  useCdn: import.meta.env.VITE_SANITY_DATASET === 'production' // `true` for fast, cached responses
});
// Define the type of the documents you'll fetch
interface SanityDocument {
  _id: string;
  _type: string;
}

async function deleteAllDraftDocumentsOfType(docType: string): Promise<void> {
  try {
    // Fetch all draft document IDs of the given type
    const drafts: SanityDocument[] = await client.fetch(
      `*[_id in path("drafts.**") && _type == ${docType}]{_id}`,
      { docType }
    );
    if (drafts.length === 0) {
      console.log(`No unpublished documents of type "${docType}" found.`);
      return;
    }

    // Collect draft document IDs
    const ids = drafts.map((draft) => draft._id);

    // Delete draft documents in bulk
    await Promise.all(ids.map((id) => client.delete(id)));

    console.log(
      `Deleted ${ids.length} unpublished documents of type "${docType}".`
    );
  } catch (error) {
    console.error(
      `Error deleting unpublished documents of type "${docType}":`,
      error
    );
  }
}

async function deleteAllDocumentsOfType(
  docType: string,
  batchSize: number = 10
): Promise<void> {
  try {
    // Fetch all document IDs of the specified type
    const docs: SanityDocument[] = await client.fetch(
      `*[_type == "${docType}"]{_id}`,
      { docType }
    );

    if (docs.length === 0) {
      console.log(`No documents of type "${docType}" found.`);
      return;
    }

    // Collect document IDs
    const ids = docs.map((doc) => doc._id);

    // Process deletion in batches
    const batches = [];
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      batches.push(batch);
    }

    // Delete each batch
    for (const batch of batches) {
      await Promise.all(batch.map((id) => client.delete(id)));
      console.log(`Deleted ${batch.length} documents.`);

      // Delay between batches to avoid hitting the rate limit
      await delay(1000); // 1 second delay between batches (you can adjust as needed)
    }

    console.log(`Deleted ${ids.length} documents of type "${docType}".`);
  } catch (error) {
    console.error(`Error deleting documents of type "${docType}":`, error);
  }
}

// Helper function to introduce a delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function deleteAllLinks() {
  void deleteAllDocumentsOfType('link'); // Replace 'link' with the desired document type
}

export function deleteAllDraftLinks() {
  void deleteAllDraftDocumentsOfType('link');
}
