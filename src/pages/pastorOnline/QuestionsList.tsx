import { Question, QuestionProps } from 'src/pages/pastorOnline/Question';

// Note: This component allows more that one level replies. ALPS doesn"t contemplate that.

export interface QuestionItem extends QuestionProps {
  answer?: QuestionItem;
}

export interface QuestionsListProps {
  level?: number;
  items?: QuestionItem[];
}

export const QuestionsList = ({
  items = [],
  level = 0
}: QuestionsListProps): JSX.Element => {
  const childrenClass = level > 0 ? 'children__' : '';
  const listClass = `c-comment__${childrenClass}list`;
  const itemClass = `${listClass}-item`;

  return (
    <ul className={listClass + ' u-spacing'}>
      {items.map(({ answer, text, avatar, name }, key) => (
        <li
          className={`${itemClass} comment  u-spacing`}
          key={`comment-${key}`}
        >
          <Question text={text} avatar={avatar} name={name} />
          {answer && level === 0 && (
            <QuestionsList items={[answer]} level={1} />
          )}
        </li>
      ))}
    </ul>
  );
};
