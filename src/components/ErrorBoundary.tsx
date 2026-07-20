import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private async clearCachesAndReload() {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      // Unregister the service worker so the next load fetches fresh files from network
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
      }
      console.log('Cleared all caches and unregistered SW due to chunk loading error');
    } catch (cacheError) {
      console.error('Error clearing caches:', cacheError);
    } finally {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="u-spacing u-padding"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center'
          }}
        >
          <img
            className="u-space--bottom"
            src="/img/sdabg.net-map-logo.svg"
            title="Адвентната българска мреж@"
            alt="Адвентната българска мреж@ - лого"
            style={{
              maxWidth: '400px'
            }}
          />
          <h1>Съжаляваме за неудобството</h1>
          <p style={{ maxWidth: '600px' }}>
            Възникна техническа грешка при зареждането на приложението. Това
            обикновено се случва при актуализация на сайта.
          </p>
          <p>
            Моля, опреснете страницата или опитайте отново след няколко секунди.
          </p>
          <button onClick={() => void this.clearCachesAndReload()}>
            Опресни страницата
          </button>
          {import.meta.env.DEV && this.state.error && (
            <details
              style={{
                marginTop: '20px',
                textAlign: 'left',
                maxWidth: '800px'
              }}
            >
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                Technical Details (Development)
              </summary>
              <pre
                style={{
                  padding: '15px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px'
                }}
              >
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
