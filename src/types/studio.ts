import { AUDIO_SAMPLES } from "@/lib/audioSamples";

export type PipelineStage = "idea" | "arrange" | "mix" | "master";

export interface Effect {
  id: string;
  type: "eq" | "reverb" | "compression" | "delay" | "distortion" | "chorus";
  enabled: boolean;
  params: Record<string, number>;
}

export interface Clip {
  id: string;
  label: string;
  start: number; // position in beats
  duration: number; // in beats
  color: string;
  audioUrl?: string;
}

export interface Track {
  id: string;
  name: string;
  type: "generated" | "uploaded" | "stem" | "fx";
  color: string;
  volume: number; // 0-100
  pan: number; // -50 to 50
  muted: boolean;
  solo: boolean;
  audioUrl?: string;
  audioDurationSeconds?: number;
  playbackRate: number; // 0.5 - 2
  pitch: number; // semitones
  tone: number; // 0 - 100
  trimStart: number; // seconds
  trimEnd?: number; // seconds
  loop: boolean;
  presetId?: string;
  clips: Clip[];
  effects: Effect[];
}

export interface Project {
  id: string;
  name: string;
  bpm: number;
  key: string;
  timeSignature: string;
  stage: PipelineStage;
  tracks: Track[];
  createdAt: string;
}

export const TRACK_COLORS = [
  "hsl(187, 94%, 43%)",   // primary cyan
  "hsl(32, 95%, 55%)",    // secondary warm
  "hsl(270, 60%, 55%)",   // accent purple
  "hsl(145, 65%, 42%)",   // green
  "hsl(350, 80%, 55%)",   // red
  "hsl(45, 90%, 55%)",    // gold
  "hsl(200, 80%, 50%)",   // blue
  "hsl(320, 70%, 55%)",   // pink
];

export const MUSICAL_KEYS = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

export const DEFAULT_EFFECTS: Effect[] = [
  { id: "eq-1", type: "eq", enabled: true, params: { low: 50, mid: 50, high: 50 } },
  { id: "reverb-1", type: "reverb", enabled: false, params: { mix: 30, decay: 50, size: 40 } },
  { id: "comp-1", type: "compression", enabled: false, params: { threshold: 60, ratio: 40, attack: 20 } },
  { id: "delay-1", type: "delay", enabled: false, params: { time: 50, feedback: 30, mix: 25 } },
];

export const createMockProject = (): Project => ({
  id: "project-1",
  name: "Untitled Project",
  bpm: 120,
  key: "C",
  timeSignature: "4/4",
  stage: "idea",
  createdAt: new Date().toISOString(),
  tracks: [
    {
      id: "track-1",
      name: "Lead Synth",
      type: "generated",
      color: TRACK_COLORS[0],
      volume: 75,
      pan: 10,
      muted: false,
      solo: false,
      audioUrl: AUDIO_SAMPLES[0].url,
      audioDurationSeconds: AUDIO_SAMPLES[0].durationSeconds,
      playbackRate: 1,
      pitch: 0,
      tone: 60,
      trimStart: 0,
      trimEnd: undefined,
      loop: true,
      clips: [
        { id: "clip-1", label: "Intro Lead", start: 0, duration: 8, color: TRACK_COLORS[0] },
        { id: "clip-2", label: "Chorus Lead", start: 16, duration: 16, color: TRACK_COLORS[0] },
      ],
      effects: [...DEFAULT_EFFECTS],
    },
    {
      id: "track-2",
      name: "Drums",
      type: "generated",
      color: TRACK_COLORS[1],
      volume: 85,
      pan: 0,
      muted: false,
      solo: false,
      audioUrl: AUDIO_SAMPLES[0].url,
      audioDurationSeconds: AUDIO_SAMPLES[0].durationSeconds,
      playbackRate: 1.05,
      pitch: 1,
      tone: 70,
      trimStart: 0,
      trimEnd: undefined,
      loop: true,
      clips: [
        { id: "clip-3", label: "Beat Pattern A", start: 0, duration: 16, color: TRACK_COLORS[1] },
        { id: "clip-4", label: "Fill", start: 16, duration: 4, color: TRACK_COLORS[1] },
        { id: "clip-5", label: "Beat Pattern B", start: 20, duration: 12, color: TRACK_COLORS[1] },
      ],
      effects: [...DEFAULT_EFFECTS],
    },
    {
      id: "track-3",
      name: "Bass",
      type: "generated",
      color: TRACK_COLORS[2],
      volume: 70,
      pan: -5,
      muted: false,
      solo: false,
      audioUrl: AUDIO_SAMPLES[0].url,
      audioDurationSeconds: AUDIO_SAMPLES[0].durationSeconds,
      playbackRate: 0.95,
      pitch: -1,
      tone: 45,
      trimStart: 0,
      trimEnd: undefined,
      loop: true,
      clips: [
        { id: "clip-6", label: "Bassline", start: 4, duration: 28, color: TRACK_COLORS[2] },
      ],
      effects: [...DEFAULT_EFFECTS],
    },
    {
      id: "track-4",
      name: "Ambient Pad",
      type: "generated",
      color: TRACK_COLORS[3],
      volume: 45,
      pan: -20,
      muted: false,
      solo: false,
      audioUrl: AUDIO_SAMPLES[1].url,
      audioDurationSeconds: AUDIO_SAMPLES[1].durationSeconds,
      playbackRate: 0.85,
      pitch: -3,
      tone: 35,
      trimStart: 0,
      trimEnd: undefined,
      loop: true,
      clips: [
        { id: "clip-7", label: "Pad Wash", start: 0, duration: 32, color: TRACK_COLORS[3] },
      ],
      effects: [...DEFAULT_EFFECTS],
    },
    {
      id: "track-5",
      name: "Vocals",
      type: "uploaded",
      color: TRACK_COLORS[4],
      volume: 80,
      pan: 0,
      muted: false,
      solo: false,
      audioUrl: AUDIO_SAMPLES[2].url,
      audioDurationSeconds: AUDIO_SAMPLES[2].durationSeconds,
      playbackRate: 1,
      pitch: 2,
      tone: 75,
      trimStart: 0,
      trimEnd: undefined,
      loop: true,
      clips: [
        { id: "clip-8", label: "Verse 1", start: 8, duration: 8, color: TRACK_COLORS[4] },
        { id: "clip-9", label: "Chorus Vocal", start: 20, duration: 8, color: TRACK_COLORS[4] },
      ],
      effects: [...DEFAULT_EFFECTS],
    },
  ],
});
