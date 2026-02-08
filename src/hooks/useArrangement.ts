import { useState, useCallback } from "react";
import { Clip, Track } from "@/types/studio";

export interface ArrangementState {
  selectedClipId: string | null;
  selectedTrackId: string | null;
  zoomLevel: number;
  clipboard: Clip | null;
}

export const useArrangement = (
  tracks: Track[],
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void
) => {
  const [state, setState] = useState<ArrangementState>({
    selectedClipId: null,
    selectedTrackId: null,
    zoomLevel: 1,
    clipboard: null,
  });

  const selectClip = useCallback((clipId: string, trackId: string) => {
    setState((prev) => ({
      ...prev,
      selectedClipId: clipId,
      selectedTrackId: trackId,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedClipId: null,
      selectedTrackId: null,
    }));
  }, []);

  const moveClip = useCallback(
    (trackId: string, clipId: string, newStart: number) => {
      const track = tracks.find((t) => t.id === trackId);
      if (!track) return;

      const updatedClips = track.clips.map((c) =>
        c.id === clipId ? { ...c, start: newStart } : c
      );
      onUpdateTrack(trackId, { clips: updatedClips });
    },
    [tracks, onUpdateTrack]
  );

  const resizeClip = useCallback(
    (trackId: string, clipId: string, newDuration: number) => {
      const track = tracks.find((t) => t.id === trackId);
      if (!track) return;

      const updatedClips = track.clips.map((c) =>
        c.id === clipId ? { ...c, duration: newDuration } : c
      );
      onUpdateTrack(trackId, { clips: updatedClips });
    },
    [tracks, onUpdateTrack]
  );

  const splitClip = useCallback(
    (splitPosition: number) => {
      if (!state.selectedClipId || !state.selectedTrackId) return;

      const track = tracks.find((t) => t.id === state.selectedTrackId);
      if (!track) return;

      const clip = track.clips.find((c) => c.id === state.selectedClipId);
      if (!clip) return;

      // Only split if position is within clip bounds
      if (splitPosition <= clip.start || splitPosition >= clip.start + clip.duration) {
        return;
      }

      const firstDuration = splitPosition - clip.start;
      const secondDuration = clip.duration - firstDuration;

      const newClips = track.clips.flatMap((c) => {
        if (c.id === state.selectedClipId) {
          return [
            { ...c, duration: firstDuration },
            {
              ...c,
              id: `${c.id}-split-${Date.now()}`,
              label: `${c.label} (2)`,
              start: splitPosition,
              duration: secondDuration,
            },
          ];
        }
        return [c];
      });

      onUpdateTrack(state.selectedTrackId, { clips: newClips });
    },
    [state.selectedClipId, state.selectedTrackId, tracks, onUpdateTrack]
  );

  const copyClip = useCallback(() => {
    if (!state.selectedClipId || !state.selectedTrackId) return;

    const track = tracks.find((t) => t.id === state.selectedTrackId);
    if (!track) return;

    const clip = track.clips.find((c) => c.id === state.selectedClipId);
    if (!clip) return;

    setState((prev) => ({ ...prev, clipboard: { ...clip } }));
  }, [state.selectedClipId, state.selectedTrackId, tracks]);

  const pasteClip = useCallback(() => {
    if (!state.clipboard || !state.selectedTrackId) return;

    const track = tracks.find((t) => t.id === state.selectedTrackId);
    if (!track) return;

    // Find the end of all clips to paste after
    const maxEnd = track.clips.reduce(
      (max, c) => Math.max(max, c.start + c.duration),
      0
    );

    const newClip: Clip = {
      ...state.clipboard,
      id: `clip-${Date.now()}`,
      start: maxEnd,
    };

    onUpdateTrack(state.selectedTrackId, { clips: [...track.clips, newClip] });
  }, [state.clipboard, state.selectedTrackId, tracks, onUpdateTrack]);

  const deleteClip = useCallback(() => {
    if (!state.selectedClipId || !state.selectedTrackId) return;

    const track = tracks.find((t) => t.id === state.selectedTrackId);
    if (!track) return;

    const updatedClips = track.clips.filter((c) => c.id !== state.selectedClipId);
    onUpdateTrack(state.selectedTrackId, { clips: updatedClips });
    clearSelection();
  }, [state.selectedClipId, state.selectedTrackId, tracks, onUpdateTrack, clearSelection]);

  const zoomIn = useCallback(() => {
    setState((prev) => ({ ...prev, zoomLevel: Math.min(prev.zoomLevel * 1.25, 3) }));
  }, []);

  const zoomOut = useCallback(() => {
    setState((prev) => ({ ...prev, zoomLevel: Math.max(prev.zoomLevel / 1.25, 0.5) }));
  }, []);

  return {
    ...state,
    selectClip,
    clearSelection,
    moveClip,
    resizeClip,
    splitClip,
    copyClip,
    pasteClip,
    deleteClip,
    zoomIn,
    zoomOut,
  };
};
