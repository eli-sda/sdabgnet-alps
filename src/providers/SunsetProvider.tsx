import { ReactNode, useState, useCallback } from 'react';
import {
  SunsetContext,
  SunsetEvent,
  SunsetsMap
} from 'src/contexts/SunsetContext';

export const SunsetProvider = ({ children }: { children: ReactNode }) => {
  const [sunsetsMap, setSunsetsMap] = useState<SunsetsMap>({});

  const setSunsets = useCallback((key: string, events: SunsetEvent[]) => {
    setSunsetsMap((prev: SunsetsMap) => ({ ...prev, [key]: events }));
  }, []);

  return (
    <SunsetContext.Provider value={{ sunsetsMap, setSunsets }}>
      {children}
    </SunsetContext.Provider>
  );
};

export default SunsetProvider;
