import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface MusicGenRequest {
  prompt: string;
  duration?: number; // in seconds, default 8
  model?: "small" | "medium" | "large"; // MusicGen model size
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const HUGGINGFACE_API_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
    if (!HUGGINGFACE_API_KEY) {
      console.error("Missing HUGGINGFACE_API_KEY");
      return new Response(
        JSON.stringify({ error: "Hugging Face API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: MusicGenRequest = await req.json();
    const { prompt, duration = 8, model = "small" } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Prompt is required and must be a non-empty string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (duration < 1 || duration > 30) {
      return new Response(
        JSON.stringify({ error: "Duration must be between 1 and 30 seconds" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating music: prompt="${prompt}", duration=${duration}s, model=${model}`);

    // MusicGen model endpoint on Hugging Face Inference API
    const modelId = `facebook/musicgen-${model}`;
    const apiUrl = `https://api-inference.huggingface.co/models/${modelId}`;

    // The HF inference API for audio generation accepts text prompts
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: Math.round(duration * 50), // Approximate tokens per second
        },
        options: {
          wait_for_model: true,
          use_cache: false,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Hugging Face API error [${response.status}]: ${errorText}`);
      
      if (response.status === 503) {
        return new Response(
          JSON.stringify({ 
            error: "Model is loading, please try again in a few seconds",
            retryAfter: 20 
          }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: `Music generation failed: ${errorText}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // The response is audio data (typically FLAC or WAV)
    const audioBuffer = await response.arrayBuffer();
    
    if (audioBuffer.byteLength < 1000) {
      console.error("Generated audio is too small, likely an error");
      return new Response(
        JSON.stringify({ error: "Generated audio is invalid" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully generated ${audioBuffer.byteLength} bytes of audio`);

    // Return the audio data as binary
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/flac",
        "Content-Length": String(audioBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("MusicGen function error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
