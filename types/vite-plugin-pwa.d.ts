declare module 'vite-plugin-pwa/react' {
  export interface UseRegisterSWOptions {
    onRegistered?: (
      registration: ServiceWorkerRegistration | undefined
    ) => void;
    onRegisterError?: (error: unknown) => void;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }

  export function useRegisterSW(options?: UseRegisterSWOptions): {
    needRefresh: boolean;
    offlineReady: boolean;
    updateServiceWorker: (reloadPage?: boolean) => void;
  };
}
