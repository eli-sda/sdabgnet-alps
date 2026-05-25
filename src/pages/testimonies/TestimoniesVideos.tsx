import { useEffect, useState } from 'react';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { usePlaylists } from 'src/hooks/usePlaylists';
import VideoGrid from 'src/components/media/video/videoGrid/VideoGrid';

const testimonyVideosPath = '/church_life/testimonies';

const TestimoniesVideos = () => {
  useScrollToHash();

  const { getPagePlaylists } = usePlaylists();

  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

  useEffect(() => {
    getPagePlaylists(testimonyVideosPath)
      .then((data: PlaylistType[]) => {
        setPlaylists(data);
      })
      .catch((err) => {
        console.error(err);

        setPlaylists([]);
      });
  }, [getPagePlaylists]);

  return (
    <VideoGrid items={playlists} tabParam="videos" isPlaylistFirst={true} />
  );
};

export default TestimoniesVideos;
