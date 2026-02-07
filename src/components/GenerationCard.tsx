import { motion } from "framer-motion";
import { Play, Pause, Download, Clock, Waves } from "lucide-react";
import { useState } from "react";
import WaveformVisualizer from "./WaveformVisualizer";

interface GenerationCardProps {
  title: string;
  mode: string;
  duration: string;
  timestamp: string;
  index: number;
}

const GenerationCard = ({ title, mode, duration, timestamp, index }: GenerationCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel p-5 group hover:border-primary/20 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Play button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-primary" />
          ) : (
            <Play className="w-5 h-5 text-primary ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground truncate">{title}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Waves className="w-3 h-3" />
              {mode}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {duration}
            </span>
          </div>

          {/* Mini waveform */}
          <div className="mt-3 h-8">
            <WaveformVisualizer isPlaying={isPlaying} barCount={30} />
          </div>
        </div>

        <button className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted">
          <Download className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground/60 mt-3">{timestamp}</p>
    </motion.div>
  );
};

export default GenerationCard;
