import { client } from './constants';

export async function cleanNumericKeywords(targetKeyword: string) {
  console.log(
    `Starting to clean numeric keyword from videos containing: "${targetKeyword}"...`
  );
  let totalUpdated = 0;

  try {
    // Fetch only links that contain the specified targetKeyword
    const query = `*[_type == "link" && $targetKeyword in keyWords] {
      _id,
      title,
      keyWords
    }`;

    const videos = await client.fetch<
      { _id: string; title: string; keyWords: string[] }[]
    >(query, { targetKeyword });

    if (!videos || videos.length === 0) {
      console.log(`No videos found with the keyword "${targetKeyword}".`);
      return;
    }

    console.log(`Found ${videos.length} videos to check.`);

    // Iterate and update
    for (const video of videos) {
      // Find the index of the single numeric keyword
      const numericKeywordIndex = video.keyWords.findIndex(
        (kw) => kw && /^\d+$/.test(kw.trim())
      );

      if (numericKeywordIndex !== -1) {
        const removedKeyword = video.keyWords[numericKeywordIndex];

        // Create a new array and remove only that specific element
        const cleanedKeywords = [...video.keyWords];
        cleanedKeywords.splice(numericKeywordIndex, 1);

        try {
          await client
            .patch(video._id)
            .set({ keyWords: cleanedKeywords })
            .commit();

          totalUpdated++;
          console.log(
            ` ✅ Updated video "${video.title}" (${video._id}) -> removed numeric keyword: "${removedKeyword}"`
          );
        } catch (error) {
          console.error(
            ` ❌ Failed to update video "${video.title}" (${video._id}):`,
            error
          );
        }
      }
    }

    console.log(`\n🎉 All done! Successfully updated ${totalUpdated} videos.`);
  } catch (error) {
    console.error('❌ Error in cleanNumericKeywords:', error);
  }
}
