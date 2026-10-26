export interface MediaPlayerControls {
  playIndex?: number;
  onPlayIndexChange?: (index: number) => void;
  initialTime?: number;
  onInitialTimeApplied?: () => void;
  /** Track opened from a shared link; the player must stop when it ends. */
  linkTrackId?: string | null;
}
export type Expand<T> = { [K in keyof T]: T[K] };

// 3. Combine them using an intersection (&) wrapped in Expand
export type MediaPlayerRenderControls = Expand<
  MediaPlayerControls & {
    openedViaLink?: boolean;
  }
>;
