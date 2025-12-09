import { useEffect, useState } from 'react';
import { Footer as AlpsFooter } from 'alps-library/organisms/global/footer/Footer';
import { FooterPrimaryNavigationProps } from 'alps-library/molecules/navigation/footerPrimaryNavigation/FooterPrimaryNavigation';
import { OLD_SITE } from 'src/constants';
import ScrollUpButton from './ScrollUpButton';

const scriptsToLoad = [
  //see https://alps.adventist.io/v3/?p=viewall-pages-misc
  // see latest ver. https://cdn.adventist.org/alps/3/versions.json
  // '//cdn.adventist.org/alps/3/latest/js/head-script.min.js',//not loading leatest ver.
  // '//cdn.adventist.org/alps/3/latest/js/script.min.js'//not loading leatest ver.
  'https://cdn.adventist.org/alps/3/3.12.2/js/head-script.min.js',
  // 'https://cdn.adventist.org/alps/3/3.12.2/js/script.min.js'
  '/js/script.min.js'
];

const loadScript = (url: string, id: string) => {
  return new Promise<void>((resolve, _reject) => {
    if (!document.getElementById(id)) {
      const script = document.createElement('script');
      script.type = 'text/javascript';

      script.onload = function () {
        resolve();
      };
      script.id = id;
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  });
};

const Footer = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadScripts() {
      await Promise.all(
        scriptsToLoad.map((script, index) =>
          loadScript(script, `script${index}`)
        )
      );
    }
    if (!loaded) {
      setLoaded(true);
      loadScripts().catch((e) => console.log(e));
    }
  }, []);
  const primaryNav: FooterPrimaryNavigationProps = {
    items: [
      {
        text: 'webmaster@sdabg.net',
        url: 'mailto:webmaster@sdabg.net?subject=new.sdabg.net'
      },
      {
        text: 'Старият сайт: old.sdabg.net',
        url: OLD_SITE
      }
    ]
  };

  return (
    <>
      <AlpsFooter
        address={{
          //   street: 'Цветан Минков 11',
          //   postcode: '1000',
          locality: 'София',
          //   region: '',
          country: 'България',
          phone: '0887 430 103'
        }}
        copyright="Copyright ©2004, Адвентната българска мрежа"
        primaryNav={primaryNav}
        text="Sdabg.net  - Адвентната българска мреж@ е портал с полезни ресурси и връзки в помощ на ЦАСД в България"
      />
      <ScrollUpButton />
    </>
  );
};

export default Footer;
