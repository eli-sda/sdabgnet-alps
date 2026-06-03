import { client } from './constants';

export async function updateVideoTopics() {
  console.log('Starting to update video topics (as array)...');
  let totalUpdated = 0;

  // The field in your Sanity schema that stores the array of strings
  const TARGET_FIELD = 'topic';

  const targets = [
    {
      name: 'All Health Pages',
      condition: 'path.current match "*health*"',
      tag: 'здраве'
    },
    {
      name: '/health/new-start Page',
      condition: 'path.current == "/health/new-start"',
      tag: 'здравни принципи'
    }
  ];

  try {
    // Map to accumulate tags for each video: videoId -> Set of tags (to prevent duplicates)
    const videoTagsMap = new Map<string, Set<string>>();

    for (const target of targets) {
      console.log(`\n--- Gathering videos for: ${target.name} ---`);

      // 1. Fetch playlist IDs from pages matching the current condition
      const pageQuery = `*[_type == "page" && ${target.condition}] {
        "playlistIds": items[@._type == "reference"]._ref
      }`;

      const pagesData = await client.fetch<{ playlistIds: string[] }[] | null>(
        pageQuery
      );

      if (!pagesData || pagesData.length === 0) continue;

      // Flatten and remove duplicate playlist IDs
      const uniquePlaylistIds = pagesData
        .flatMap((page) => page.playlistIds || [])
        .filter((id, index, self) => id && self.indexOf(id) === index);

      if (uniquePlaylistIds.length === 0) continue;

      // 2. Fetch video (link) IDs from the gathered playlists
      const playlistsQuery = `*[_type == "playlist" && _id in $playlistIds] {
        "videoIds": items[@._type == "reference"]._ref
      }`;

      const playlistsData = await client.fetch<{ videoIds: string[] }[]>(
        playlistsQuery,
        { playlistIds: uniquePlaylistIds }
      );

      // Flatten and remove duplicate video IDs
      const videoIdsForTarget = playlistsData
        .flatMap((playlist) => playlist.videoIds || [])
        .filter((id, index, self) => id && self.indexOf(id) === index);

      // Add the target tag to each video's Set in our Map
      for (const videoId of videoIdsForTarget) {
        if (!videoTagsMap.has(videoId)) {
          videoTagsMap.set(videoId, new Set<string>());
        }
        videoTagsMap.get(videoId)!.add(target.tag);
      }

      console.log(
        `Queued ${videoIdsForTarget.length} videos to receive tag: "${target.tag}"`
      );
    }

    const allVideoIds = Array.from(videoTagsMap.keys());

    if (allVideoIds.length === 0) {
      console.log('No videos found to update.');
      return;
    }

    console.log(
      `\n--- Applying updates to ${allVideoIds.length} unique videos ---`
    );

    // 3. Fetch existing values from Sanity
    const existingVideos = await client.fetch<
      Array<{ _id: string } & Record<string, unknown>>
    >(`*[_type == "link" && _id in $ids] { _id, ${TARGET_FIELD} }`, {
      ids: allVideoIds
    });

    // 4. Update the documents in Sanity
    for (const video of existingVideos) {
      // Safely cast the unknown dynamic field to an array of strings
      const existingArray = (video[TARGET_FIELD] as string[] | undefined) || [];
      const tagsToAdd = Array.from(videoTagsMap.get(video._id) || []);

      // Merge existing tags with the new ones, ensuring no duplicates
      const updatedArray = Array.from(
        new Set([...existingArray, ...tagsToAdd])
      );

      // Only patch if the array has actually changed (tags weren't already there)
      if (updatedArray.length !== existingArray.length) {
        try {
          await client
            .patch(video._id)
            .set({ [TARGET_FIELD]: updatedArray })
            .commit();

          totalUpdated++;
          console.log(
            ` ✅ Updated video ${video._id} -> ${TARGET_FIELD}: [${updatedArray.join(', ')}]`
          );
        } catch (error) {
          console.error(` ❌ Failed to update video ${video._id}:`, error);
        }
      }
    }

    console.log(`\n🎉 All done! Successfully updated ${totalUpdated} videos.`);
  } catch (error) {
    console.error('❌ Error in updateVideoTopics:', error);
  }
}
