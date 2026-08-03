import type { TopicType } from 'src/contexts/PlaylistsContext';

export type SearchSource = 'init' | 'user';

export type VideotekaApplied = {
	topic: TopicType | null;
	author: string;
	text: string;
};