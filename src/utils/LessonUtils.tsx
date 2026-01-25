import { OLD_SITE } from 'src/constants';

export const OLD_SS_URL = `${OLD_SITE}/page.php?id=ss`;
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
  title: string;
  startDate?: string;
  endDate?: string;
  full_path: string;
  pdfOnly?: boolean;
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

type resQuarterly = {
  id: string; // ex. "2025-04"
  cover: string;
  title: string;
  description: string;
  human_date: string;
  credits?: Array<{ name: string; value: string }>;
  introduction: string;
  quarterly_group: { name: string };
};
type resQuarter = {
  quarterly: resQuarterly;
  lessons: Array<{
    id: string;
    cover: string;
    title: string;
    start_date: string;
    end_date: string;
    full_path: string;
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
            ?.replace(/^### (.+)$/m, '<h3>$1</h3>') //format the title
            .replace(/^#### .*?\n\n/m, '') // Remove text starting with #### and ending with \n\n
            .replace(/\*\*(.*?)\*\*\n\n/g, '') // Remove text wrapped with ** and ending with \n\n
            .replaceAll('\n\n', '<p>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            .replace(
              /\b(www\.[^\s.]+(?:\.[^\s.]+)+)/g,
              '<a href="//$1" target="_blank">$1</a>'
            ) || '';

        lessons.forEach((lesson) => {
          details.lessons.push({
            num: parseInt(lesson.id),
            title: lesson.title,
            cover: lesson.pdfOnly ? undefined : lesson.cover, //as  the image of cc lesson is for adults
            startDate: lesson.start_date,
            endDate: lesson.end_date,
            full_path: lesson.full_path,
            pdfOnly: lesson.pdfOnly
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

type resLesson = {
  days: Array<{
    title: string;
    date: string;
    id: string;
    full_read_path: string;
  }>;
  pdfs: Array<{
    title: string;
    src: string;
  }>;
};

export type LessonDayType = {
  title: string;
  date: string;
  bible?: Array<{
    name: string;
    verses: { [key: string]: string };
  }>;
  content: string;
  index: string;
};

/**
 * Fetches the full lesson details from the given lessonFullPath
 * @param lessonFullPath - full_path form LessonDetails object, e.g. "https://sabbath-school-stage.adventech.io/api/v2/bg/quarterlies/2025-02-cc/lessons/09"
 * @returns
 */
export const getLessonDaysAndPdf = async (
  lessonFullPath: string
): Promise<{
  days: LessonDayType[];
  pdfLink: string | undefined;
}> => {
  // const lessonDays: LessonDays[] = [];
  const res = await fetch(`${lessonFullPath}/index.json`);
  const { days, pdfs } = (await res.json()) as resLesson;

  // Fetch details for each day in parallel
  const dayDetails = await Promise.all(
    days.map(async (day) => {
      const detailRes = await fetch(`${day.full_read_path}/index.json`);
      const detail = (await detailRes.json()) as LessonDayType;
      return {
        index: detail.index,
        title: detail.title,
        date: detail.date,
        bible: detail.bible || [],
        content: getHTMLLessonText(detail.content || '')
      };
    })
  );
  let pdfLink: string | undefined = undefined;
  if (days.length === 0 && pdfs.length > 0) {
    pdfLink = pdfs[0].src;
  }
  return { days: dayDetails, pdfLink };
};

export const getHTMLLessonText = (rawString: string): string => {
  // 1. Replace unicode escapes with actual characters
  const decoded = rawString.replace(
    /\\u([\dA-F]{4})/gi,
    (_: string, grp: string) => String.fromCharCode(parseInt(grp, 16))
  );

  // 2. Optionally, remove extra backslashes (if present)
  const htmlString = decoded.replace(/\\(.)/g, '$1');

  // 3. Render in React (dangerouslySetInnerHTML)
  // function LessonHtml() {
  //   return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  // }
  return htmlString;
};
export const getAllLessonQuarters = (): Promise<QuarterObject[]> => {
  const detailsTpl: QuarterObject = {
    lessonQuarter: 0,
    lessonYear: 0,
    qTitle: '',
    qDescription: '',
    qIntroduction: '',
    hasError: false,
    lessons: []
  };
  const allQuarterlies: QuarterObject[] = [];

  return fetch(`${SS_API_URL_BG_QUARTER}/index.json`)
    .then((res) => res.json())
    .then((quarterlies: resQuarterly[]) => {
      quarterlies.forEach((quarterly) => {
        const idParts = quarterly.id.split('-');
        const idLength = idParts.length;
        if (idLength >= 2) {
          const details = { ...detailsTpl };
          details.lessonYear = parseInt(idParts[0]);
          details.lessonQuarter = parseInt(idParts[1]);
          details.type = idLength > 2 ? (idParts[2] as LessonType) : '';
          details.quarterlyCover = quarterly.cover;
          details.qTitle = quarterly.title;
          details.qHumanDate = quarterly.human_date;

          allQuarterlies.push(details);
        }
      });
      return Promise.resolve(allQuarterlies);
    });
};
