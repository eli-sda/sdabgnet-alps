// based on PageHeaderFeature2.tsx
import './DarkTitle.scss';

type DarkTitleProps = {
  title: string;
  kicker?: string;
  imageUrl?: string;
  maxImageWidth?: number;
};
export const DarkTitle = ({
  title,
  kicker,
  imageUrl,
  maxImageWidth
}: DarkTitleProps) => (
  <div className="dark-title c-media-block c-block c-block__inline can-be--dark-dark u-padding u-spacing--until-medium u-theme--background-color--darker">
    {imageUrl && (
      <div className="c-block__image">
        <div className="c-block__image-outer-wrap">
          <div className="c-block__image-wrap">
            <div>
              <picture className="picture">
                <img src={imageUrl} style={{ maxWidth: maxImageWidth }} />
              </picture>
            </div>
          </div>
        </div>
      </div>
    )}
    <div className="c-block__content u-spacing u-border--left u-theme--border-color--light--left u-theme--color--lighter ">
      <div className="c-block__group u-spacing ">
        <div className="u-width--100p u-spacing">
          {kicker && (
            <h3 className="c-block__kicker u-space--quarter--bottom">
              {kicker}
            </h3>
          )}
          <h3 className="c-block__title hyphens-auto u-color--white u-font--primary u-space--zero u-theme--color--lighter">
            <span className="c-block__title-link u-theme--link-hover--light">
              <span className="u-theme--link-hover--light">{title}</span>
            </span>
          </h3>
        </div>
      </div>
    </div>
  </div>
);
