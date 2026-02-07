import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Track } from "@/types/studio";

interface TrackTimelineProps {
  track: Track;
  totalBeats: number;
  onToggleMute: () => void;
  onToggleSolo: () => void;
  onTogglePlay: () => void;
  isPlaying: boolean;
}

const TrackTimeline = ({
  track,
  totalBeats,
  onToggleMute,
  onToggleSolo,
  onTogglePlay,
  isPlaying,
}: TrackTimelineProps) => {
  const beatWidth = 32; // px per beat

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
        className="flex-1 relative h-14 overflow-hidden"
        style={{ minWidth: totalBeats * beatWidth }}
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

        {/* Clips */}
        {track.clips.map((clip) => (
          <motion.div
            key={clip.id}
            className="absolute top-1 bottom-1 rounded-md cursor-pointer overflow-hidden"
            style={{
              left: clip.start * beatWidth,
              width: clip.duration * beatWidth,
              backgroundColor: `${clip.color}20`,
              borderLeft: `3px solid ${clip.color}`,
            }}
            whileHover={{ scale: 1.01, y: -1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="px-2 py-1">
              <span className="text-[10px] font-medium text-foreground/80 truncate block">
                {clip.label}
              </span>
            </div>
            {/* Mini waveform inside clip */}
            <div className="flex items-end gap-[1px] px-1 h-4">
              {Array.from({ length: Math.min(clip.duration * 4, 60) }).map((_, j) => (
                <div
                  key={j}
                  className="flex-1 rounded-sm"
                  style={{
                    backgroundColor: clip.color,
                    opacity: 0.4,
                    height: `${20 + Math.sin(j * 0.7) * 30 + Math.random() * 50}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrackTimeline;
