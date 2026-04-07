export const extractYouTubeId = (url: string): string => {
  if (!url) return '';

  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]+)/;

  const match = url.match(regExp);

  return match ? match[1] : '';
};

export const extractRumbleId = (url: string): string => {
  if (!url) return '';

  const regExp = /(?:rumble\.com\/embed\/)([^"&?/\s]+)/;
  const match = url.match(regExp);

  return match ? match[1] : '';
};
