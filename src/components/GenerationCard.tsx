import { motion } from "framer-motion";
import { Play, Pause, Download, Clock, Waves, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WaveformVisualizer from "./WaveformVisualizer";
import { formatTime } from "@/lib/audioUtils";
import { Progress } from "@/components/ui/progress";

interface GenerationCardProps {
  title: string;
  mode: string;
  duration: string;
  timestamp: string;
  index: number;
  audioUrl?: string;
}

const GenerationCard = ({ title, mode, duration, timestamp, index, audioUrl }: GenerationCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setHasError(false);
    setIsReady(false);
    setCurrentTime(0);
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const handleLoaded = () => {
      setIsReady(true);
      setDurationSeconds(audio.duration);
    };
    const handleTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setHasError(true);

    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audioUrl]);

  const togglePlayback = async () => {
    if (!audioRef.current || !audioUrl || hasError) return;
    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
        setHasError(true);
      }
      return;
    }
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !durationSeconds || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * durationSeconds;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const progressPercent = durationSeconds ? (currentTime / durationSeconds) * 100 : 0;
  const displayDuration =
    durationSeconds && durationSeconds >= 1 ? formatTime(durationSeconds) : duration;

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
          onClick={togglePlayback}
          disabled={!audioUrl || hasError}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
              {displayDuration}
            </span>
          </div>

          {/* Mini waveform */}
          <div className="mt-3 h-8">
            <WaveformVisualizer isPlaying={isPlaying} barCount={30} />
          </div>

          {/* Interactive progress bar */}
          {audioUrl && (
            <div className="mt-3 space-y-2">
              <div
                ref={progressRef}
                onClick={handleSeek}
                className="cursor-pointer group/progress"
              >
                <Progress
                  value={progressPercent}
                  className="h-1.5 bg-muted/40 group-hover/progress:h-2 transition-all"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground/70">
                <span className="font-mono">{formatTime(currentTime)}</span>
                <div className="flex items-center gap-2">
                  {!isReady && !hasError && <span>Loading…</span>}
                  {hasError && <span className="text-destructive">Playback unavailable</span>}
                  <span className="font-mono">{displayDuration}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {/* Restart button */}
          {audioUrl && (
            <button
              onClick={handleRestart}
              disabled={!isReady || hasError}
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted disabled:opacity-40"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          {/* Download button */}
          {audioUrl ? (
            <a
              href={audioUrl}
              download={`${title}.mp3`}
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
            >
              <Download className="w-4 h-4 text-muted-foreground" />
            </a>
          ) : (
            <button
              className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted disabled:opacity-40"
              disabled
            >
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground/60 mt-3">{timestamp}</p>
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />}
    </motion.div>
  );
};

export default GenerationCard;
