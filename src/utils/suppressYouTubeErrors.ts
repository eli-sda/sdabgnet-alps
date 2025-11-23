/**
 * Suppress YouTube embed player errors from console
 * These errors occur when ad blockers or browser extensions block YouTube's analytics/tracking requests
 * They don't affect functionality and are safe to ignore
 */
export function suppressYouTubeErrors() {
  // List of patterns to suppress
  const blockedPatterns = [
    'youtubei/v1/log_event',
    'youtube.com/generate_204',
    'play.google.com/log',
    'doubleclick.net',
    'ERR_BLOCKED_BY_CLIENT'
  ];

  // Helper to check if message should be suppressed
  const shouldSuppress = (message: string): boolean =>
    blockedPatterns.some((pattern) => message.includes(pattern));

  // Suppress console.error and console.warn
  const wrapConsoleMethod = (
    method: 'error' | 'warn'
  ): ((...args: unknown[]) => void) => {
    const original = console[method];
    return (...args: unknown[]) => {
      const message = args.join(' ');
      if (typeof message === 'string' && shouldSuppress(message)) {
        return;
      }
      original.apply(console, args);
    };
  };

  console.error = wrapConsoleMethod('error');
  console.warn = wrapConsoleMethod('warn');

  // Suppress unhandled promise rejections from YouTube embeds
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason as unknown;
    if (
      reason &&
      typeof reason === 'object' &&
      'message' in reason &&
      typeof reason.message === 'string' &&
      shouldSuppress(reason.message)
    ) {
      event.preventDefault();
    }
  });
}
