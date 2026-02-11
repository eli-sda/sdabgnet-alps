import { Notification } from 'alps-library/molecules/store/notification/Notification.tsx';
import { useResourceServerStatus } from 'src/hooks/useResourceServerStatus';

export const ResourceUnavailableNotice = () => {
  const isUnavailable = useResourceServerStatus();

  if (!isUnavailable) {
    return null;
  }

  return (
    <section className="u-space--bottom u-space--left">
      <Notification
        title="Предупреждение"
        content={'Сървърът с ресурси е временно недостъпен!'}
        faIconClass="fas fa-exclamation-triangle u-space--half--right"
      />
    </section>
  );
};
