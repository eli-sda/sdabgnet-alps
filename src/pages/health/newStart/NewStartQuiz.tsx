import { useState, useMemo, useCallback } from 'react';
import { Button } from 'src/alps/atoms/Button';
import './NewStartQuiz.scss';

interface Answer {
  content: string;
}

interface Question {
  question: string;
  questionType: 'text' | 'multiple'; // 'text' acts as single choice
  answers: Answer[];
  correctAnswer: string | string[];
}

export interface QuizData {
  quizTitle: string;
  quizSynopsis: string;
  questions: Question[];
}

interface NewStartQuizProps {
  quizData: QuizData;
  className?: string;
}

const NewStartQuiz = ({ quizData, className }: NewStartQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<number, string | string[]>
  >({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizData.questions[currentStep];
  const isMultiple = currentQuestion?.questionType === 'multiple';

  const handleSingleSelect = useCallback(
    (questionIndex: number, answerId: string) => {
      setUserAnswers((prev) => ({
        ...prev,
        [questionIndex]: answerId
      }));
    },
    []
  );

  const handleMultiSelect = useCallback(
    (questionIndex: number, answerId: string, isChecked: boolean) => {
      setUserAnswers((prev) => {
        const currentSelected = (prev[questionIndex] as string[]) || [];
        if (isChecked) {
          return { ...prev, [questionIndex]: [...currentSelected, answerId] };
        } else {
          return {
            ...prev,
            [questionIndex]: currentSelected.filter((id) => id !== answerId)
          };
        }
      });
    },
    []
  );

  const handleNext = () => {
    if (currentStep < quizData.questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setUserAnswers({});
    setShowResults(false);
  };

  // Calculate the final score
  const score = useMemo(() => {
    if (!showResults) return 0;

    return quizData.questions.reduce((total, q, index) => {
      const userAnswer = userAnswers[index];

      if (q.questionType === 'multiple') {
        const correctArr = q.correctAnswer as string[];
        const userArr = (userAnswer as string[]) || [];

        // Check if arrays have the exact same elements
        const isCorrect =
          correctArr.length === userArr.length &&
          correctArr.every((val) => userArr.includes(val));

        return isCorrect ? total + 1 : total;
      } else {
        return userAnswer === q.correctAnswer ? total + 1 : total;
      }
    }, 0);
  }, [showResults, quizData.questions, userAnswers]);

  // Prevent moving forward if no answer is selected
  const isNextDisabled = useMemo(() => {
    const currentAnswer = userAnswers[currentStep];
    if (isMultiple) {
      return !currentAnswer || (currentAnswer as string[]).length === 0;
    }
    return !currentAnswer;
  }, [userAnswers, currentStep, isMultiple]);

  if (showResults) {
    return (
      <section className={`new-start-quiz u-spacing ${className || ''}`}>
        <div className="u-spacing--half">
          <h3 className="u-font--primary--m u-theme--color--darker">
            <strong>Резултат</strong>
          </h3>

          <p className="u-color--black">
            Вие отговорихте правилно на <strong>{score}</strong> от общо{' '}
            <strong>{quizData.questions.length}</strong> въпроса.
          </p>

          <div>
            <h2 className="u-font--primary--m u-theme--color--darker">
              <strong>Преглед на отговорите:</strong>
            </h2>
            {quizData.questions.map((q, qIndex) => {
              const userAnswer = userAnswers[qIndex];
              const isQMultiple = q.questionType === 'multiple';

              return (
                <div
                  key={qIndex}
                  className="u-space--bottom u-space--top u-spacing--half u-theme--color--darker"
                >
                  <p>
                    <strong>
                      {qIndex + 1}. {q.question}
                    </strong>
                  </p>
                  <ul className="u-spacing--half">
                    {q.answers.map((ans, aIndex) => {
                      const ansId = (aIndex + 1).toString();
                      const isSelected = isQMultiple
                        ? ((userAnswer as string[]) || []).includes(ansId)
                        : userAnswer === ansId;
                      const isCorrect = isQMultiple
                        ? (q.correctAnswer as string[]).includes(ansId)
                        : q.correctAnswer === ansId;

                      const validColorClass = 'u-color--valid';
                      const errorColorClass = 'u-color--error';
                      const iconCorrect = 'fas fa-check-circle';
                      const iconIncorrect = 'fas fa-times-circle';
                      let iconClass = 'far fa-circle';
                      let textColorClass = 'u-color--gray';

                      if (isSelected && isCorrect) {
                        iconClass = `${iconCorrect} ${validColorClass}`;
                        textColorClass = validColorClass;
                      } else if (isSelected && !isCorrect) {
                        iconClass = `${iconIncorrect} ${errorColorClass}`;
                        textColorClass = errorColorClass;
                      } else if (!isSelected && isCorrect) {
                        iconClass = `${iconCorrect} ${validColorClass}`;
                        textColorClass = validColorClass;
                      }

                      return (
                        <li key={aIndex} className={textColorClass}>
                          <i
                            className={`${iconClass} u-space--half--right`}
                            aria-hidden="true"
                          ></i>
                          <span>{ans.content}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          <Button
            onClick={handleReset}
            label="Опитай отново"
            faIconClass="fas fa-redo"
          />
        </div>
      </section>
    );
  }

  return (
    <section className={`new-start-quiz u-spacing ${className || ''}`}>
      <p className="u-color--black">
        Въпрос {currentStep + 1} от {quizData.questions.length}
      </p>

      <div className="u-spacing u-color--black">
        <h3 className="u-font--primary--m u-theme--color--darker">
          <strong>{currentQuestion.question}</strong>
        </h3>

        <div className="quiz-answers">
          {currentQuestion.answers.map((answer, index) => {
            const answerId = (index + 1).toString();
            const isSelected = isMultiple
              ? ((userAnswers[currentStep] as string[]) || []).includes(
                  answerId
                )
              : userAnswers[currentStep] === answerId;

            return (
              <label key={index} className="quiz-answer-label">
                {isMultiple ? (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) =>
                      handleMultiSelect(currentStep, answerId, e.target.checked)
                    }
                  />
                ) : (
                  <input
                    type="radio"
                    name={`question-${currentStep}`}
                    checked={isSelected}
                    onChange={() => handleSingleSelect(currentStep, answerId)}
                  />
                )}
                <span>{answer.content}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="quiz-navigation">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          label="Предишен"
          simple
        />

        <Button
          onClick={handleNext}
          disabled={isNextDisabled}
          label={
            currentStep === quizData.questions.length - 1
              ? 'Приключи'
              : 'Следващ'
          }
        />
      </div>
    </section>
  );
};

export default NewStartQuiz;
