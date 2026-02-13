import { useEffect, useState } from 'react';
import { Notification } from 'alps-library/molecules/store/notification/Notification.tsx';
import { API_PATH, API_URL } from 'src/constants';
import './ResourceUnavailableNotice.scss';

type ResourceResponse = { status: boolean } | { error: string };

export const ResourceUnavailableNotice = () => {
  const [isUnavailable, setIsUnavailable] = useState(false);
  const url = `${import.meta.env.DEV ? API_PATH : API_URL}/resourceServer.php`;

  useEffect(() => {
    const check = async (): Promise<void> => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;

        const data = (await res.json()) as ResourceResponse;

        if ('error' in data) return;

        setIsUnavailable(!data.status);
      } catch {
        // ingore errors, we will just not show the notice
      }
    };

    void check();

    const intervalId = setInterval(
      () => {
        void check();
      },
      5 * 60 * 1000 // every 5 minutes
    );

    return () => clearInterval(intervalId);
  }, []);

  if (!isUnavailable) return null;

  return (
    <section className="resource-notification u-space--bottom u-space--right u-space--left">
      <Notification
        title="Предупреждение"
        content="Сървърът с ресурси за изтегляне е временно недостъпен!"
        faIconClass="fas fa-exclamation-triangle u-space--half--right"
      />
    </section>
  );
};
