import { describe, it, expect } from "vitest";
import {
  TRACK_COLORS,
  MUSICAL_KEYS,
  DEFAULT_EFFECTS,
  createMockProject,
} from "../studio";

describe("Studio types and constants", () => {
  describe("TRACK_COLORS", () => {
    it("contains 8 HSL color strings", () => {
      expect(TRACK_COLORS).toHaveLength(8);
      TRACK_COLORS.forEach((color) => {
        expect(color).toMatch(/^hsl\(\d+/);
      });
    });
  });

  describe("MUSICAL_KEYS", () => {
    it("contains all 12 chromatic notes", () => {
      expect(MUSICAL_KEYS).toHaveLength(12);
      expect(MUSICAL_KEYS).toContain("C");
      expect(MUSICAL_KEYS).toContain("F#");
      expect(MUSICAL_KEYS).toContain("B");
    });
  });

  describe("DEFAULT_EFFECTS", () => {
    it("has 4 default effects", () => {
      expect(DEFAULT_EFFECTS).toHaveLength(4);
    });

    it("only EQ is enabled by default", () => {
      const enabled = DEFAULT_EFFECTS.filter((e) => e.enabled);
      expect(enabled).toHaveLength(1);
      expect(enabled[0].type).toBe("eq");
    });

    it("each effect has an id, type, and params", () => {
      DEFAULT_EFFECTS.forEach((effect) => {
        expect(effect.id).toBeTruthy();
        expect(effect.type).toBeTruthy();
        expect(typeof effect.params).toBe("object");
      });
    });
  });

  describe("createMockProject", () => {
    it("returns a project with valid defaults", () => {
      const project = createMockProject();
      expect(project.id).toBe("project-1");
      expect(project.name).toBe("Untitled Project");
      expect(project.bpm).toBe(120);
      expect(project.key).toBe("C");
      expect(project.timeSignature).toBe("4/4");
      expect(project.stage).toBe("idea");
    });

    it("creates 5 tracks with clips", () => {
      const project = createMockProject();
      expect(project.tracks).toHaveLength(5);

      // Each track should have at least 1 clip
      project.tracks.forEach((track) => {
        expect(track.clips.length).toBeGreaterThan(0);
        expect(track.effects.length).toBe(4);
      });
    });

    it("creates unique track and clip IDs", () => {
      const project = createMockProject();
      const trackIds = project.tracks.map((t) => t.id);
      expect(new Set(trackIds).size).toBe(trackIds.length);

      const clipIds = project.tracks.flatMap((t) => t.clips.map((c) => c.id));
      expect(new Set(clipIds).size).toBe(clipIds.length);
    });

    it("includes a valid ISO timestamp", () => {
      const project = createMockProject();
      const date = new Date(project.createdAt);
      expect(date.getTime()).not.toBeNaN();
    });
  });
});
