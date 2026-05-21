import VideoPlaylistList from 'src/components/media/video/VideoPlaylistList';

const testimonyVideoPlaylistsPath = '/church_life/testimonies?tab=videoPlaylists';

const TestimoniesVideoPlaylists = () => {
  return <VideoPlaylistList pagePath={testimonyVideoPlaylistsPath} />;
};
export default TestimoniesVideoPlaylists;
