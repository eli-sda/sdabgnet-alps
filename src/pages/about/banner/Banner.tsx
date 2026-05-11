import routes from 'src/routes';
import { Button } from 'src/alps/atoms/Button';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import './Banner.scss';

const Banner = () => {
  const breadcrumbsUrls = [routes.about(), routes.about('banner')];

  const bannerHtml = `<a href="https://sdabg.net" target="_blank" rel="noopener noreferrer">
  <img src="//sdabg.net/img/sdabg.net-map-logo.svg"
  title="Адвентната българска мреж@"
  alt="Адвентната българска мреж@ - лого" width="200" />
</a>`;

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(bannerHtml);
  };

  return (
    <Page
      title={getTitle(routes.about('banner'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <section className="u-spacing banner-page">
        <h3 className="u-theme--color--darker">
          За да сложите на вашия сайт банер от този вид:
        </h3>

        {/* Shows the actual banner */}
        <div dangerouslySetInnerHTML={{ __html: bannerHtml }} />

        <h3 className="u-theme--color--darker">
          копирайте и използвайте следния код:
        </h3>
        <pre>
          <code>{bannerHtml}</code>
        </pre>
        <Button onClick={copyToClipboard} label="Копирай" outline />
      </section>
    </Page>
  );
};

export default Banner;
