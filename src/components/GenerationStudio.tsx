import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Image, Mic } from "lucide-react";
import InputModeCard from "./InputModeCard";
import TextInput from "./TextInput";
import ImageInput from "./ImageInput";
import VoiceInput from "./VoiceInput";
import GenerationCard from "./GenerationCard";
import { toast } from "sonner";

type InputMode = "text" | "image" | "voice";

const mockGenerations = [
  {
    title: "Lo-fi beats for a rainy evening",
    mode: "Text → Music",
    duration: "0:32",
    timestamp: "Just now",
  },
  {
    title: "Sunset beach ambient mix",
    mode: "Image → Music",
    duration: "1:04",
    timestamp: "2 minutes ago",
  },
  {
    title: "Hummed melody expansion",
    mode: "Voice → Music",
    duration: "0:48",
    timestamp: "5 minutes ago",
  },
];

const GenerationStudio = () => {
  const [activeMode, setActiveMode] = useState<InputMode>("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState(mockGenerations);

  const handleGenerate = (prompt: string) => {
    setIsGenerating(true);
    toast.info("Starting generation...", {
      description: prompt,
    });

    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      const modeLabels: Record<InputMode, string> = {
        text: "Text → Music",
        image: "Image → Music",
        voice: "Voice → Music",
      };
      setGenerations((prev) => [
        {
          title: prompt.slice(0, 50),
          mode: modeLabels[activeMode],
          duration: `0:${Math.floor(20 + Math.random() * 40)}`,
          timestamp: "Just now",
        },
        ...prev,
      ]);
      toast.success("Track generated!", {
        description: "Your new audio is ready to play.",
      });
    }, 3000);
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
        </div>
      </div>
    </section>
  );
};

export default GenerationStudio;
