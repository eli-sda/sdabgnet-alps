import React, { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { Button as AlpsButton } from 'src/alps/atoms/Button';

import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { extractYouTubeId } from 'src/utils/extractYouTubeId';
import VideoPlayer, { VideoPlaylistType } from './VideoPlayer';
import './VideoPlayerDialog.scss';

type VideoPlayerDialogProps = {
  playlist: PlaylistType | null;
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  initialVideoId?: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const VideoPlayerDialog = ({
  playlist,
  title = '',
  isOpen,
  onClose,
  initialVideoId: propInitialVideoId
}: VideoPlayerDialogProps) => {
  const [searchParams] = useSearchParams();
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);
  // Use prop initialVideoId if provided, otherwise fall back to searchParams
  const initialVideoId = propInitialVideoId ?? searchParams.get('video') ?? undefined;
  const videoPlaylist = useMemo((): VideoPlaylistType | null => {
    if (!playlist) return null;
    return {
      _id: playlist._id,
      playlistTitle: playlist.title ?? '',
      playlistAuthor: playlist.author,
      videoItems:
        playlist.items?.map((item) => {
          let id = extractYouTubeId(item.path) ?? '';

          if (!id && item.path) {
            // try parsing v param from URL as a fallback
            try {
              const u = new URL(item.path);
              id = u.searchParams.get('v') ?? '';
            } catch {
              const m = (item.path || '').match(/[?&]v=([^&]+)/);
              if (m) id = decodeURIComponent(m[1]);
            }
          }

          return {
            videoId: id ?? '',
            title: item.title ?? '',
            description: item.description ?? ''
          };
        }) ?? []
    };
  }, [playlist]);
  
  const initialIndex = useMemo((): number => {
    if (!videoPlaylist || !initialVideoId) return -1;
    const index = videoPlaylist.videoItems.findIndex(
      (v) => v.videoId === initialVideoId
    );
    return index;
  }, [videoPlaylist, initialVideoId]);
  return (
    <Dialog
      open={isOpen}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick') return;
        handleClose();
      }}
      slots={{
        transition: Transition
      }}
      maxWidth="xl"
      fullWidth
      keepMounted // Improve performance by not unmounting on close
      className="videoPlayerDialog"
    >
      <DialogTitle className="videoPlayerDialog-title">
        {title}
        <div className="videoPlayerDialog-title-close-wrapper">
          <AlpsButton
            faIconClass="fas fa-times fa-lg"
            iconPosition="right"
            simple
            onClick={handleClose}
          />
        </div>
      </DialogTitle>
      <DialogContent>
        {videoPlaylist && (
          <VideoPlayer
            playlist={videoPlaylist}
            isVisible={isOpen}
            initialIndex={initialIndex >= 0 ? initialIndex : undefined}
            initialVideoId={initialVideoId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
