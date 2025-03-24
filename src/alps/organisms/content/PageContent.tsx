import React from 'react';
import { Text } from 'alps-library/atoms/text/Text';
import {
  BreadcrumbItemProps,
  Breadcrumbs
} from 'src/alps/molecules/navigation/Breadcrumbs';

export interface PageContentProps {
  breadcrumbs?: BreadcrumbItemProps[];
  children?: React.ReactNode;
  content?: React.ReactNode;
}

export const PageContent = ({
  children,
  content,
  breadcrumbs = []
}: PageContentProps): JSX.Element => (
  <div className={'u-spacing'}>
    {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
    {children || content}
  </div>
);
