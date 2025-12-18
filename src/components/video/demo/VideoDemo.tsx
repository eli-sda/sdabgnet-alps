import { useState, useEffect } from 'react';
import { Button } from 'src/alps/atoms/Button';
import { loadPlaylists } from 'src/utils/FetchHelper';
import { extractYouTubeId } from 'src/utils/extractYouTubeId';
import { VideoPlaylistType } from '../VideoPlayer';
import { VideoPlayerDialog } from '../VideoPlayerDialog';
import jsonPlaylist from './video_playlist_demo.json';

export const VideoDemo = () => {
  const [open, setOpen] = useState(false);
  const [sanityPlaylist, setSanityPlaylist] =
    useState<VideoPlaylistType | null>(null);
  const [currentPlaylist, setCurrentPlaylist] =
    useState<VideoPlaylistType | null>(null);

  useEffect(() => {
    if (sanityPlaylist) return;
    loadPlaylists('video', false, 'Уебинар "Основи на вярата и науката"')
      .then((res) => {
        const p = res?.[0];
        if (!p) return;

        setSanityPlaylist({
          playlistTitle: p.title ?? '',
          playlistAuthor: p.author ?? '',
          videoItems:
            p.items?.map((i) => ({
              videoId: extractYouTubeId(i.path),
              title: i.title,
              description: i.description ?? ''
            })) ?? []
        });
      })
      .catch(() => setSanityPlaylist(null));
  }, [sanityPlaylist]);

  const handleJsonOpen = () => {
    setCurrentPlaylist(jsonPlaylist);
    setOpen(true);
  };
  const handleSanityOpen = () => {
    setCurrentPlaylist(sanityPlaylist);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <div className="u-spacing">
      <VideoPlayerDialog
        playlist={currentPlaylist}
        isOpen={open}
        onClose={handleClose}
      />

      <Button label="JSON плейлист" onClick={handleJsonOpen} />
      {sanityPlaylist && (
        <Button label="Sanity плейлист" onClick={handleSanityOpen} />
      )}
    </div>
  );
};
