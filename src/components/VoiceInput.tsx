import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const VoiceInput = ({ onGenerate, isGenerating }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setDuration(0);
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center justify-center py-8">
        {/* Pulsing mic button */}
        <div className="relative">
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full bg-destructive/20"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-destructive/20 border-2 border-destructive"
                : "bg-muted border-2 border-border hover:border-primary/50"
            }`}
          >
            {isRecording ? (
              <Square className="w-7 h-7 text-destructive" />
            ) : (
              <Mic className="w-8 h-8 text-muted-foreground" />
            )}
          </button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {isRecording
            ? `Recording... ${formatTime(duration)}`
            : hasRecording
            ? `Recording captured — ${formatTime(duration)}`
            : "Tap to record a voice note, hum, or melody"}
        </p>
      </div>

      <input
        placeholder="Describe what to do with this audio (optional)..."
        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
      />

      <Button
        onClick={() => onGenerate("Voice-to-music generation")}
        disabled={!hasRecording || isGenerating}
        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base rounded-xl glow-box transition-all disabled:opacity-40"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {isGenerating ? "Processing voice..." : "Generate from Voice"}
      </Button>
    </motion.div>
  );
};

export default VoiceInput;
