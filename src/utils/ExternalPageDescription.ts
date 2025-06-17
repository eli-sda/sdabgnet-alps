// Usage of the PHP endpoint to get meta description by URL
type FetchDescriptionResult = {
  description: string | null;
  error?: string;
};

export async function fetchMetaDescription(
  url: string
): Promise<FetchDescriptionResult> {
  const response = await fetch(
    `https://new.sdabg.net/get-meta-description.php?url=${encodeURIComponent(
      url
    )}`
  );
  const data: unknown = await response.json();
  if (typeof data === 'object' && data !== null && 'description' in data) {
    return data as FetchDescriptionResult;
  }
  return { description: null, error: 'Unexpected response format' };
}
