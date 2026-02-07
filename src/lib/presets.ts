export interface TrackPreset {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  settings: {
    playbackRate?: number;
    pitch?: number;
    tone?: number;
    loop?: boolean;
  };
}

const PRESETS: TrackPreset[] = [
  {
    id: "warm-lofi",
    label: "Warm Lo-fi",
    description: "Softened highs, relaxed tempo, tape-like feel.",
    keywords: ["lofi", "rain", "chill", "dusty", "warm"],
    settings: { playbackRate: 0.9, pitch: -2, tone: 35, loop: true },
  },
  {
    id: "cinematic-wide",
    label: "Cinematic Wide",
    description: "Slow movement with a wider, darker tone.",
    keywords: ["cinematic", "trailer", "epic", "orch", "orchestral"],
    settings: { playbackRate: 0.95, pitch: -1, tone: 55, loop: true },
  },
  {
    id: "bright-pop",
    label: "Bright Pop",
    description: "Upfront highs with a lively tempo lift.",
    keywords: ["pop", "bright", "uplift", "happy", "dance"],
    settings: { playbackRate: 1.05, pitch: 2, tone: 80, loop: true },
  },
  {
    id: "ambient-haze",
    label: "Ambient Haze",
    description: "Slow, soft edges and low-pass smoothing.",
    keywords: ["ambient", "pad", "haze", "drone", "atmos"],
    settings: { playbackRate: 0.85, pitch: -3, tone: 30, loop: true },
  },
  {
    id: "punchy-drums",
    label: "Punchy Drums",
    description: "Tighter lows with extra snap.",
    keywords: ["drum", "kick", "snare", "percussion", "beat"],
    settings: { playbackRate: 1.1, pitch: 1, tone: 70, loop: true },
  },
  {
    id: "vocal-lift",
    label: "Vocal Lift",
    description: "Slight pitch rise with cleaner highs.",
    keywords: ["vocal", "voice", "melody", "choir"],
    settings: { playbackRate: 1, pitch: 3, tone: 75, loop: true },
  },
];

const normalize = (value?: string) => value?.toLowerCase() ?? "";

export const getSuggestedPresets = (prompt?: string, fileName?: string) => {
  const haystack = `${normalize(prompt)} ${normalize(fileName)}`.trim();
  if (!haystack) return PRESETS.slice(0, 3);

  const scored = PRESETS.map((preset) => {
    const score = preset.keywords.reduce((total, keyword) => {
      return total + (haystack.includes(keyword) ? 1 : 0);
    }, 0);
    return { preset, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.preset);

  return scored.length > 0 ? scored.slice(0, 3) : PRESETS.slice(0, 3);
};

export const getPresetById = (presetId?: string) =>
  PRESETS.find((preset) => preset.id === presetId);
