import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const TextInput = ({ onGenerate, isGenerating }: TextInputProps) => {
  const [prompt, setPrompt] = useState("");

  const suggestions = [
    "Lo-fi beats for a rainy evening",
    "Epic orchestral trailer music",
    "Ambient soundscape of a forest at dawn",
    "Funky bass-driven groove, 120 BPM",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the music you want to create..."
          className="w-full h-32 bg-muted/50 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-sans"
        />
        <Music className="absolute top-4 right-4 w-5 h-5 text-muted-foreground/50" />
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setPrompt(s)}
            className="px-3 py-1.5 text-xs rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border/50"
          >
            {s}
          </button>
        ))}
      </div>

      <Button
        onClick={() => onGenerate(prompt)}
        disabled={!prompt.trim() || isGenerating}
        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base rounded-xl glow-box transition-all disabled:opacity-40"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {isGenerating ? "Generating..." : "Generate Music"}
      </Button>
    </motion.div>
  );
};

export default TextInput;
