import { useEffect, useState } from 'react';
import './ScrollUpButton.scss';
const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`scrollup ${isVisible ? 'is-active' : ''}`}
      onClick={scrollToTop}
      title="Върни се в началото на страницата"
    >
      <i className="fa fa-arrow-up"></i>
    </button>
  );
};

export default ScrollUpButton;
