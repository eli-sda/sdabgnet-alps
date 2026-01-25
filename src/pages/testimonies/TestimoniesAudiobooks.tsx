import { useEffect, useState } from 'react';
import routes from 'src/routes';
import { RelatedPosts } from 'src/alps/organisms/asides/RelatedPosts';
import { getTitle } from 'src/utils/Navigation';
import { PlaylistType } from 'src/contexts/PlaylistsContext';
import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';

const TestimoniesAudiobooks = () => {
  const [testimoniesAudiobooks, setTestimoniesAudiobooks] = useState<
    PlaylistType[]
  >([]);

  useEffect(() => {
    fetch('/testimonies-audiobooks.json')
      .then((res) => res.json())
      .then((data: PlaylistType[]) => {
        setTestimoniesAudiobooks(data);
      })
      .catch((err) => {
        console.error('Failed to load testimoniesAudiobooks.json', err);
        setTestimoniesAudiobooks([]);
      });
  }, []);

  return (
    <section className="l-main__content u-padding--zero--sides u-spacing--double--until-large l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7">
      <section className="page_cont c-article l-grid-item l-grid-item--l--4-col l-grid-item--xl--3-col">
        <div className="c-article__body">
          <VideoPlaylistList playlists={testimoniesAudiobooks} />
        </div>
      </section>
      <div className="c-sidebar u-spacing--double l-grid-item l-grid-item--l--2-col l-grid-item--xl--2-col">
        <RelatedPosts
          heading="Аудиокниги"
          blocks={[
            {
              title: 'Невероятни отговори на молитви',
              url: '/resources/audio/audiobook?playlistTitle=Невероятни+отговори+на+молитви#cacfab53-fbf9-43e1-9892-df74cfb0ac0a',
              category: getTitle(routes.resources('audio', 'audiobook'))
            },
            {
              title: 'Още невероятни отговори на молитви - книга 2',
              url: '/resources/audio/audiobook?playlistTitle=Още+невероятни+отговори+на+молитви+-+книга+2#9f599f77-1fbc-40ad-bae4-ba237d743f8a',
              category: getTitle(routes.resources('audio', 'audiobook'))
            },
            {
              title:
                'Когато се нуждаеш от още невероятни отговори на молитви - книга 3',
              url: '/resources/audio/audiobook?playlistTitle=Когато+се+нуждаеш+от+още+невероятни+отговори+на+молитви+-+книга+3#67f1c908-b941-4901-aa06-8e5ab952a290',
              category: getTitle(routes.resources('audio', 'audiobook'))
            }
          ]}
        />
      </div>
    </section>
  );
};

export default TestimoniesAudiobooks;
