import { PortableTextBlock } from '@portabletext/types';
import { createContext, useContext } from 'react';

export type QuestionType = {
  name: string;
  text: string;
  answer: Array<PortableTextBlock>;
};

export type QuestionsContextType = {
  questions?: QuestionType[];
  setQuestions: (questions: QuestionType[]) => void;
  lastLoaded?: string;
  setLastLoaded: (date: string) => void;
};

export const QuestionsContext = createContext<QuestionsContextType>({
  questions: undefined,
  setQuestions: () => {},
  lastLoaded: undefined,
  setLastLoaded: () => {}
});

export function useQuestionsContext() {
  const context = useContext(QuestionsContext);

  return context;
}
