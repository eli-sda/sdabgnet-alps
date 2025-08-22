import { Table } from 'alps-library/atoms/tables/table/Table.tsx';
import { Button } from 'src/alps/atoms/Button';
import { RESOURCES_PREFIX_URL } from 'src/constants';
import { PlaylistType } from 'src/contexts/PlaylistsContext';

type DownloadListProps = {
  playlist: PlaylistType;
};

const DownloadList = ({ playlist }: DownloadListProps) => {
  const headers = ['Заглавие', 'Описание', 'Размер', 'Изтегляне'];

  const rows =
    playlist.items?.map((item) => [
      item.title,
      item.description || '-',
      item.size ? `${item.size} MB` : '-',
      <Button
        as="a"
        small={true}
        key={item._id}
        faIcon="download"
        label="Изтегли"
        url={`${RESOURCES_PREFIX_URL}${item.path}`}
      />
    ]) || [];

  return (
    <Table
      title={`"${playlist.title}" - ${playlist.author}`}
      columns={headers}
      rows={rows}
      slim={true}
    />
  );
};

export default DownloadList;
