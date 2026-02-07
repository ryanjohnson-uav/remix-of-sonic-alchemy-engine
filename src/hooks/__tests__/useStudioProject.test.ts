import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStudioProject } from "../useStudioProject";

describe("useStudioProject", () => {
  it("initializes with a mock project in 'idea' stage", () => {
    const { result } = renderHook(() => useStudioProject());
    expect(result.current.project.stage).toBe("idea");
    expect(result.current.project.name).toBe("Untitled Project");
    expect(result.current.project.bpm).toBe(120);
    expect(result.current.project.tracks.length).toBe(5);
  });

  it("setStage changes the pipeline stage", () => {
    const { result } = renderHook(() => useStudioProject());
    act(() => result.current.setStage("arrange"));
    expect(result.current.project.stage).toBe("arrange");

    act(() => result.current.setStage("mix"));
    expect(result.current.project.stage).toBe("mix");

    act(() => result.current.setStage("master"));
    expect(result.current.project.stage).toBe("master");
  });

  it("updateProjectMeta updates BPM, key, and name", () => {
    const { result } = renderHook(() => useStudioProject());

    act(() => result.current.updateProjectMeta({ bpm: 140 }));
    expect(result.current.project.bpm).toBe(140);

    act(() => result.current.updateProjectMeta({ name: "My Song", key: "D#" }));
    expect(result.current.project.name).toBe("My Song");
    expect(result.current.project.key).toBe("D#");
  });

  it("addTrack appends a new track with correct defaults", () => {
    const { result } = renderHook(() => useStudioProject());
    const initialCount = result.current.project.tracks.length;

    act(() => result.current.addTrack("New Synth", "generated"));
    expect(result.current.project.tracks.length).toBe(initialCount + 1);

    const newTrack = result.current.project.tracks[initialCount];
    expect(newTrack.name).toBe("New Synth");
    expect(newTrack.type).toBe("generated");
    expect(newTrack.volume).toBe(75);
    expect(newTrack.pan).toBe(0);
    expect(newTrack.muted).toBe(false);
    expect(newTrack.solo).toBe(false);
    expect(newTrack.clips).toEqual([]);
    expect(newTrack.effects.length).toBe(4);
  });

  it("removeTrack removes a track by ID", () => {
    const { result } = renderHook(() => useStudioProject());
    const trackId = result.current.project.tracks[0].id;

    act(() => result.current.removeTrack(trackId));
    expect(result.current.project.tracks.find((t) => t.id === trackId)).toBeUndefined();
    expect(result.current.project.tracks.length).toBe(4);
  });

  it("updateTrack partially updates a track", () => {
    const { result } = renderHook(() => useStudioProject());
    const trackId = result.current.project.tracks[0].id;

    act(() => result.current.updateTrack(trackId, { volume: 50, pan: -30 }));
    const updated = result.current.project.tracks.find((t) => t.id === trackId)!;
    expect(updated.volume).toBe(50);
    expect(updated.pan).toBe(-30);
  });

  it("toggleMute flips the muted state", () => {
    const { result } = renderHook(() => useStudioProject());
    const trackId = result.current.project.tracks[0].id;

    expect(result.current.project.tracks[0].muted).toBe(false);
    act(() => result.current.toggleMute(trackId));
    expect(result.current.project.tracks.find((t) => t.id === trackId)!.muted).toBe(true);
    act(() => result.current.toggleMute(trackId));
    expect(result.current.project.tracks.find((t) => t.id === trackId)!.muted).toBe(false);
  });

  it("toggleSolo flips the solo state", () => {
    const { result } = renderHook(() => useStudioProject());
    const trackId = result.current.project.tracks[1].id;

    expect(result.current.project.tracks[1].solo).toBe(false);
    act(() => result.current.toggleSolo(trackId));
    expect(result.current.project.tracks.find((t) => t.id === trackId)!.solo).toBe(true);
  });
});
