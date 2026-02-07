export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const mapToneToFrequency = (tone: number) => {
  const clamped = clamp(tone, 0, 100);
  const min = 200;
  const max = 12000;
  const ratio = max / min;
  return min * Math.pow(ratio, clamped / 100);
};
