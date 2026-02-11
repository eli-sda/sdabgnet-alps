import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initMatomo, trackPageView } from '../analytics/matomo';

const MatomoTracker = () => {
  const location = useLocation();

  // Initialize Matomo on component mount
  useEffect(() => {
    initMatomo();
  }, []);

  // Track page view on route change
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default MatomoTracker;
