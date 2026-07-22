import { RiUserVoiceFill } from 'react-icons/ri';
import { LuBookAudio } from 'react-icons/lu';
import routes from 'src/routes';
import { RelatedPostsProps } from 'src/alps/organisms/asides/RelatedPosts';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import { useScrollToHash } from 'src/hooks/useScrollToHash';
import { AudioInstructions } from 'src/components/media/audio/AudioInstructions';
import { AudioPlaylistList } from 'src/components/media/audio/AudioPlaylistList';
import { reactIconProps } from 'src/components/media/MediaPlaylistListDefReactIcon';
import { SUBPAGE_KICKER } from './AudioResources';

type AudioPageProps = {
  type: 'audiobook' | 'seminars' | 'sermons';
  aside?: React.ReactNode;
  relatedPosts?: RelatedPostsProps;
};

const AudioPage = ({ type, aside, relatedPosts }: AudioPageProps) => {
  useScrollToHash();

  const pagePath = routes.resources('audio', type);

  const breadcrumbsUrls = [
    routes.resources(),
    routes.resources('audio'),
    pagePath
  ];

  return (
    <>
      <Page
        title={getTitle(pagePath)}
        kicker={SUBPAGE_KICKER}
        breadcrumbsUrls={breadcrumbsUrls}
        aside={aside}
        relatedPosts={relatedPosts}
      >
        <AudioInstructions type={type} />
        {type === 'audiobook' && (
          <AudioPlaylistList
            pagePath={pagePath}
            defaultImageIcon={<LuBookAudio {...reactIconProps} />}
          />
        )}
      </Page>

      {(type === 'seminars' || type === 'sermons') && (
        <AudioPlaylistList
          pagePath={pagePath}
          defaultImageIcon={<RiUserVoiceFill {...reactIconProps} />}
          withListPadding={true}
        />
      )}
    </>
  );
};

export default AudioPage;
