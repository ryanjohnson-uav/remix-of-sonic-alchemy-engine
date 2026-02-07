import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Track } from "@/types/studio";
import { Slider } from "@/components/ui/slider";

interface ChannelStripProps {
  track: Track;
  onVolumeChange: (volume: number) => void;
  onPanChange: (pan: number) => void;
  onToggleMute: () => void;
  onToggleSolo: () => void;
}

const ChannelStrip = ({ track, onVolumeChange, onPanChange, onToggleMute, onToggleSolo }: ChannelStripProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-3 flex flex-col items-center gap-3 min-w-[80px]"
    >
      {/* Track color indicator */}
      <div className="w-full h-1 rounded-full" style={{ backgroundColor: track.color }} />

      {/* Track name */}
      <span className="text-[10px] font-medium text-foreground truncate w-full text-center">
        {track.name}
      </span>

      {/* Meter visualization */}
      <div className="flex gap-0.5 h-32 items-end">
        {[0, 1].map((ch) => (
          <div key={ch} className="w-2 h-full bg-muted/30 rounded-sm overflow-hidden flex flex-col-reverse">
            <motion.div
              className="w-full rounded-sm"
              style={{
                background: `linear-gradient(to top, hsl(145, 65%, 42%), hsl(45, 90%, 55%), hsl(350, 80%, 55%))`,
              }}
              animate={{
                height: track.muted ? "0%" : `${track.volume * 0.6 + Math.random() * 20}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      {/* Volume fader */}
      <div className="h-28 flex flex-col items-center">
        <Slider
          orientation="vertical"
          value={[track.volume]}
          onValueChange={([v]) => onVolumeChange(v)}
          min={0}
          max={100}
          className="h-full"
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">{track.volume}</span>

      {/* Pan knob */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] text-muted-foreground">PAN</span>
        <div className="relative w-8 h-8 rounded-full bg-muted/40 border border-border/50">
          <div
            className="absolute w-1 h-3 bg-primary rounded-full top-1 left-1/2 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${(track.pan / 50) * 135}deg)`,
              transformOrigin: "50% 100%",
              top: "4px",
              left: "50%",
            }}
          />
        </div>
        <input
          type="range"
          value={track.pan}
          onChange={(e) => onPanChange(Number(e.target.value))}
          min={-50}
          max={50}
          className="w-14 h-1 appearance-none bg-muted rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
        />
        <span className="text-[9px] font-mono text-muted-foreground">
          {track.pan === 0 ? "C" : track.pan < 0 ? `L${Math.abs(track.pan)}` : `R${track.pan}`}
        </span>
      </div>

      {/* Mute / Solo */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleMute}
          className={`p-1.5 rounded transition-colors ${
            track.muted
              ? "bg-destructive/20 text-destructive"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          {track.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={onToggleSolo}
          className={`px-1.5 py-1 rounded text-[10px] font-bold transition-colors ${
            track.solo
              ? "bg-secondary/20 text-secondary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          S
        </button>
      </div>
    </motion.div>
  );
};

export default ChannelStrip;
