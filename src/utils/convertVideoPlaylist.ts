import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { VideoPlaylistType } from 'src/components/media/video/VideoPlayer';

// Convert a VideoPlaylistType (demo shape) into the PlaylistType expected by MediaPlaylistList
export const convertVideoPlaylistToPlaylist = (
  video: VideoPlaylistType
): PlaylistType => {
  return {
    _id: video._id,
    title: video.playlistTitle,
    author: video.playlistAuthor,
    items:
      video.videoItems?.map((v) => ({
        path: `https://www.youtube.com/watch?v=${v.videoId}`,
        title: v.title,
        description: v.description
      })) || []
  } as PlaylistType;
};
