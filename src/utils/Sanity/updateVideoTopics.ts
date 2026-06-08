import { client, SanityReference } from './constants';
import { loadAllTopics } from 'src/utils/FetchHelper';

export async function updateVideoTopics() {
  console.log('Starting to update video topics (as references)...');
  let totalUpdated = 0;

  const targets = [
    {
      name: 'All Health Pages',
      condition: 'path.current match "*/health*"',
      topicTitle: 'здраве'
    },
    {
      name: '/health/new-start Page',
      condition: 'path.current == "/health/new-start"',
      topicTitle: 'здравни принципи'
    }
  ];

  try {
    // Resolve topic titles to Sanity _ids
    const allTopics = await loadAllTopics();
    const topicByTitle = new Map(
      allTopics.map((t) => [t.title.toLowerCase(), t._id])
    );

    // Map: videoId -> Set of topicIds to be added
    const videoTagsMap = new Map<string, Set<string>>();

    for (const target of targets) {
      const topicId = topicByTitle.get(target.topicTitle.toLowerCase());
      if (!topicId) {
        console.warn(
          `⚠️ Topic "${target.topicTitle}" not found in Sanity. Skipping.`
        );
        continue;
      }

      console.log(
        `\n--- Gathering videos for: ${target.name} (topicId: ${topicId}) ---`
      );

      // 1. Fetch playlist IDs from pages matching the current condition
      const pageQuery = `*[_type == "page" && ${target.condition}] {
        "playlistIds": items[@._type == "reference"]._ref
      }`;

      const pagesData = await client.fetch<{ playlistIds: string[] }[] | null>(
        pageQuery
      );

      if (!pagesData || pagesData.length === 0) continue;

      // Flatten and deduplicate playlist IDs
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

      // Flatten and deduplicate video IDs
      const videoIdsForTarget = playlistsData
        .flatMap((playlist) => playlist.videoIds || [])
        .filter((id, index, self) => id && self.indexOf(id) === index);

      // Add the topic ID to each video's Set in the map
      for (const videoId of videoIdsForTarget) {
        if (!videoTagsMap.has(videoId)) {
          videoTagsMap.set(videoId, new Set<string>());
        }
        videoTagsMap.get(videoId)!.add(topicId);
      }

      console.log(
        `Queued ${videoIdsForTarget.length} videos to receive topic: "${target.topicTitle}"`
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

    // 3. Fetch existing topics (references) from Sanity
    const existingVideos = await client.fetch<
      Array<{ _id: string; title: string; topicRefs?: string[] }>
    >(
      `*[_type == "link" && _id in $ids] { _id, title, "topicRefs": topics[]._ref }`,
      {
        ids: allVideoIds
      }
    );

    // 4. Update the documents in Sanity
    for (const video of existingVideos) {
      const existingRefs = new Set(video.topicRefs ?? []);
      const topicIdsToAdd = videoTagsMap.get(video._id) ?? new Set<string>();

      // Only add topics that are not already referenced
      const newReferences: SanityReference[] = [...topicIdsToAdd]
        .filter((id) => !existingRefs.has(id))
        .map((id) => ({
          _type: 'reference',
          _ref: id,
          _key: id.replace(/-/g, '').slice(0, 12)
        }));

      if (newReferences.length === 0) continue;

      try {
        await client
          .patch(video._id)
          .setIfMissing({ topics: [] })
          .append('topics', newReferences)
          .commit();

        totalUpdated++;
        console.log(
          ` ✅ Updated video "${video.title}" (${video._id}) -> added ${newReferences.length} topic(s)`
        );
      } catch (error) {
        console.error(
          ` ❌ Failed to update topics for video "${video.title}" (${video._id}):`,
          error
        );
      }
    }

    console.log(`\n🎉 All done! Successfully updated ${totalUpdated} videos.`);
  } catch (error) {
    console.error('❌ Error in updateVideoTopics:', error);
  }
}
