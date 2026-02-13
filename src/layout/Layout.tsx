import { Outlet } from 'react-router-dom';
import { Sabbath } from 'alps-library/organisms/asides/sabbath/Sabbath';
import { Main } from 'alps-library/templates/Main';
import { ResourceUnavailableNotice } from 'src/components/resourceNotification/ResourceUnavailableNotice';
import Footer from './Footer';
import Header from './Header';

const Layout = () => {
  return (
    <div className="l-wrap">
      <div className="l-wrap__content l-content" role="document">
        <Header />
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
