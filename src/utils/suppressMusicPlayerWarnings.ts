// Utility to suppress warnings from react-jinke-music-player library
let warningsSuppressed = false;

export const suppressMusicPlayerWarnings = (): void => {
  if (warningsSuppressed) return;

  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args: unknown[]) => {
    if (args.length > 0 && typeof args[0] === 'string') {
      // Suppress any defaultProps warnings (they're almost always from third-party libraries)
      if (args[0].includes('defaultProps will be removed')) {
        return;
      }

      // Suppress unsafe lifecycle warnings from music player
      if (
        (args[0].includes('UNSAFE_componentWillMount') ||
          args[0].includes('UNSAFE_componentWillReceiveProps') ||
          args[0].includes('UNSAFE_componentWillUpdate')) &&
        (args[0].includes('PlayerMobile') ||
          args[0].includes('ReactJkMusicPlayer'))
      ) {
        return;
      }
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args: unknown[]) => {
    if (args.length > 0 && typeof args[0] === 'string') {
      // Suppress any defaultProps errors (they're almost always from third-party libraries)
      if (args[0].includes('defaultProps will be removed')) {
        return;
      }

      // Suppress findDOMNode deprecation warnings from music player
      if (args[0].includes('findDOMNode is deprecated')) {
        return;
      }
    }
    originalError.apply(console, args);
  };

  warningsSuppressed = true;
};
