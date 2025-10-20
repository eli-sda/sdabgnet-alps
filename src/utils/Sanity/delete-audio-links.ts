import { client } from './constants';

async function deleteAudioLinks() {
  // Get all audio link IDs
  const audioLinkIds: string[] = await client.fetch(
    '*[_type == "link" && type == "audio"]._id'
  );

  console.log(`Found ${audioLinkIds.length} audio links to delete`);

  // Delete each document
  for (const id of audioLinkIds) {
    await client.delete(id);
    console.log(`Deleted: ${id}`);
  }

  console.log('All audio links deleted successfully');
}
export function deleteAllAudioLinks() {
  void deleteAudioLinks().catch(console.error);
}
