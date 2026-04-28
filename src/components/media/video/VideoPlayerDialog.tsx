import React, { useMemo, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import { Button as AlpsButton } from 'src/alps/atoms/Button';

import { PlaylistType } from 'src/contexts/PlaylistsContext';
import { extractYouTubeId } from 'src/utils/extractVideoId';
import VideoPlayer, { VideoPlaylistType } from './VideoPlayer';
import './VideoPlayerDialog.scss';

type VideoPlayerDialogProps = {
  playlist: PlaylistType | null;
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  playIndex?: number;
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
  playIndex = 0
}: VideoPlayerDialogProps) => {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);
  const videoPlaylist = useMemo((): VideoPlaylistType | null => {
    if (!playlist) return null;
    return {
      _id: playlist._id,
      playlistTitle: playlist.title ?? '',
      playlistAuthor: playlist.author,
      playlistDescription: playlist.description ?? '',
      videoItems:
        playlist.items?.map((item) => ({
          _id: item._id,
          videoId: extractYouTubeId(item.path) ?? '',
          title: item.title,
          author: item.author ?? '',
          description: item.description ?? ''
        })) ?? []
    };
  }, [playlist]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
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
        <div className="close-wrapper">
          <AlpsButton
            faIconClass="fas fa-times fa-lg"
            iconPosition="right"
            title="Затвори"
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
            initialIndex={playIndex}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
