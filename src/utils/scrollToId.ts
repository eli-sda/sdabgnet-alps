/**
 * Smooth-scrolls to an element by id, optionally deferred to the next frame.
 * When deferred, retries for a few frames until the element is rendered, so it
 * also works right after a state update that mounts the target.
 */
export const scrollToId = (elementId: string, deferred = false): void => {
  const scroll = (retriesLeft: number) => {
    const element = document.getElementById(elementId);
    if (!element) {
      if (retriesLeft > 0) {
        requestAnimationFrame(() => scroll(retriesLeft - 1));
      }
      return;
    }
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (deferred) {
    requestAnimationFrame(() => scroll(20));
  } else {
    scroll(0);
  }
};
