import { LessonProps, OLD_SS_URL } from 'src/utils/LessonUtils';
import { Text } from 'alps-library/atoms/text/Text';

export const MissingLesson = (params: LessonProps) => {
  return (
    <Text>
      <h3>
        Търсеният урок № {params.lessonNumber} от {params.lessonQuarter}{' '}
        тримесечие на {params.lessonYear} година не е намерен
      </h3>
      {params.type == '' && (
        <p>
          Опитайте да го заредите
          <a
            href={`${OLD_SS_URL}&year=${params.lessonYear - 2000}&quarter=${
              params.lessonQuarter
            }&week=${params.lessonNumber}`}
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            през стария сайт
          </a>
          .
        </p>
      )}
    </Text>
  );
};
