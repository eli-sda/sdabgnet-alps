// modified Slide.tsx from alps - not usig grid classes for text wrap
import { useEffect, useRef, useState } from 'react';
import { Button } from 'src/alps/atoms/Button';
import { Picture } from 'alps-library/atoms/images/Picture';
import { ImageType } from 'alps-library/atoms/images/ImageType';
import { NavLink } from 'react-router-dom';

export interface SlideProps {
  className?: string;
  /**
   * Specify the cta of your Slide
   */
  cta?: string;
  /**
   * Specify the dek of your Slide
   */
  dek?: string;
  /**
   * Specify the heading of your Slide
   */
  heading?: string;
  /**
   * Specify the image of your Slide
   */
  image: ImageType;
  /**
   * Specify whether the Slide should be an imageIsLazy variant
   */
  imageIsLazy?: boolean;
  /**
   * Specify the subtitle of your Slide
   */
  subtitle?: string;
  /**
   * Specify the textClass of your Slide
   */
  textClass?: string;
  /**
   * Specify the url of your Slide
   */
  url?: string;
}

export const Slide = ({
  className = '',
  cta,
  dek,
  heading,
  image,
  imageIsLazy,
  textClass = '',
  url
}: SlideProps): JSX.Element => {
  const [isVertical, setIsVertical] = useState(false);
  const pictureRef = useRef<HTMLDivElement>(null);
  const isExternal = url?.startsWith('http');

  useEffect(() => {
    const imgElement = pictureRef.current?.querySelector('img');
    if (imgElement) {
      const checkOrientation = () => {
        if (imgElement.naturalWidth && imgElement.naturalHeight) {
          setIsVertical(imgElement.naturalHeight > imgElement.naturalWidth);
        }
      };

      if (imgElement.complete) {
        checkOrientation();
      } else {
        imgElement.addEventListener('load', checkOrientation);
        return () => imgElement.removeEventListener('load', checkOrientation);
      }
    }
  }, [image]);

  const imgEl = (
    <div ref={pictureRef}>
      <Picture image={image} lazy={imageIsLazy} />
    </div>
  );
  const imgLink = url ? (
    isExternal ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {imgEl}
      </a>
    ) : (
      <NavLink to={url}>{imgEl}</NavLink>
    )
  ) : (
    imgEl
  );

  return (
    <div
      className={`c-carousel__item ${isVertical ? 'is-vertical' : ''} ${className}`}
    >
      {imgLink}
      {heading && (
        <div className="c-carousel__item-text__wrap l-grid">
          <div className={'l-grid-item'}>
            <div
              className={`c-carousel__item-text u-padding--double--left u-padding--double--right u-padding--half u-spacing--half ${textClass}`}
            >
              <div className="c-carousel__item-text--inner u-spacing--half">
                <h2 className="c-carousel__item-heading u-font--primary--l">
                  {heading}
                </h2>
                {dek && <p>{dek}</p>}
              </div>
              {cta && url && (
                <Button
                  as="a"
                  className="c-carousel__item-cta"
                  label={cta}
                  url={url}
                  lighter
                  small
                  isExternal={url.startsWith('http')}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
