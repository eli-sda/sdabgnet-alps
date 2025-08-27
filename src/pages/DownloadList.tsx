import { useState } from 'react';
import { Table } from 'alps-library/atoms/tables/table/Table.tsx';
import { Button } from 'src/alps/atoms/Button';
import { RESOURCES_PREFIX_URL } from 'src/constants';
import { PlaylistType } from 'src/contexts/PlaylistsContext';

type DownloadListProps = {
  playlist: PlaylistType;
};

const DownloadList = ({ playlist }: DownloadListProps) => {
  const [open, setOpen] = useState(false);

  if (!playlist.items || playlist.items.length === 0) {
    return null;
  }

  const headers = ['Заглавие', 'Описание', 'Размер', 'Изтегляне'];

  const rows = open
    ? playlist.items.map((item) => ({
        key: item._id,
        cells: [
          <>
            <i className="fa fa-file-video-o u-space--quarter--right" />
            {item.title}
          </>,
          item.description || '-',
          item.size ? `${item.size} MB` : '-',
          <Button
            as="a"
            small
            key={item._id}
            faIcon="download"
            label="Изтегли"
            url={`${RESOURCES_PREFIX_URL}${item.path}`}
          />
        ]
      }))
    : [];

  const displayTitle =
    playlist.title === playlist.author
      ? playlist.author
      : `"${playlist.title}"${playlist.author ? ` - ${playlist.author}` : ''}`;

  return (
    <div className="u-space--double--bottom">
      <span
        className="download-list-title"
        onClick={() => setOpen((prev) => !prev)}
      >
        <i
          className={`fa fa-folder${
            open ? '-open' : ''
          } u-space--quarter--right`}
        />
        {displayTitle}
      </span>

      {open && (
        <Table columns={headers} rows={rows.map((row) => row.cells)} slim />
      )}
    </div>
  );
};

export default DownloadList;
