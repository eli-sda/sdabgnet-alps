import { useCallback } from 'react';
import { useQuestionsContext } from 'src/contexts/QuestionsContext';
import { loadQuestions } from 'src/utils/FetchHelper';

function getTodayString() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function useQuestions() {
  const { questions, setQuestions, lastLoaded, setLastLoaded } =
    useQuestionsContext();

  /**
   * Returns the questions. If the questions are not loaded or are stale (older than today),
   * it will fetch them from the backend and update the provider. Otherwise, it returns the cached questions.
   * @returns Promise resolving to an array of questions
   */
  const getQuestions = useCallback(async () => {
    const today = getTodayString();
    if (questions && lastLoaded === today) {
      return Promise.resolve(questions);
    }
    return loadQuestions()
      .then((loadedQuestions) => {
        setQuestions(loadedQuestions);
        setLastLoaded(today);
        return Promise.resolve(loadedQuestions);
      })
      .catch();
  }, [questions, lastLoaded, setQuestions, setLastLoaded]);

  return { questions, getQuestions };
}
