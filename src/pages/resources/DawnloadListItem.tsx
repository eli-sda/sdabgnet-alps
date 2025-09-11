import { useMemo } from 'react';
import { RESOURCES_PREFIX_URL } from 'src/constants';
import { PlaylistItemType } from 'src/contexts/PlaylistsContext';
import { Button } from 'src/alps/atoms/Button';

const DawnloadListItem = ({
  title,
  description,
  _id,
  path,
  size
}: PlaylistItemType) => {
  const icon = useMemo(() => {
    if (path.endsWith('.pdf')) return 'file-pdf-o';
    if (path.endsWith('.doc') || path.endsWith('.docx')) return 'file-word-o';
    if (path.endsWith('.xls') || path.endsWith('.xlsx')) return 'file-excel-o';
    if (path.endsWith('.ppt') || path.endsWith('.pptx'))
      return 'file-powerpoint-o';
    if (path.endsWith('.zip') || path.endsWith('.rar')) return 'file-archive-o';
    if (path.endsWith('.mp3') || path.endsWith('.wav')) return 'file-audio-o';
    if (path.endsWith('.mp4') || path.endsWith('.mov') || path.endsWith('.avi'))
      return 'file-video-o';
    return 'file-o';
  }, [path]);

  return (
    <div className="download-item">
      <h3>
        <i
          className={`fa fa-${icon} u-space--half--right`}
          aria-hidden="true"
        ></i>
      </h3>
      <div>
        <h3 className="u-space--quarter--bottom">{title}</h3>
        <p>{description}</p>
        <Button
          key={_id}
          as="a"
          small
          className="u-space--half--top"
          faIcon="download"
          label={`Изтегли ${size ? `(${size} MB)` : ''}`}
          url={`${RESOURCES_PREFIX_URL}${path}`}
          isExternal
          download
        />
      </div>
    </div>
  );
};

export default DawnloadListItem;
