import { Play, Pause, Timer } from "lucide-react";
import { Track } from "@/types/studio";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { formatTime, mapToneToFrequency } from "@/lib/audioUtils";

interface TrackInspectorProps {
  track: Track;
  durationSeconds?: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onUpdateTrack: (updates: Partial<Track>) => void;
}

const TrackInspector = ({
  track,
  durationSeconds,
  isPlaying,
  onTogglePlay,
  onUpdateTrack,
}: TrackInspectorProps) => {
  const duration = durationSeconds ?? track.audioDurationSeconds ?? 0;
  const trimStart = track.trimStart ?? 0;
  const trimEnd = track.trimEnd ?? (duration > 0 ? duration : 0);
  const toneFrequency = Math.round(mapToneToFrequency(track.tone));

  const handleTrimChange = ([start, end]: number[]) => {
    const safeStart = Math.max(0, start);
    const safeEnd = Math.max(safeStart, end);
    onUpdateTrack({ trimStart: safeStart, trimEnd: safeEnd });
  };

  return (
    <div className="glass-panel p-5 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Track Controls</h4>
          <p className="text-xs text-muted-foreground">{track.name}</p>
        </div>
        <button
          onClick={onTogglePlay}
          className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
        >
          {isPlaying ? (
            <span className="flex items-center gap-1">
              <Pause className="w-3.5 h-3.5" /> Pause
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Play className="w-3.5 h-3.5" /> Play
            </span>
          )}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Speed</span>
            <span className="font-mono">{track.playbackRate.toFixed(2)}x</span>
          </div>
          <Slider
            value={[track.playbackRate]}
            onValueChange={([value]) => onUpdateTrack({ playbackRate: value })}
            min={0.5}
            max={2}
            step={0.05}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Pitch</span>
            <span className="font-mono">{track.pitch > 0 ? `+${track.pitch}` : track.pitch} st</span>
          </div>
          <Slider
            value={[track.pitch]}
            onValueChange={([value]) => onUpdateTrack({ pitch: value })}
            min={-12}
            max={12}
            step={1}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Tone (Filter)</span>
          <span className="font-mono">{toneFrequency} Hz</span>
        </div>
        <Slider
          value={[track.tone]}
          onValueChange={([value]) => onUpdateTrack({ tone: value })}
          min={0}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Trim</span>
          <span className="font-mono">
            {formatTime(trimStart)} - {formatTime(trimEnd)}
          </span>
        </div>
        <Slider
          value={[trimStart, trimEnd]}
          onValueChange={handleTrimChange}
          min={0}
          max={duration || 1}
          step={0.05}
          disabled={duration === 0}
        />
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Timer className="w-3.5 h-3.5" />
          <span>Length: {formatTime(Math.max(0, trimEnd - trimStart))}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Loop Track</span>
        <Switch checked={track.loop} onCheckedChange={(value) => onUpdateTrack({ loop: value })} />
      </div>
    </div>
  );
};

export default TrackInspector;
