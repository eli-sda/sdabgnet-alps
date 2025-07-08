import { ReactNode, useState } from 'react';
import { QuestionsContext, QuestionType } from 'src/contexts/QuestionsContext';

export const QuestionsProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<QuestionType[]>();
  const [lastLoaded, setLastLoaded] = useState<string>();

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        setQuestions,
        lastLoaded,
        setLastLoaded
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};
