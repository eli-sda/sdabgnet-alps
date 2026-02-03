import React from 'react';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Button } from 'src/alps/atoms/Button';
import routes from 'src/routes';
import './BookRow.scss';

const BookRow = ({ title, path, audioId, newLifeId }: Book) => {
  const downloadUrl = `https://api.sdabg.net/download/${encodeURIComponent(path)}`;
  const audioUrl = `${routes.resources('audio', 'audiobook')}#${audioId}`;
  const publisherUrl = `https://newlife-bg.com/product/${newLifeId}/`;

  const buttonProps = {
    outline: true,
    simple: true,
    small: true,
  };

  return (
    <div className='book-row u-spacing--half'>
      <div className="title hyphens-auto">
        <AutoStoriesIcon className="u-space--half--right" />
        <h3>{title}</h3>
      </div>

      <div className="action-buttons">
        <Button
          label="изтегли"
          as="a"
          url={downloadUrl}
          faIconClass="fas fa-download"
          {...buttonProps}
        />

        {audioId && (
          <Button
            label="слушай"
            as="a"
            url={audioUrl}
            faIconClass="fas fa-volume-up"
            {...buttonProps}
          />
        )}

        {newLifeId && (
          <Button
            label="виж в издателството"
            as="a"
            url={publisherUrl}
            isExternal
            hideExternalIcon
            faIconClass="fas fa-external-link-alt"
            {...buttonProps}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(BookRow);
