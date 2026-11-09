import { ReactNode } from 'react';

/**
 * Replaces the result list while its full documents are loading, keeping the
 * pagination visible so the page does not jump.
 */
export const PageResultsSpinner = ({
  pagination
}: {
  pagination: ReactNode;
}) => (
  <>
    {pagination}
    <div className="centered-text">
      <i className="fas fa-spinner fa-pulse fa-5x u-space--triple"></i>
    </div>
  </>
);
