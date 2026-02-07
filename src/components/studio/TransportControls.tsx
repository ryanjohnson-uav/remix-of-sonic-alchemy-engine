import { useState } from "react";
import { Play, Pause, Square, SkipBack, SkipForward, Repeat, Mic } from "lucide-react";
import { motion } from "framer-motion";

interface TransportControlsProps {
  bpm: number;
  timeSignature: string;
  onBpmChange: (bpm: number) => void;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  onStop?: () => void;
  onRewind?: () => void;
}

const TransportControls = ({
  bpm,
  timeSignature,
  onBpmChange,
  isPlaying,
  onPlayToggle,
  onStop,
  onRewind,
}: TransportControlsProps) => {
  const [internalPlaying, setInternalPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [position, setPosition] = useState("1.1.1");
  const playing = isPlaying ?? internalPlaying;

  return (
    <div className="flex items-center gap-4">
      {/* Transport buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            setPosition("1.1.1");
            onRewind?.();
          }}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <motion.button
          onClick={() => {
            if (onPlayToggle) {
              onPlayToggle();
            } else {
              setInternalPlaying((prev) => !prev);
            }
          }}
          className={`p-2.5 rounded-lg transition-colors ${
            playing ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </motion.button>
        <button
          onClick={() => {
            setInternalPlaying(false);
            setPosition("1.1.1");
            onStop?.();
          }}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <Square className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Record & Loop */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`p-2 rounded-lg transition-colors ${
            isRecording ? "bg-destructive/20 text-destructive" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsLooping(!isLooping)}
          className={`p-2 rounded-lg transition-colors ${
            isLooping ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>

      {/* Position display */}
      <div className="font-mono text-sm text-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
        {position}
      </div>

      {/* BPM */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">BPM</span>
        <input
          type="number"
          value={bpm}
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-14 bg-muted/50 border border-border/50 rounded-lg px-2 py-1.5 text-sm font-mono text-foreground text-center focus:outline-none focus:ring-1 focus:ring-primary/50"
          min={40}
          max={300}
        />
      </div>

      {/* Time Signature */}
      <div className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 font-mono">
        {timeSignature}
      </div>
    </div>
  );
};

export default TransportControls;
