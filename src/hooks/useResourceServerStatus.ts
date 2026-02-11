import { useEffect, useRef, useState } from 'react';
import { API_PATH, API_URL } from 'src/constants';

const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

type ResourceServerResponse = {
  status: boolean;
};

export function useResourceServerStatus(): boolean {
  const [isUnavailable, setIsUnavailable] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkServer = async (): Promise<void> => {
      // Abort any previous pending request
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const url = `${import.meta.env.DEV ? API_PATH : API_URL}/resourceServer.php`;

        const res = await fetch(url, {
          signal: controller.signal
        });

        if (!mounted) return;

        if (!res.ok) {
          setIsUnavailable(true);
          return;
        }

        const json: unknown = await res.json();

        const isResourceServerResponse = (
          obj: unknown
        ): obj is ResourceServerResponse => {
          if (typeof obj !== 'object' || obj === null) return false;
          const rec = obj as Record<string, unknown>;
          return 'status' in rec && typeof rec.status === 'boolean';
        };

        const data: ResourceServerResponse = isResourceServerResponse(json)
          ? json
          : { status: false };

        if (!mounted) return;

        setIsUnavailable(data.status === false);
      } catch (e: unknown) {
        console.error('FETCH ERROR:', e);

        const getErrorName = (err: unknown): string | undefined => {
          if (typeof err === 'object' && err !== null) {
            const rec = err as Record<string, unknown>;
            const name = rec.name;
            return typeof name === 'string' ? name : undefined;
          }
          return undefined;
        };

        if (getErrorName(e) === 'AbortError') return;
        if (mounted) setIsUnavailable(true);
      } finally {
        // clear controller reference if it's the same one we created for this request
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }
      }
    };

    const runCheckServer = () => {
      void checkServer();
    };

    // initial check
    runCheckServer();

    const intervalId = window.setInterval(runCheckServer, CHECK_INTERVAL);

    return () => {
      mounted = false;
      controllerRef.current?.abort();
      clearInterval(intervalId);
    };
  }, []);

  return isUnavailable;
}
