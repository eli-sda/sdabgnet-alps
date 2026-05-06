import { Outlet } from 'react-router-dom';
import { Sabbath } from 'alps-library/organisms/asides/sabbath/Sabbath';
import { Main } from 'alps-library/templates/Main';
import { ResourceUnavailableNotice } from 'src/components/resourceNotification/ResourceUnavailableNotice';
import { WelcomeDialog } from 'src/components/welcomeDialog/WelcomeDialog';
import { useWelcomeDialog } from 'src/hooks/useWelcomeDialog';
import Footer from './Footer';
import Header from './Header';

const Layout = () => {
  const { hasSeenWelcome, markAsSeen } = useWelcomeDialog();

  return (
    <div className="l-wrap">
      <div className="l-wrap__content l-content" role="document">
        <Header />
        <WelcomeDialog isOpen={!hasSeenWelcome} onClose={markAsSeen} />
        <ResourceUnavailableNotice />
        <Main>
          <Outlet />
        </Main>
        <Footer />
      </div>
      <Sabbath />
    </div>
  );
};
export default Layout;
