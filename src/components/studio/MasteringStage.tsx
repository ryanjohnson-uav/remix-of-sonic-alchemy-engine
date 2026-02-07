import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Settings, Disc, Headphones, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Project } from "@/types/studio";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import { toast } from "sonner";

interface MasteringStagePops {
  project: Project;
}

const MasteringStage = ({ project }: MasteringStagePops) => {
  const [format, setFormat] = useState<"wav" | "mp3" | "flac">("wav");
  const [quality, setQuality] = useState<"high" | "standard" | "draft">("high");
  const [loudness, setLoudness] = useState([75]);
  const [stereoWidth, setStereoWidth] = useState([60]);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    toast.info("Exporting your track...", {
      description: `${format.toUpperCase()} · ${quality} quality`,
    });
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Export complete!", {
        description: `${project.name}.${format} is ready to download.`,
      });
    }, 3000);
  };

  const formats = [
    { key: "wav" as const, label: "WAV", desc: "Lossless · Studio quality" },
    { key: "mp3" as const, label: "MP3", desc: "Compressed · Universal" },
    { key: "flac" as const, label: "FLAC", desc: "Lossless · Compact" },
  ];

  const qualities = [
    { key: "high" as const, label: "High", desc: "48kHz · 24-bit" },
    { key: "standard" as const, label: "Standard", desc: "44.1kHz · 16-bit" },
    { key: "draft" as const, label: "Draft", desc: "22kHz · Fast preview" },
  ];

  return (
    <div className="space-y-6">
      {/* Waveform preview */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <Disc className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: "3s" }} />
          <div>
            <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
            <p className="text-xs text-muted-foreground">
              {project.tracks.length} tracks · {project.bpm} BPM · {project.key}
            </p>
          </div>
        </div>
        <WaveformVisualizer isPlaying barCount={60} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mastering controls */}
        <div className="glass-panel p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Mastering</h4>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-muted-foreground">Loudness (LUFS)</span>
                <span className="text-xs font-mono text-foreground">-{100 - loudness[0]} LUFS</span>
              </div>
              <Slider value={loudness} onValueChange={setLoudness} min={0} max={100} />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-muted-foreground">Stereo Width</span>
                <span className="text-xs font-mono text-foreground">{stereoWidth[0]}%</span>
              </div>
              <Slider value={stereoWidth} onValueChange={setStereoWidth} min={0} max={100} />
            </div>

            {/* Quick master presets */}
            <div>
              <span className="text-xs text-muted-foreground block mb-2">Quick Presets</span>
              <div className="grid grid-cols-3 gap-2">
                {["Streaming", "Club", "Podcast"].map((preset) => (
                  <button
                    key={preset}
                    className="px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-primary/20 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analyzer preview */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
            <BarChart3 className="w-4 h-4 text-primary" />
            <div className="flex-1">
              <div className="flex gap-1 h-8 items-end">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm bg-primary/60"
                    animate={{
                      height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 50}%`,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-primary">-14 LUFS</p>
              <p className="text-[10px] font-mono text-muted-foreground">-1.2 dBTP</p>
            </div>
          </div>
        </div>

        {/* Export settings */}
        <div className="glass-panel p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Export</h4>
          </div>

          {/* Format */}
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Format</span>
            <div className="space-y-2">
              {formats.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFormat(f.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    format === f.key
                      ? "border-primary/30 bg-primary/5"
                      : "border-border/50 bg-muted/20 hover:border-border"
                  }`}
                >
                  <span className={`text-sm font-medium ${format === f.key ? "text-primary" : "text-foreground"}`}>
                    {f.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Quality</span>
            <div className="grid grid-cols-3 gap-2">
              {qualities.map((q) => (
                <button
                  key={q.key}
                  onClick={() => setQuality(q.key)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    quality === q.key
                      ? "border-primary/30 bg-primary/5"
                      : "border-border/50 bg-muted/20 hover:border-border"
                  }`}
                >
                  <span className={`text-xs font-medium block ${quality === q.key ? "text-primary" : "text-foreground"}`}>
                    {q.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{q.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export actions */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl glow-box"
            >
              <Download className="w-5 h-5 mr-2" />
              {isExporting ? "Exporting..." : `Export as ${format.toUpperCase()}`}
            </Button>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors">
                <Headphones className="w-3.5 h-3.5" />
                Preview
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors">
                <Zap className="w-3.5 h-3.5" />
                Stems
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasteringStage;
