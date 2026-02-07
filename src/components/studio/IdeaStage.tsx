import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Image, Mic, Upload, Sparkles, Music, Wand2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Project, MUSICAL_KEYS } from "@/types/studio";
import { toast } from "sonner";

type InputMode = "text" | "image" | "voice" | "upload";

interface IdeaStageProps {
  project: Project;
  onUpdateProject: (updates: Partial<Pick<Project, "name" | "bpm" | "key" | "timeSignature">>) => void;
  onAddTrack: (name: string, type: "generated" | "uploaded") => void;
  onNext: () => void;
}

const IdeaStage = ({ project, onUpdateProject, onAddTrack, onNext }: IdeaStageProps) => {
  const [activeMode, setActiveMode] = useState<InputMode>("text");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState([30]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const suggestions = [
    "Lo-fi beats for a rainy evening",
    "Epic orchestral trailer music",
    "Ambient forest soundscape",
    "Funky bass groove, 120 BPM",
    "Dark cinematic tension builder",
    "Dreamy synth-pop, 80s vibes",
  ];

  const modes = [
    { key: "text" as InputMode, icon: Type, label: "Text", desc: "Describe your sound" },
    { key: "image" as InputMode, icon: Image, label: "Image", desc: "Upload a visual" },
    { key: "voice" as InputMode, icon: Mic, label: "Voice", desc: "Hum or speak" },
    { key: "upload" as InputMode, icon: Upload, label: "Restyle", desc: "Transform audio" },
  ];

  const handleGenerate = () => {
    if (!prompt.trim() && activeMode !== "upload") return;
    setIsGenerating(true);
    toast.info("Generating audio...", { description: prompt || "Processing uploaded audio" });
    setTimeout(() => {
      setIsGenerating(false);
      const trackName = prompt.slice(0, 30) || uploadedFile?.name || "Generated Track";
      onAddTrack(trackName, activeMode === "upload" ? "uploaded" : "generated");
      toast.success("Track generated!", { description: "Added to your project." });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Project header */}
      <div className="flex items-center justify-between">
        <div>
          <input
            value={project.name}
            onChange={(e) => onUpdateProject({ name: e.target.value })}
            className="text-2xl font-bold bg-transparent text-foreground border-none outline-none focus:ring-0 w-full"
            placeholder="Project name..."
          />
          <p className="text-sm text-muted-foreground mt-1">
            {project.bpm} BPM · Key of {project.key} · {project.timeSignature}
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2.5 rounded-lg transition-colors ${
            showSettings ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-4 grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">BPM</label>
                <input
                  type="number"
                  value={project.bpm}
                  onChange={(e) => onUpdateProject({ bpm: Number(e.target.value) })}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  min={40}
                  max={300}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Key</label>
                <select
                  value={project.key}
                  onChange={(e) => onUpdateProject({ key: e.target.value })}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  {MUSICAL_KEYS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Time Sig</label>
                <select
                  value={project.timeSignature}
                  onChange={(e) => onUpdateProject({ timeSignature: e.target.value })}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  <option value="4/4">4/4</option>
                  <option value="3/4">3/4</option>
                  <option value="6/8">6/8</option>
                  <option value="7/8">7/8</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode selector */}
      <div className="grid grid-cols-4 gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.key;
          return (
            <motion.button
              key={mode.key}
              onClick={() => setActiveMode(mode.key)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                isActive
                  ? "glass-panel glow-box border-primary/30"
                  : "bg-card/40 border-border/50 hover:border-border hover:bg-card/60"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {mode.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Input area */}
      <div className="glass-panel p-5">
        <AnimatePresence mode="wait">
          {activeMode === "text" && (
            <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the sound you want to create..."
                  className="w-full h-28 bg-muted/50 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Music className="absolute top-4 right-4 w-5 h-5 text-muted-foreground/40" />
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
            </motion.div>
          )}

          {activeMode === "image" && (
            <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                <Image className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Drop an image or click to upload</p>
                <p className="text-xs text-muted-foreground/60 mt-1">We'll translate its visual essence into sound</p>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Optionally describe how the image should influence the sound..."
                className="w-full h-16 bg-muted/50 border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </motion.div>
          )}

          {activeMode === "voice" && (
            <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex flex-col items-center gap-4 py-6">
                <motion.button
                  className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic className="w-8 h-8 text-primary" />
                </motion.button>
                <p className="text-sm text-muted-foreground">Tap to record a hum, melody, or voice note</p>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how to develop this into a full track..."
                className="w-full h-16 bg-muted/50 border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </motion.div>
          )}

          {activeMode === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="border-2 border-dashed border-border/60 rounded-xl p-6 text-center hover:border-secondary/30 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Upload existing audio to restyle</p>
                <p className="text-xs text-muted-foreground/60 mt-1">MP3, WAV, FLAC — up to 20MB</p>
                {uploadedFile && (
                  <p className="text-sm text-primary mt-3 font-medium">{uploadedFile.name}</p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wand2 className="w-4 h-4 text-secondary" />
                <span>Describe the transformation you want:</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 'Make it more lo-fi with vinyl crackle' or 'Convert to epic orchestral version'"
                className="w-full h-20 bg-muted/50 border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Duration control */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground w-16">Duration</span>
        <Slider
          value={duration}
          onValueChange={setDuration}
          min={5}
          max={120}
          step={5}
          className="flex-1"
        />
        <span className="text-sm font-mono text-foreground w-12 text-right">{duration[0]}s</span>
      </div>

      {/* Generate + advance */}
      <div className="flex gap-3">
        <Button
          onClick={handleGenerate}
          disabled={(!prompt.trim() && activeMode !== "upload") || isGenerating}
          className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base rounded-xl glow-box transition-all disabled:opacity-40"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isGenerating ? "Generating..." : activeMode === "upload" ? "Restyle Audio" : "Generate Track"}
        </Button>
        {project.tracks.length > 0 && (
          <Button
            onClick={onNext}
            variant="outline"
            className="h-12 px-6 rounded-xl border-border/50"
          >
            Arrange →
          </Button>
        )}
      </div>
    </div>
  );
};

export default IdeaStage;
