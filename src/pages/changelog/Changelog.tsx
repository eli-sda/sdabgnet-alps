import { useEffect } from 'react';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { useChangelog } from 'src/hooks/useChangelog';
import { newLinesWithLinks } from 'src/utils/Links';
import './Changelog.scss';

const typeLabels: Record<string, { label: string; icon: string; cls: string }> =
  {
    feature: {
      label: 'Ново',
      icon: 'fas fa-star',
      cls: 'changelog-badge--feature'
    },
    improvement: {
      label: 'Подобрение',
      icon: 'fas fa-arrow-up',
      cls: 'changelog-badge--improvement'
    },
    fix: {
      label: 'Корекция',
      icon: 'fas fa-wrench',
      cls: 'changelog-badge--fix'
    }
  };

const Changelog = () => {
  const { entries, markAsSeen } = useChangelog();

  useEffect(() => {
    markAsSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  return (
    <Page
      title="Какво ново"
      breadcrumbsUrls={[routes.changelog]}
      pageClassName="changelog-page"
    >
      <div className="u-spacing--double">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="changelog-entry u-padding--bottom u-border--bottom u-spacing"
          >
            <div className="changelog-entry__header">
              <h2>{entry.title}</h2>
            </div>
            <ul className="text u-spacing--half">
              {entry.changes.map((change, i) => {
                const meta = typeLabels[change.type] ?? typeLabels.improvement;
                return (
                  <li key={i} className="changelog-entry__item">
                    <span
                      className={`changelog-badge ${meta.cls} u-text-transform--upper u-text--strong`}
                    >
                      <i
                        className={`${meta.icon} u-space--quarter--right`}
                        aria-hidden="true"
                      />
                      {meta.label}
                    </span>
                    <span className="changelog-entry__text">
                      {newLinesWithLinks(change.text)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Page>
  );
};

export default Changelog;
