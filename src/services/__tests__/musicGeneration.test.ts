import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock environment variables
vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "test-anon-key");

describe("musicGeneration service", () => {
  let generateMusic: typeof import("../musicGeneration").generateMusic;
  let revokeAudioUrl: typeof import("../musicGeneration").revokeAudioUrl;

  beforeEach(async () => {
    vi.resetModules();
    const module = await import("../musicGeneration");
    generateMusic = module.generateMusic;
    revokeAudioUrl = module.revokeAudioUrl;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("generateMusic", () => {
    it("throws error when prompt is empty", async () => {
      await expect(generateMusic("")).rejects.toThrow("Prompt is required");
      await expect(generateMusic("   ")).rejects.toThrow("Prompt is required");
    });

    it("makes correct API call with prompt and duration", async () => {
      const mockAudioBlob = new Blob(["mock audio data"], { type: "audio/mpeg" });
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "audio/mpeg" }),
        blob: () => Promise.resolve(mockAudioBlob),
      });
      vi.stubGlobal("fetch", mockFetch);

      await generateMusic("Lo-fi beats", 30);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://test.supabase.co/functions/v1/elevenlabs-music",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            apikey: "test-anon-key",
            Authorization: "Bearer test-anon-key",
          }),
          body: JSON.stringify({ prompt: "Lo-fi beats", duration: 30 }),
        })
      );
    });

    it("returns audioUrl and duration on success", async () => {
      const mockAudioBlob = new Blob(["mock audio data"], { type: "audio/mpeg" });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "audio/mpeg" }),
        blob: () => Promise.resolve(mockAudioBlob),
      }));

      const result = await generateMusic("Epic soundtrack", 45);

      expect(result.audioUrl).toMatch(/^blob:/);
      expect(result.duration).toBe(45);
      expect(result.audioBlob).toBeInstanceOf(Blob);
      expect(result.mimeType).toBe("audio/mpeg");
    });

    it("throws error when API returns JSON error", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: new Headers({ "content-type": "application/json" }),
        json: () => Promise.resolve({ error: "Invalid prompt" }),
      }));

      await expect(generateMusic("test")).rejects.toThrow("Invalid prompt");
    });

    it("throws error when API returns non-OK status without JSON", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        headers: new Headers({ "content-type": "text/plain" }),
      }));

      await expect(generateMusic("test")).rejects.toThrow("Music generation failed: 500");
    });

    it("throws error when audio blob is empty", async () => {
      const emptyBlob = new Blob([], { type: "audio/mpeg" });
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "audio/mpeg" }),
        blob: () => Promise.resolve(emptyBlob),
      }));

      await expect(generateMusic("test")).rejects.toThrow("No audio was generated");
    });

    it("uses default duration of 30 when not specified", async () => {
      const mockAudioBlob = new Blob(["audio"], { type: "audio/mpeg" });
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "audio/mpeg" }),
        blob: () => Promise.resolve(mockAudioBlob),
      });
      vi.stubGlobal("fetch", mockFetch);

      await generateMusic("ambient music");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ prompt: "ambient music", duration: 30 }),
        })
      );
    });
  });

  describe("revokeAudioUrl", () => {
    it("calls revokeObjectURL for blob URLs", () => {
      const mockRevoke = vi.fn();
      vi.stubGlobal("URL", { ...URL, revokeObjectURL: mockRevoke });

      revokeAudioUrl("blob:http://localhost/test-id");

      expect(mockRevoke).toHaveBeenCalledWith("blob:http://localhost/test-id");
    });

    it("does not call revokeObjectURL for non-blob URLs", () => {
      const mockRevoke = vi.fn();
      vi.stubGlobal("URL", { ...URL, revokeObjectURL: mockRevoke });

      revokeAudioUrl("https://example.com/audio.mp3");

      expect(mockRevoke).not.toHaveBeenCalled();
    });
  });
});
