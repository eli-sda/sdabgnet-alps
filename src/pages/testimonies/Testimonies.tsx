import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import TestimoniesVideos from './TestimoniesVideos';
import TestimoniesVideoPlaylists from './TestimoniesVideoPlaylists';
import TestimoniesAudiobooks from './TestimoniesAudiobooks';
import TestimoniesStories from './TestimoniesStories';
import './Testimonies.scss';

const DEFAULT_TAB = 'stories';

const Testimonies = () => {
  useScrollToHash();

  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.churchLife('testimonies')
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = searchParams.get('tab') ?? DEFAULT_TAB;
  const [value, setValue] = React.useState(tabFromUrl);

  React.useEffect(() => {
    setValue(tabFromUrl);
  }, [tabFromUrl]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setSearchParams({ tab: newValue });
  };

  return (
    <>
      <Page
        title={getTitle(routes.churchLife('testimonies'))}
        breadcrumbsUrls={breadcrumbsUrls}
      />

      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="testimonies tabs"
          className="testimonies-tabs u-theme--background-color--darker u-padding u-space--top rbc-btn-group"
          slotProps={{ indicator: { sx: { display: 'none' } } }}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab
            label="Истории от СУ"
            value="stories"
            className="o-button o-button--outline"
          />
          <Tab
            label="Видеа"
            value="videos"
            className="o-button o-button--outline"
          />
          <Tab
            label="Видео-поредици"
            value="videoPlaylists"
            className="o-button o-button--outline"
          />
          <Tab
            label="Аудиокниги"
            value="audiobooks"
            className="o-button o-button--outline"
          />
        </TabList>

        <TabPanel value="stories">
          <TestimoniesStories />
        </TabPanel>
        <TabPanel value="videos">
          <TestimoniesVideos />
        </TabPanel>
        <TabPanel value="videoPlaylists">
          <TestimoniesVideoPlaylists />
        </TabPanel>
        <TabPanel value="audiobooks">
          <TestimoniesAudiobooks />
        </TabPanel>
      </TabContext>
    </>
  );
};

export default Testimonies;
