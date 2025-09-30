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

    // Check if this is a chunk loading error
    const isChunkError =
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to load module script');

    if (isChunkError) {
      // Clear caches and reload
      void this.clearCachesAndReload();
    }
  }

  private async clearCachesAndReload() {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      console.log('Cleared all caches due to chunk loading error');
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
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          <h1 style={{ color: '#007f98', marginBottom: '20px' }}>
            Съжаляваме за неудобството
          </h1>
          <p
            style={{
              marginBottom: '20px',
              maxWidth: '600px',
              lineHeight: '1.5'
            }}
          >
            Възникна техническа грешка при зареждането на приложението. Това
            обикновено се случва при актуализация на сайта.
          </p>
          <p style={{ marginBottom: '30px', color: '#666' }}>
            Моля, опреснете страницата или опитайте отново след няколко секунди.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007f98',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#005f75';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#007f98';
            }}
          >
            Опресни страницата
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
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
                  background: '#f5f5f5',
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
