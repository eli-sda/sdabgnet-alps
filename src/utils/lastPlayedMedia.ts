const STORAGE_KEY = 'last_played_media';

export interface LastPlayedMediaEntry {
  itemId: string;
  title: string;
  time?: number;
}

export interface LastPlayedMediaData {
  [playlistId: string]: LastPlayedMediaEntry;
}

export const saveLastPlayedMedia = (
  playlistId: string,
  itemId: string,
  title: string,
  time?: number
) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as unknown) : {};
    const data = parsed as LastPlayedMediaData;

    // Prevent overwriting the saved time if auto-saving the same item without a specific time
    const existing = data[playlistId];
    const timeToSave =
      time === undefined && existing?.itemId === itemId ? existing.time : time;

    data[playlistId] = { itemId, title, time: timeToSave };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving last played media to local storage', e);
  }
};

export const getLastPlayedMedia = (
  playlistId: string
): LastPlayedMediaEntry | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as unknown;
      const data = parsed as LastPlayedMediaData;
      return data[playlistId] || null;
    }
  } catch (e) {
    console.error('Error reading last played media from local storage', e);
  }
  return null;
};
