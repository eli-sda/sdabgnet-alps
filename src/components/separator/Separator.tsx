import './Separator.scss';

export const Separator = ({ type }: { type: 'top' | 'bottom' }) => {
  return (
    <div className="separator-wrapper">
      <div className={`separator--${type}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1600 200"
          className="separator__layer-1"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M1413.6 161.4c-157.9 0-338.2-37.7-495.1-67.4-215.6-40.8-328.1-44.6-418.2-41.1S317 73.4 188.4 102-10 136.2-10 136.2v74.2h1620v-68.5s-68.8 19.5-196.4 19.5z"></path>
        </svg>
      </div>
    </div>
  );
};

export const SeparatorTop = () => <Separator type="top" />;
export const SeparatorBottom = () => <Separator type="bottom" />;
