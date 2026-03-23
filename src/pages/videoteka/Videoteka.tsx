import { useEffect, useState, useMemo } from 'react';

import { Autocomplete, TextField } from '@mui/material';
import { Caption } from 'alps-library/atoms/text/Caption';
import routes from 'src/routes';
import { Button } from 'src/alps/atoms/Button';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { loadAllTopics, loadLinksByTopics } from 'src/utils/FetchHelper';
import { LinkType, TopicType } from 'src/contexts/PlaylistsContext';
import { VideoLinkBlock } from './VideoLinkBlock';
import DownloadList from 'src/components/downloadList/DownloadList';
import './Videoteka.scss';

const Videoteka = () => {
  const breadcrumbsUrls = [routes.videoteka];
  const [allTopics, setAllTopics] = useState<TopicType[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<TopicType[]>([]);
  const [appliedTopics, setAppliedTopics] = useState<TopicType[]>([]);
  const [videos, setVideos] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAllTopics()
      .then(setAllTopics)
      .catch((err) => {
        console.error('Failed to load topics', err);
        setAllTopics([]);
      });
  }, []);

  useEffect(() => {
    if (appliedTopics.length > 0) {
      setIsLoading(true);
      loadLinksByTopics(appliedTopics.map((t) => t._id))
        .then(setVideos)
        .catch((err) => {
          console.error('Failed to load videos by topics', err);
          setVideos([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setVideos([]);
    }
  }, [appliedTopics]);

  const handleSearch = () => {
    setAppliedTopics(selectedTopics);
  };

  const { resourceVideos, youtubeVideos } = useMemo(() => {
    const resourceVideos = videos.filter((video) => video.isResource === true);
    const youtubeVideos = videos.filter((video) => video.isResource !== true);
    return { resourceVideos, youtubeVideos };
  }, [videos]);

  return (
    <Page title={getTitle(routes.videoteka)} breadcrumbsUrls={breadcrumbsUrls}>
      <div className="u-spacing--double">
        <section className="u-spacing">
          <Caption>
            Изберете поне една тема, за да търсите видео ресурси
          </Caption>

          <div className="videoteka-search-wrapper u-spacing">
            <Autocomplete<TopicType, true>
              multiple
              options={allTopics}
              value={selectedTopics}
              onChange={(_event, newValue) => setSelectedTopics(newValue)}
              getOptionLabel={(option) => option.title}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              clearText="Изчисти"
              openText="Отвори"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Филтрирай по теми"
                  placeholder="Избери теми"
                />
              )}
            />
            <Button
              label="Търси"
              onClick={handleSearch}
              disabled={selectedTopics.length === 0}
            />
          </div>
        </section>
        {isLoading && (
          <div className="centered-text">
            <i className="fas fa-spinner fa-pulse fa-5x u-space--triple"></i>
          </div>
        )}

        {!isLoading && resourceVideos.length > 0 && (
          <section className="u-spacing">
            <h2 className="u-font--primary--m u-theme--color--darker">
              Видео ресурси за изтегляне
            </h2>
            <DownloadList items={resourceVideos} />
          </section>
        )}

        {!isLoading && youtubeVideos.length > 0 && (
          <section className="u-spacing">
            <h2 className="u-font--primary--m u-theme--color--darker">
              YouTube видеа
            </h2>
            {youtubeVideos.map((video, i) => (
              <VideoLinkBlock key={video._id || i} video={video} appliedTopics={appliedTopics} />
            ))}
          </section>
        )}

        {!isLoading && appliedTopics.length > 0 && videos.length === 0 && (
          <div className="u-spacing u-text-align--center">
            <p>Не са намерени резултати за избраните теми.</p>
          </div>
        )}
      </div>
    </Page>
  );
};

export default Videoteka;
