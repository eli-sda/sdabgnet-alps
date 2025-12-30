import { memo, useState } from 'react';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import MediaPlaylistList from 'src/pages/resources/MediaPlaylistList';
import { VideoPlaylistType } from './VideoPlayer';
import { extractYouTubeId } from 'src/utils/extractYouTubeId';
import { VideoPlayerDialog } from './VideoPlayerDialog';

type VideoPlaylistListProps = {
  type?: string;
  playlist?: PlaylistType;
  showDownloadAll?: boolean;
};

const VideoPlaylistList = ({ type, playlist }: VideoPlaylistListProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [videoPlaylist, setVideoPlaylist] = useState<VideoPlaylistType | null>(
    null
  );

  const handleVideoPlaylistSelect = (playlist: PlaylistType) => {
    setVideoPlaylist({
      _id: playlist._id,
      playlistTitle: playlist.title ?? '',
      playlistAuthor: playlist.author,
      videoItems:
        playlist.items?.map((item) => ({
          videoId: extractYouTubeId(item.path) ?? '',
          title: item.title ?? '',
          description: item.description ?? ''
        })) ?? []
    });

    setDialogOpen(true);
  };

  return (
    <>
      <MediaPlaylistList
        type={type}
        playlist={playlist}
        onPlaylistSelect={handleVideoPlaylistSelect}
        mediaType="video"
      />

      {videoPlaylist && (
        <VideoPlayerDialog
          isOpen={dialogOpen}
          playlist={videoPlaylist}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
};

export default memo(VideoPlaylistList);
