import { useState, useCallback } from "react";
import { Project, PipelineStage, Track, TRACK_COLORS, DEFAULT_EFFECTS, createMockProject } from "@/types/studio";

export const useStudioProject = () => {
  const [project, setProject] = useState<Project>(createMockProject());

  const setStage = useCallback((stage: PipelineStage) => {
    setProject((prev) => ({ ...prev, stage }));
  }, []);

  const updateProjectMeta = useCallback((updates: Partial<Pick<Project, "name" | "bpm" | "key" | "timeSignature">>) => {
    setProject((prev) => ({ ...prev, ...updates }));
  }, []);

  const addTrack = useCallback((name: string, type: Track["type"] = "generated") => {
    const colorIndex = project.tracks.length % TRACK_COLORS.length;
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name,
      type,
      color: TRACK_COLORS[colorIndex],
      volume: 75,
      pan: 0,
      muted: false,
      solo: false,
      clips: [],
      effects: [...DEFAULT_EFFECTS],
    };
    setProject((prev) => ({ ...prev, tracks: [...prev.tracks, newTrack] }));
  }, [project.tracks.length]);

  const removeTrack = useCallback((trackId: string) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.filter((t) => t.id !== trackId),
    }));
  }, []);

  const updateTrack = useCallback((trackId: string, updates: Partial<Track>) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, ...updates } : t)),
    }));
  }, []);

  const toggleMute = useCallback((trackId: string) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t)),
    }));
  }, []);

  const toggleSolo = useCallback((trackId: string) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, solo: !t.solo } : t)),
    }));
  }, []);

  return {
    project,
    setStage,
    updateProjectMeta,
    addTrack,
    removeTrack,
    updateTrack,
    toggleMute,
    toggleSolo,
  };
};
