import { Chip } from '@mui/material';
import { TopicType } from 'src/contexts/PlaylistsContext.ts';
import './TopicsBlock.scss';

export type TopicsBlockType = {
  topics?: TopicType[] | null;
  appliedIds: Set<string>;
};

export const TopicsBlock = ({ topics, appliedIds }: TopicsBlockType) => {
  return (
    topics &&
    topics.length > 0 && (
      <div className="block-topics">
        {topics.map((topic) => (
          <Chip
            key={topic._id}
            label={topic.title}
            size="small"
            className={appliedIds.has(topic._id) ? '' : 'chip-no-bg'}
          />
        ))}
      </div>
    )
  );
};
