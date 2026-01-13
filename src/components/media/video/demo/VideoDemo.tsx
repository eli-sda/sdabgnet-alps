import { useState, useEffect } from 'react';
import { loadPlaylists } from 'src/utils/FetchHelper';
import jsonPlaylist from './video_playlist_demo.json';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import VideoPlaylistList from '../VideoPlaylistList';

export const VideoDemo = () => {
  const [playlists, setPlaylists] = useState<PlaylistType[]>();

  useEffect(() => {
    const plArr = [jsonPlaylist as PlaylistType];
    loadPlaylists('video', false, 'Уебинар "Основи на вярата и науката"')
      .then((res) => {
        const p = res?.[0];
        if (!p) {
          setPlaylists(plArr);
          return;
        }
        plArr.push(p);
        setPlaylists(plArr);
      })
      .catch((e) => {
        setPlaylists(plArr);
        console.error('Error loading video playlists:', e);
      });
  }, []); //useEffect runs once

  return (
    <section>
      <h3>Видео демо</h3>
      {!!playlists && (
        <>
          <VideoPlaylistList playlists={playlists} sanityType="bible_ref" />
          <VideoPlaylistList sanityType="testimony" />
        </>
      )}
    </section>
  );
};
