export const OLD_SS_URL = 'https://sdabg.net/page.php?id=ss';
export const SS_URL = 'https://sabbath-school-stage.adventech.io';
export const SS_URL_BG = `${SS_URL}/bg`;
export const SS_API_URL_BG_QUARTER = `${SS_URL}/api/v2/bg/quarterlies`;

export function twoDigits(n: number) {
  return (n > 9 ? '' : '0') + n;
}

export type LessonType = '' | 'cq' | 'cc'; //'' - за възрастни, cq - младежки, cc - юношески

export function getRouteLesson(
  lessonType: LessonType
): 'lesson' | 'lesson-cq' | 'lesson-cc' {
  switch (lessonType) {
    case 'cq':
      return 'lesson-cq';
    case 'cc':
      return 'lesson-cc';
    default:
      return 'lesson';
  }
}
export type QuarterProps = {
  lessonYear: number;
  lessonQuarter: number;
  type?: LessonType;
};
export type LessonProps = QuarterProps & {
  lessonNumber: number;
};

export type LessonDetails = {
  num: number;
  cover?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
};

export type QuarterObject = QuarterProps & {
  qTitle: string;
  quarterlyCover?: string;
  hasError: boolean;
  qDescription: string;
  qIntroduction: string;
  qHumanDate?: string;
  qAuthor?: string;
  qGroup?: string;
  lessons: Array<LessonDetails>;
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

type resQuarter = {
  quarterly: {
    cover: string;
    title: string;
    description: string;
    human_date: string;
    credits?: Array<{ name: string; value: string }>;
    introduction: string;
    quarterly_group: { name: string };
  };
  lessons: Array<{
    id: string;
    cover: string;
    title: string;
    start_date: string;
    end_date: string;
    pdfOnly: boolean;
  }>;
};

export const formatDateRange = (startDate: string, endDate: string) => {
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const options: Intl.DateTimeFormatOptions = { day: 'numeric' };
  const startDay = start.toLocaleDateString('bg-BG', options);
  const endDay = end.toLocaleDateString('bg-BG', options);
  const endMonth = end.toLocaleDateString('bg-BG', { month: 'long' });
  const year = end.getFullYear();

  if (start.getMonth() === end.getMonth()) {
    return `${startDay} - ${endDay} ${endMonth} ${year} г.`;
  } else {
    const startMonth = start.toLocaleDateString('bg-BG', { month: 'long' });
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year} г.`;
  }
};

export const loadQuarter = ({
  lessonYear,
  lessonQuarter,
  type = ''
}: QuarterProps): Promise<QuarterObject> => {
  const details: QuarterObject = {
    lessonQuarter,
    lessonYear,
    type,
    qTitle: '',
    qDescription: '',
    qIntroduction: '',
    hasError: true,
    lessons: []
  };

  return fetch(
    `${SS_API_URL_BG_QUARTER}/${lessonYear}-${twoDigits(lessonQuarter)}${
      type ? `-${type}` : ''
    }/index.json`
  )
    .then((res) => res.json())
    .then(
      ({ quarterly, lessons }: resQuarter) => {
        console.log(quarterly);
        // setIsLoaded(true);
        // setItems(result);
        details.hasError = false;
        details.quarterlyCover = quarterly.cover;
        details.qTitle = quarterly.title;
        details.qDescription = quarterly.description;
        details.qHumanDate = quarterly.human_date;
        details.qAuthor = quarterly.credits
          ? `${quarterly.credits[0].name}: ${quarterly.credits[0].value}`
          : '';
        details.qGroup = quarterly.quarterly_group?.name || '';
        details.qIntroduction =
          quarterly.introduction
            ?.replace(/^### (.+)$/m, '<b>$1</b>') //format the title
            .replace(/^#### .*?\n\n/m, '') // Remove text starting with #### and ending with \n\n
            .replace(/\*\*(.*?)\*\*\n\n/g, '') // Remove text wrapped with ** and ending with \n\n
            .replaceAll('\n\n', '<p>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            .replace(
              /\b(www\.[^\s]+)/g,
              '<a href="//$1" target="_blank">$1</a>'
            ) || '';

        lessons.forEach((lesson) => {
          details.lessons.push({
            num: parseInt(lesson.id),
            title: lesson?.title,
            cover: lesson?.pdfOnly ? '' : lesson?.cover,
            startDate: lesson?.start_date,
            endDate: lesson?.end_date
          });
        });

        return Promise.resolve(details);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (_error) => {
        // setIsLoaded(true);
        // setError(error);

        details.qTitle = `Проблем при зареждане на уроците за ${
          type === 'cq' ? 'младежи' : type === 'cc' ? 'юноши' : 'възрастни'
        } за ${lessonQuarter} тримесечие на ${lessonYear} година.`;
        return Promise.resolve(details);
      }
    );
};

export const getLessonFromQuarter = (
  quarterObject: QuarterObject,
  lessonNumber: number
): LessonDetails | undefined => {
  const lesson = quarterObject?.lessons.find(
    (lesson) => lesson.num === lessonNumber
  );
  return lesson;
};
