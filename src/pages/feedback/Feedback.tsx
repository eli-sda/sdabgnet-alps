import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Caption } from 'alps-library/atoms/text/Caption';
import routes from 'src/routes';
import { Page } from 'src/organisms/Page';
import { getTitle } from 'src/utils/Navigation';
import './Feedback.scss';

type FeedbackItem = {
  text: string;
  name?: string;
  date?: string;
};

const Feedback = () => {
  const breadcrumbsUrls = [routes.about(), routes.about('feedback')];

  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    fetch('/json/feedback.json')
      .then((res) => res.json())
      .then((data: FeedbackItem[]) => setFeedback(data))
      .catch((err) => {
        console.error('Failed to load feedback.json', err);
        setFeedback([]);
      });
  }, []);

  return (
    <Page
      title={getTitle(routes.about('feedback'))}
      breadcrumbsUrls={breadcrumbsUrls}
    >
      <section className="feedback-page">
        <Caption>
          За да изпратите отзив за обновения сайт на Адвентната българска мреж@,
          използвайте <NavLink to={routes.contact}>формата за контакт</NavLink>{' '}
          или пишете имейл на{' '}
          <a href="mailto:webmaster@sdabg.net?subject=Отзив за sdabg.net">
            webmaster@sdabg.net
          </a>
        </Caption>

        <ul className="u-spacing--double u-space--double--top">
          {feedback.map((item, index) => (
            <li key={index} className="u-theme--color--darker">
              <i className="far fa-comment u-space--half--right"></i>
              {item.text}
              <br />
              <div className="u-space--half--top info">
                <span>{item.name}</span>
                <span className="u-space--half--left">{item.date}</span>
              </div>
              <hr className="u-background-color--winter u-space--half--top" />
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
};

export default Feedback;
