import { ReactNode, useState } from 'react';
import { PoetryContext, PoetryType } from 'src/contexts/PoetryContext';

export const PoetryProvider = ({ children }: { children: ReactNode }) => {
  const [poetry, setPoetry] = useState<PoetryType[]>();
  const [lastLoaded, setLastLoaded] = useState<string>();

  return (
    <PoetryContext.Provider
      value={{
        poetry,
        setPoetry,
        lastLoaded,
        setLastLoaded
      }}
    >
      {children}
    </PoetryContext.Provider>
  );
};
