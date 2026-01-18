import { useMemo } from 'react';
import { Grid } from 'alps-library/atoms/grids/Grid';
import { GridItem } from 'alps-library/atoms/grids/GridItem';
import { ListContent } from 'alps-library/organisms/content/listContent/ListContent';
import { MediaBlock } from 'src/alps/molecules/blocks/MediaBlock';
import { getImageTypeByUrl } from 'src/utils/ImageHelper';

type LessonHeadProps = {
  lessonTitle: string;
  kicker?: string;
  lessonCover?: string;
  lessonURL?: string;
  lessonDateRange: string;
};

const LessonHead = ({
  lessonTitle,
  kicker,
  lessonCover,
  lessonURL,
  lessonDateRange
}: LessonHeadProps) => {
  const image = useMemo(() => {
    return lessonCover ? getImageTypeByUrl(lessonCover) : undefined;
  }, [lessonCover]);

  return (
    <Grid
      className={
        'u-spacing--double--until-large l-grid l-grid--7-col l-grid-wrap l-grid-wrap--6-of-7'
      }
      seven={true}
      as="section"
      wrap={'6'}
    >
      <GridItem
        className={'u-padding--zero--sides u-shift--left--1-col--at-large'}
        sizeAtL={'5'}
      >
        <ListContent className={'to-lesson text'}>
          <MediaBlock
            type="featuredNews"
            kicker={kicker}
            kickerAs="h4"
            title={lessonTitle}
            titleAs="h2"
            url={lessonURL}
            category={lessonDateRange}
            image={image}
          />
        </ListContent>
      </GridItem>
    </Grid>
  );
};

export default LessonHead;
