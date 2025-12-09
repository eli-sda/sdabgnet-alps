import { useState, useEffect } from 'react';
import { Button } from 'src/alps/atoms/Button';
import { InfoDialog } from 'src/organisms/sections/InfoDialog';
import { loadPlaylists } from 'src/utils/FetchHelper';
import { extractYouTubeId } from 'src/utils/extractYouTubeId';
import VideoPlayer, { VideoPlaylistType } from './VideoPlayer';
import jsonPlaylist from './video_playlist_demo.json';

export const VideoDemo = () => {
  const [isJsonDialogOpen, setJsonOpen] = useState(false);
  const [isSanityDialogOpen, setSanityOpen] = useState(false);

  const [sanityPlaylist, setSanityPlaylist] =
    useState<VideoPlaylistType | null>(null);

  const [sanityLoading, setSanityLoading] = useState(false);

  useEffect(() => {
    if (!isSanityDialogOpen) return;

    setSanityLoading(true);

    loadPlaylists('video', 'Уебинар "Основи на вярата и науката"')
      .then((res) => {
        const p = res?.[0];
        if (!p) return setSanityPlaylist(null);

        setSanityPlaylist({
          playlistTitle: p.title ?? '',
          playlistAuthor: p.author ?? '',
          videoItems:
            p.items?.map((i) => ({
              videoId: extractYouTubeId(i.URL ?? ''),
              title: i.title
            })) ?? []
        });
      })
      .catch(() => setSanityPlaylist(null))
      .finally(() => setSanityLoading(false));
  }, [isSanityDialogOpen]);

  return (
    <div className="u-spacing">
      <InfoDialog
        title="JSON Плейлист"
        fullScreen
        isOpen={isJsonDialogOpen}
        onClose={() => setJsonOpen(false)}
      >
        <VideoPlayer playlist={jsonPlaylist as VideoPlaylistType} />
      </InfoDialog>

      <InfoDialog
        title="Sanity Плейлист"
        fullScreen
        isOpen={isSanityDialogOpen}
        onClose={() => setSanityOpen(false)}
      >
        {sanityLoading && <div>Зареждане…</div>}
        {!sanityLoading && sanityPlaylist && (
          <VideoPlayer playlist={sanityPlaylist} />
        )}
        {!sanityLoading && !sanityPlaylist && <div>Няма плейлист.</div>}
      </InfoDialog>

      <Button label="JSON плейлист" onClick={() => setJsonOpen(true)} />
      <Button label="Sanity плейлист" onClick={() => setSanityOpen(true)} />
    </div>
  );
};
