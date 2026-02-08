import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Track } from "@/types/studio";
import DraggableClip from "./DraggableClip";

interface TrackTimelineProps {
  track: Track;
  totalBeats: number;
  beatWidth: number;
  onToggleMute: () => void;
  onToggleSolo: () => void;
  onTogglePlay: () => void;
  isPlaying: boolean;
  onMoveClip: (clipId: string, newStart: number) => void;
  onResizeClip: (clipId: string, newDuration: number) => void;
  onSelectClip: (clipId: string) => void;
  selectedClipId: string | null;
}

const TrackTimeline = ({
  track,
  totalBeats,
  beatWidth,
  onToggleMute,
  onToggleSolo,
  onTogglePlay,
  isPlaying,
  onMoveClip,
  onResizeClip,
  onSelectClip,
  selectedClipId,
}: TrackTimelineProps) => {
  const trackHeight = 56;

  return (
    <div className="flex items-stretch border-b border-border/30 group">
      {/* Track header */}
      <div className="w-48 flex-shrink-0 p-3 flex items-center gap-2 border-r border-border/30 bg-card/30">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: track.color }} />
        <span className="text-xs font-medium text-foreground truncate flex-1">{track.name}</span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onTogglePlay}
            className="p-1 rounded text-xs transition-colors text-muted-foreground hover:text-foreground"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onToggleMute}
            className={`p-1 rounded text-xs transition-colors ${
              track.muted ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {track.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onToggleSolo}
            className={`p-1 rounded text-xs font-bold transition-colors ${
              track.solo ? "text-secondary bg-secondary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            S
          </button>
        </div>
      </div>

      {/* Clip area */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ minWidth: totalBeats * beatWidth, height: trackHeight }}
      >
        {/* Grid lines */}
        {Array.from({ length: totalBeats }).map((_, i) => (
          <div
            key={i}
            className={`absolute top-0 bottom-0 border-l ${
              i % 4 === 0 ? "border-border/30" : "border-border/10"
            }`}
            style={{ left: i * beatWidth }}
          />
        ))}

        {/* Draggable Clips */}
        {track.clips.map((clip) => (
          <DraggableClip
            key={clip.id}
            clip={clip}
            beatWidth={beatWidth}
            trackHeight={trackHeight}
            onMove={onMoveClip}
            onResize={onResizeClip}
            onSelect={onSelectClip}
            isSelected={selectedClipId === clip.id}
          />
        ))}
      </div>
    </div>
  );
};

export default TrackTimeline;
