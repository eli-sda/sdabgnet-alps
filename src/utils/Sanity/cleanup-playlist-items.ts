import { client } from './constants';

type PlaylistResult = {
  _id: string;
  itemRefs: string[];
};

/**
 * delete all items of playlist by type and title
 */
export async function cleanupPlaylistItems(
  playlistType: string,
  playlistTitle: string
) {
  console.log(
    `Очаквайте... Изчистваме items от плайлисти с type "${playlistType}" и title "${playlistTitle}"...`
  );
  const query = `*[_type == 'playlist' && type == $type && title == $title]{
    _id,
    "itemRefs": items[]._ref
  }`;

  const result: PlaylistResult[] = await client.fetch(query, {
    type: playlistType,
    title: playlistTitle
  });

  if (!result.length) {
    console.log('Няма намерени playlist-и');
    return;
  }

  for (const { _id: playlistId, itemRefs } of result) {
    if (!itemRefs?.length) {
      console.log(`Playlist ${playlistId} няма items`);
      continue;
    }

    console.log(`▶ Playlist ${playlistId}: ${itemRefs.length} items`);

    const tx = client.transaction();

    // delete all link documents
    itemRefs.forEach((id) => tx.delete(id));

    // clear playlist items array
    tx.patch(playlistId, (patch) => patch.set({ items: [] }));

    await tx.commit();

    console.log(`✔ Готово за плейлист с _id: ${playlistId}`);
  }
}
