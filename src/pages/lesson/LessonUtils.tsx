import moment from 'moment-timezone';

export const OLD_SS_URL = 'https://sdabg.net/page.php?id=ss';
export const SS_URL = 'https://sabbath-school-stage.adventech.io';
export const SS_URL_BG = `${SS_URL}/bg`;
export const SS_API_URL_BG_QUARTER = `${SS_URL}/api/v2/bg/quarterlies`;

export function twoDigits(n: number) {
  return (n > 9 ? '' : '0') + n;
}

export type lessonParameters = {
  lessonYear: number;
  lessonQuarter: number;
  lessonNumber: number;
  isCQ?: boolean;
};

export type LessonObject = lessonParameters & {
  qTitle: string;
  quarterlyCover?: string;
  cover?: string;
  hasError: boolean;
  qDescription?: string;
  qIntroduction?: string;
  qHumanDate?: string;
  qAuthor?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
};

export const isValidYear = (yearString: string) => {
  const year = parseInt(yearString);
  return year >= 6; //oldest lessons are from 2006
};

export const isValidQuarter = (quarterString: string) => {
  const quarter = parseInt(quarterString);
  return quarter >= 1 && quarter <= 4; // 1, 2, 3, 4 is valid
};

export const isValidLessonNumber = (weekString: string) => {
  const num = parseInt(weekString);
  return num >= 1 && num <= 13;
};

export const getCurrentLesson = () => {
  const m = moment();
  const day = m.date();
  const month = m.month();
  const year = m.year();
  const weekDay = m.day();
  const time = m.hour();

  const add = weekDay === 6 && time >= 14 ? 7 : 0;
  const nextSabbath = moment({ year, month, day: day }).add(
    +6 - weekDay + add,
    'days'
  );

  const returnYear = nextSabbath.year();
  const returnQuarter = nextSabbath.quarter();
  const first = moment({
    year: returnYear,
    month: (returnQuarter - 1) * 3,
    day: 1
  }); // first day in the qarter
  const returnLessonNumber = nextSabbath.diff(first, 'weeks') + 1;

  return {
    year: returnYear,
    quarter: returnQuarter,
    lessonNumber: returnLessonNumber
  };
};

type resQuarter = {
  quarterly: {
    cover: string;
    title: string;
    description: string;
    human_date: string;
    credits?: Array<{ name: string; value: string }>;
    introduction: string;
  };
  lessons: Array<{
    id: string;
    cover: string;
    title: string;
    start_date: string;
    end_date: string;
  }>;
};
export const loadLesson = ({
  lessonYear,
  lessonQuarter,
  lessonNumber,
  isCQ = false
}: lessonParameters): Promise<LessonObject> => {
  const lessonDetails: LessonObject = {
    lessonNumber,
    lessonQuarter,
    lessonYear,
    isCQ,
    qTitle: '',
    hasError: true
  };

  return fetch(
    `${SS_API_URL_BG_QUARTER}/${lessonYear}-${twoDigits(lessonQuarter)}${
      isCQ ? '-cq' : ''
    }/index.json`
  )
    .then((res) => res.json())
    .then(
      ({ quarterly, lessons }: resQuarter) => {
        console.log(quarterly);
        // setIsLoaded(true);
        // setItems(result);
        lessonDetails.hasError = false;
        lessonDetails.quarterlyCover = quarterly.cover;
        lessonDetails.qTitle = quarterly.title;
        lessonDetails.qDescription = quarterly.description;
        lessonDetails.qHumanDate = quarterly.human_date;
        lessonDetails.qAuthor = quarterly.credits
          ? `${quarterly.credits[0].name}: ${quarterly.credits[0].value}`
          : '';
        lessonDetails.qIntroduction = quarterly.introduction;

        const currentLesson = lessons.find(
          (l) => l.id === twoDigits(lessonNumber)
        );
        lessonDetails.cover = currentLesson?.cover;
        lessonDetails.title = currentLesson?.title;
        lessonDetails.startDate = currentLesson?.start_date;
        lessonDetails.endDate = currentLesson?.end_date;

        return Promise.resolve(lessonDetails);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (_error) => {
        // setIsLoaded(true);
        // setError(error);

        lessonDetails.qTitle = `Проблем при зареждане на урока за ${
          isCQ ? 'младежи' : 'възрастни'
        } - № ${lessonNumber} за ${lessonQuarter} тримесечие на ${lessonYear} година.`;
        return Promise.resolve(lessonDetails);
      }
    );
};
