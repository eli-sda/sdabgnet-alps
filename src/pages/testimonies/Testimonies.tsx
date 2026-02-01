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

const TABS = [
  { label: 'Видеа', value: 'videos' },
  { label: 'Видео-поредици', value: 'videoPlaylists' },
  { label: 'Аудиокниги', value: 'audiobooks' },
  { label: 'Истории от СУ', value: 'stories' }
];
const TAB_ITEMS = TABS.map((tab) => (
  <Tab
    key={tab.value}
    label={tab.label}
    value={tab.value}
    className="o-button o-button--outline"
  />
));

const Testimonies = () => {
  useScrollToHash();

  const breadcrumbsUrls = [
    routes.churchLife(),
    routes.churchLife('testimonies')
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = searchParams.get('tab') ?? TABS[0].value;
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
      ></Page>
      <section>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label="testimonies tabs"
            className="testimonies-tabs u-theme--background-color--darker u-padding u-space--top"
            slotProps={{ indicator: { sx: { display: 'none' } } }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {TAB_ITEMS}
          </TabList>

          <TabPanel value="stories" className="full-page">
            <TestimoniesStories />
          </TabPanel>
          <TabPanel value="videos" className="full-page">
            <TestimoniesVideos />
          </TabPanel>
          <TabPanel value="videoPlaylists" className="full-page">
            <TestimoniesVideoPlaylists />
          </TabPanel>
          <TabPanel value="audiobooks">
            <TestimoniesAudiobooks />
          </TabPanel>
        </TabContext>
      </section>
    </>
  );
};

export default Testimonies;
