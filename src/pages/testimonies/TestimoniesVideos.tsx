import { useEffect, useState } from 'react';
import { LinkType, PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { usePlaylists } from 'src/hooks/usePlaylists';
import VideoGrid from 'src/components/media/video/videoGrid/VideoGrid';

const TestimoniesVideos = () => {
  useScrollToHash();

  const { getPlaylists } = usePlaylists();

  const [videos, setVideos] = useState<LinkType[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

  useEffect(() => {
    getPlaylists('testimony_video', false)
      .then((data: PlaylistType[]) => {
        // Find the playlist that contains 'SINGLE' in its title
        const singlePlaylist = data.find((p) => p.title?.includes('SINGLE'));

        if (singlePlaylist && singlePlaylist.items) {
          // Set its videos to the videos state
          setVideos(singlePlaylist.items);
        } else {
          setVideos([]);
        }

        // Filter out the 'SINGLE' playlist to keep the rest clean
        const regularPlaylists = data.filter(
          (p) => !p.title?.includes('SINGLE')
        );
        setPlaylists(regularPlaylists);
      })
      .catch((err) => {
        console.error(err);
        setVideos([]);
        setPlaylists([]);
      });
  }, [getPlaylists]);

  return (
    <VideoGrid videos={videos} playlists={playlists} isPlaylistFirst={true} />
  );
};

export default TestimoniesVideos;
