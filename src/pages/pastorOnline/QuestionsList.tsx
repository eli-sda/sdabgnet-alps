import { useEffect, useState } from 'react';
import { Question, QuestionProps } from 'src/pages/pastorOnline/Question';
import { Button } from 'src/alps/atoms/Button';

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

  // Array of toggles for each question
  const [toggles, setToggles] = useState<boolean[]>(items.map(() => false));
  // Reset toggles when items change
  useEffect(() => {
    setToggles(items.map(() => false));
  }, [items]);

  const handleToggle = (idx: number) => {
    setToggles((toggles) => toggles.map((t, i) => (i === idx ? !t : t)));
  };

  return (
    <ul
      className={`${listClass} ${
        level > 0 ? 'u-spacing' : 'u-spacing--double'
      }`}
    >
      {items.map(({ answer, text, avatar, name }, idx) => (
        <li
          className={`${itemClass} comment hyphens-auto u-spacing`}
          key={`${level}-${idx}`}
          id={`question-${level}-${idx}`}
        >
          <Question text={text} avatar={avatar} name={name} />
          {answer && (
            <>
              <Button
                as="a"
                expand
                outline
                toggle
                onClick={() => handleToggle(idx)}
                className="answer"
              />
              {toggles[idx] && (
                <QuestionsList items={[answer]} level={level + 1} />
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
};
