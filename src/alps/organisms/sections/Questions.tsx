import { HeadingBlock } from 'alps-library/molecules/blocks/headingBlock/HeadingBlock';
import {
  Question,
  QuestionProps
} from 'src/alps/molecules/components/Question';

// Note: This component allows more that one level replies. ALPS doesn"t contemplate that.
export interface QuestionsListProps {
  level?: number;
  items?: QuestionItem[];
  /**
   * Specify the title of your QuestionsList
   */
  title?: string;
}

export interface QuestionItem extends QuestionProps {
  replies?: QuestionItem[];
}

export interface QuestionsProps {
  items?: QuestionItem[];
  title: string;
}

const QuestionsList = ({
  items = [],
  level = 0
}: QuestionsListProps): JSX.Element => {
  const childrenClass = level > 0 ? 'children__' : '';
  const listClass = `c-comment__${childrenClass}list`;
  const itemClass = `${listClass}-item`;

  return (
    <ul className={listClass + ' u-spacing'}>
      {items.map(({ byline, replies, text, avatar, name }, key) => (
        <li
          className={`${itemClass} comment  u-spacing`}
          key={`comment-${key}`}
        >
          <Question
            byline={byline}
            text={text}
            avatar={avatar}
            name={name}
          />
          {replies && replies.length > 0 && level < 1 && (
            <QuestionsList items={replies} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
};

export const Questions = ({
  items = [],
  title
}: QuestionsProps): JSX.Element => {
  return (
    <section className="c-comments u-spacing--double">
      <HeadingBlock title={title} />
      <QuestionsList items={items} level={0} />
    </section>
  );
};
