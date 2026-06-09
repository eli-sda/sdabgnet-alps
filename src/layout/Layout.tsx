import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sabbath } from 'alps-library/organisms/asides/sabbath/Sabbath';
import { Main } from 'alps-library/templates/Main';
import { ResourceUnavailableNotice } from 'src/components/resourceNotification/ResourceUnavailableNotice';
import Footer from './Footer';
import Header from './Header';

const Layout = () => {
  useEffect(() => {
    const handleScroll = () => {
      // Use rAF to run after the ALPS script's jQuery scroll handler
      requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const t = maxScroll > 0 ? scrollTop / maxScroll : 0;
        const opacity = Math.max(0, 1 - t);

        const overlay = document.querySelector<HTMLElement>('.l-sabbath__overlay');
        if (overlay) overlay.style.opacity = String(opacity);

        const logoLight = document.querySelector<HTMLElement>('.l-sabbath__logo-light');
        if (logoLight) logoLight.style.opacity = String(opacity);
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
