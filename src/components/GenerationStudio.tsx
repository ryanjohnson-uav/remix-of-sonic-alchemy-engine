import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Image, Mic } from "lucide-react";
import InputModeCard from "./InputModeCard";
import TextInput from "./TextInput";
import ImageInput from "./ImageInput";
import VoiceInput from "./VoiceInput";
import GenerationCard from "./GenerationCard";
import { toast } from "sonner";
import { generateMusic, revokeAudioUrl } from "@/services/musicGeneration";
import { AUDIO_SAMPLES } from "@/lib/audioSamples";
import { formatTime } from "@/lib/audioUtils";
import { loadLibraryItems, storeGeneratedTrack, type LibraryItem } from "@/services/audioLibrary";

type InputMode = "text" | "image" | "voice";

interface Generation {
  title: string;
  mode: string;
  duration: string;
  timestamp: string;
  audioUrl?: string;
}

const mockGenerations: Generation[] = [
  {
    title: "Lo-fi beats for a rainy evening",
    mode: "Text → Music",
    duration: "0:32",
    timestamp: "Just now",
    audioUrl: AUDIO_SAMPLES[0].url,
  },
  {
    title: "Sunset beach ambient mix",
    mode: "Image → Music",
    duration: "1:04",
    timestamp: "2 minutes ago",
    audioUrl: AUDIO_SAMPLES[1].url,
  },
  {
    title: "Hummed melody expansion",
    mode: "Voice → Music",
    duration: "0:48",
    timestamp: "5 minutes ago",
    audioUrl: AUDIO_SAMPLES[2].url,
  },
];

const GenerationStudio = () => {
  const [activeMode, setActiveMode] = useState<InputMode>("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<Generation[]>(mockGenerations);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(() => loadLibraryItems());

  useEffect(() => {
    setLibraryItems(loadLibraryItems());
  }, []);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    toast.info("Starting generation...", {
      description: prompt,
    });

    try {
      const result = await generateMusic(prompt, 30);
      
      const modeLabels: Record<InputMode, string> = {
        text: "Text → Music",
        image: "Image → Music",
        voice: "Voice → Music",
      };

      const { item, updated } = await storeGeneratedTrack({
        title: prompt.slice(0, 50),
        prompt,
        blob: result.audioBlob,
        durationSeconds: result.duration,
        source: "generated",
      });

      const newGeneration: Generation = {
        title: item.title,
        mode: modeLabels[activeMode],
        duration: formatTime(result.duration),
        timestamp: "Just now",
        audioUrl: item.url,
      };

      setGenerations((prev) => [newGeneration, ...prev]);
      setLibraryItems(updated);

      if (result.audioUrl.startsWith("blob:") && item.url !== result.audioUrl) {
        revokeAudioUrl(result.audioUrl);
      }

      if (item.isLocalFallback) {
        toast.warning("Library stored locally", {
          description: "Set up the Supabase storage bucket to persist files across devices.",
        });
      }
      
      toast.success("Track generated!", {
        description: "Your new audio is ready to play.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generation failed";
      toast.error("Generation failed", {
        description: message,
      });
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const modes = [
    {
      key: "text" as InputMode,
      icon: Type,
      title: "Text to Music",
      description: "Describe a mood, genre, or scene and get original music",
      accentClass: "glow-box",
    },
    {
      key: "image" as InputMode,
      icon: Image,
      title: "Image to Music",
      description: "Upload a photo and we'll translate its essence into sound",
      accentClass: "glow-box-warm",
    },
    {
      key: "voice" as InputMode,
      icon: Mic,
      title: "Voice to Music",
      description: "Record a hum, melody, or voice note to build from",
      accentClass: "glow-box",
    },
  ];

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Create
        </h2>
        <p className="text-muted-foreground text-lg">
          Choose your input, shape the output.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left: input modes + active input */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mode selector */}
          <div className="grid grid-cols-3 gap-3">
            {modes.map((mode) => (
              <InputModeCard
                key={mode.key}
                icon={mode.icon}
                title={mode.title}
                description={mode.description}
                isActive={activeMode === mode.key}
                onClick={() => setActiveMode(mode.key)}
                accentClass={mode.accentClass}
              />
            ))}
          </div>

          {/* Active input */}
          <div className="glass-panel p-6">
            <AnimatePresence mode="wait">
              {activeMode === "text" && (
                <TextInput
                  key="text"
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              )}
              {activeMode === "image" && (
                <ImageInput
                  key="image"
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              )}
              {activeMode === "voice" && (
                <VoiceInput
                  key="voice"
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: recent generations */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Generations
          </h3>
          {generations.map((gen, i) => (
            <GenerationCard key={`${gen.title}-${i}`} {...gen} index={i} />
          ))}

          <div className="pt-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Music Library
            </h3>
            {libraryItems.length === 0 ? (
              <div className="glass-panel p-4 text-xs text-muted-foreground mt-3">
                Generated tracks will appear here for reuse.
              </div>
            ) : (
              <div className="space-y-3 mt-3">
                {libraryItems.map((item, i) => (
                  <GenerationCard
                    key={item.id}
                    title={item.title}
                    mode={`Library · ${item.source}`}
                    duration={formatTime(item.durationSeconds)}
                    timestamp={new Date(item.createdAt).toLocaleString()}
                    audioUrl={item.url}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenerationStudio;
