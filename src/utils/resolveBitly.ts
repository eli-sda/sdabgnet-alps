import { SITE } from 'src/constants';
/**
 * Resolve a bit.ly short URL to its final destination
 * Extracts the YouTube URL from the Bitly preview page
 */
/*
export async function resolveBitlyUrl(
  shortUrl: string
): Promise<string | null> {
  try {
    // Use AllOrigins to get the HTML content
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      shortUrl
    )}`;

    const response = await fetch(proxyUrl);
    const data = (await response.json()) as {
      contents: string;
    };

    // Extract the Location URL from the JavaScript in the HTML
    const locationMatch = data.contents.match(/"Location":"([^"]+)"/);

    if (!locationMatch || !locationMatch[1]) {
      console.error('Could not extract Location from response');
      return null;
    }

    let finalUrl = locationMatch[1];
    // Unescape any escaped slashes
    finalUrl = finalUrl.replace(/\\\//g, '/');

    // Convert to embed format if it's a YouTube URL
    if (finalUrl.includes('youtube.com/watch')) {
      const url = new URL(finalUrl);
      const videoId = url.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (finalUrl.includes('youtu.be/')) {
      const videoId = finalUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return finalUrl;
  } catch (error) {
    console.error('Failed to resolve bit.ly URL:', error);
    return null;
  }
}
  */

/**
 * Use the PHP backend resolver
 */
export async function resolveBitlyViaBackend(
  shortUrl: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `${SITE}/bitly-resolver.php?url=${encodeURIComponent(shortUrl)}`
    );

    if (!response.ok) {
      // console.error('Failed to resolve URL:', response.statusText);
      return null;
    }

    const data = (await response.json()) as { url: string; error?: string };

    if (data.error) {
      console.error('Error resolving URL:', data.error);
      return null;
    }

    const finalUrl = data.url;

    // Convert to embed format
    if (finalUrl.includes('youtube.com/watch')) {
      const url = new URL(finalUrl);
      const videoId = url.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (finalUrl.includes('youtu.be/')) {
      const videoId = finalUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return finalUrl;
  } catch (error) {
    console.error('Failed to resolve bit.ly URL via backend:', error);
    return null;
  }
}
