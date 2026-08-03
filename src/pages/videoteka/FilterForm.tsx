import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { Form } from 'alps-library/molecules/forms/elements/Form.tsx';
import { FormLabel } from 'alps-library/molecules/forms/elements/FormLabel';
import { TextField as AlpsTextField } from 'alps-library/molecules/forms/elements/TextField';
import { Button } from 'src/alps/atoms/Button';
import { TopicType } from 'src/contexts/PlaylistsContext';

export interface FilterFormProps {
  type: 'videos' | 'playlists';
  allTopics: TopicType[];
  allAuthors: string[];
  selectedTopic: TopicType | null;
  selectedAuthor: string | null;
  searchText: string;
  onTopicChange: (v: TopicType | null) => void;
  onAuthorChange: (v: string | null) => void;
  onSearchTextChange: (v: string) => void;
  onSearch: () => void;
}

export const FilterForm = ({
  type,
  allTopics,
  allAuthors,
  selectedTopic,
  selectedAuthor,
  searchText,
  onTopicChange,
  onAuthorChange,
  onSearchTextChange,
  onSearch
}: FilterFormProps) => {
  const hasFilters =
    !!selectedTopic || !!selectedAuthor || searchText.trim() !== '';

  const topicId = `${type}-topic`;
  const authorId = `${type}-author`;

  return (
    <Form className="videoteka-search-wrapper" onSubmit={onSearch}>
      <div className="videoteka-filters-row">
        <FormLabel text="Тема" className="videoteka-field" htmlFor={topicId}>
          <Autocomplete<TopicType>
            id={topicId}
            options={allTopics}
            value={selectedTopic}
            onChange={(_e, v) => onTopicChange(v)}
            getOptionLabel={(o) => o.title}
            isOptionEqualToValue={(o, v) => o._id === v._id}
            clearText="Изчисти"
            openText="Отвори"
            renderInput={(params) => (
              <TextField {...params} placeholder="Избери тема" />
            )}
          />
        </FormLabel>
      </div>
      <div className="videoteka-filters-row">
        <FormLabel text="Автор" className="videoteka-field" htmlFor={authorId}>
          <Autocomplete<string>
            id={authorId}
            options={allAuthors}
            value={selectedAuthor}
            onChange={(_e, v) => onAuthorChange(v)}
            clearText="Изчисти"
            openText="Отвори"
            renderInput={(params) => (
              <TextField {...params} placeholder="Търси автор" />
            )}
          />
        </FormLabel>
      </div>
      <div className="videoteka-filters-row">
        <div className="videoteka-field">
          <AlpsTextField
            label="Заглавие или описание"
            name={`${type}-searchText`}
            type="text"
            value={searchText}
            placeholder="Въведи ключова дума"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchTextChange(e.target.value)
            }
          />
        </div>
      </div>
      <Button label="Търси" disabled={!hasFilters} />
    </Form>
  );
};
