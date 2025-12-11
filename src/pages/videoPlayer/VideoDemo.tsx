import { useState, useEffect, useCallback } from 'react';
import { Button } from 'src/alps/atoms/Button';
import { loadPlaylists } from 'src/utils/FetchHelper';
import { extractYouTubeId } from 'src/utils/extractYouTubeId';
import { VideoPlaylistType } from './VideoPlayer';
import { VideoPlayerDialog } from './VideoPlayerDialog';
import jsonPlaylist from './video_playlist_demo.json';

export const VideoDemo = () => {
  const [openDialog, setOpenDialog] = useState<'json' | 'sanity' | null>(null);
  const [sanityPlaylist, setSanityPlaylist] =
    useState<VideoPlaylistType | null>(null);

  useEffect(() => {
    if (openDialog !== 'sanity') return;

    setSanityPlaylist(null);

    loadPlaylists('video', 'Уебинар "Основи на вярата и науката"')
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
  }, [openDialog]);

  const handleJsonOpen = useCallback(() => setOpenDialog('json'), []);
  const handleSanityOpen = useCallback(() => setOpenDialog('sanity'), []);
  const handleClose = useCallback(() => setOpenDialog(null), []);

  const currentPlaylist = openDialog === 'json' ? jsonPlaylist : sanityPlaylist;

  return (
    <div className="u-spacing">
      <VideoPlayerDialog
        playlist={currentPlaylist}
        isOpen={openDialog !== null}
        onClose={handleClose}
      />

      <Button label="JSON плейлист" onClick={handleJsonOpen} />
      <Button label="Sanity плейлист" onClick={handleSanityOpen} />
    </div>
  );
};
