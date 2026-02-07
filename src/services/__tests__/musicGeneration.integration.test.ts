import { describe, it, expect } from "vitest";

// Edge function integration tests (run against deployed function)
// These tests verify the actual audio generation works end-to-end

const SUPABASE_URL = "https://dkigkaowwcdpfilisrum.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRraWdrYW93d2NkcGZpbGlzcnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQ3MzksImV4cCI6MjA4NjA3MDczOX0.GQGsagLO77_NTZk7qBoTTNOP683chRSDf40iHvxnIiQ";

describe("ElevenLabs Music Edge Function (Integration)", () => {
  it("returns error for empty prompt", async () => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-music`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ prompt: "" }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Prompt is required");
  });

  it("returns error for missing prompt", async () => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-music`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Prompt is required");
  });

  // This test actually calls ElevenLabs - run manually or in CI with API key
  it.skip("generates audio for valid prompt", async () => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-music`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        prompt: "Short 5 second lo-fi beat",
        duration: 5,
      }),
    });

    expect(response.ok).toBe(true);
    expect(response.headers.get("content-type")).toBe("audio/mpeg");

    const audioBlob = await response.blob();
    expect(audioBlob.size).toBeGreaterThan(0);
    expect(audioBlob.type).toBe("audio/mpeg");
  }, 60000); // 60 second timeout for API call
});
