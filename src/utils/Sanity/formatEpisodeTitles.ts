import { client } from './constants';

export async function formatEpisodeTitles(playlistName: string) {
  console.log(
    `Starting to format episode titles for playlist: "${playlistName}"...`
  );
  let totalUpdated = 0;

  try {
    // Fetch the playlist by title and resolve its referenced items directly
    const playlistQuery = `*[_type == "playlist" && type == "video" && title == $playlistName][0] {
      _id,
      title,
      "videos": items[@._type == "reference"]->{
        _id,
        title
      }
    }`;

    const playlist = await client.fetch<{
      _id: string;
      title: string;
      videos: { _id: string; title: string }[];
    } | null>(playlistQuery, {
      playlistName
    });

    if (!playlist) {
      console.log(`No playlist found with title "${playlistName}".`);
      return;
    }

    if (!playlist.videos || playlist.videos.length === 0) {
      console.log(
        `Playlist "${playlistName}" has no items or no valid video references.`
      );
      return;
    }

    console.log(
      `Found playlist "${playlist.title}" with ${playlist.videos.length} videos. Checking for matching titles...`
    );

    // Regular expression to match titles ending in "- епизод XX"
    const regex = /^(.+?)\s*[-–—]\s*[eе]пизод\s*(\d+)\s*$/i;

    for (const video of playlist.videos) {
      if (!video.title) continue;

      const match = video.title.match(regex);

      // Ensure match exists and capture groups are populated
      if (match && match[1] && match[2]) {
        const baseTitle = match[1].trim();
        const episodeNumber = match[2];
        const newTitle = `${episodeNumber}. ${baseTitle}`;

        console.log(`\n🔄 Renaming: "${video.title}"`);
        console.log(`   ➔ To:      "${newTitle}"`);

        try {
          await client.patch(video._id).set({ title: newTitle }).commit();

          totalUpdated++;
          console.log(`   ✅ Success`);
        } catch (error) {
          console.error(`   ❌ Failed to rename video ${video._id}:`, error);
        }
      }
    }

    console.log(`\n🎉 All done! Successfully renamed ${totalUpdated} videos.`);
  } catch (error) {
    console.error('❌ Error in formatEpisodeTitles:', error);
  }
}
