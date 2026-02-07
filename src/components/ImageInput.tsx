import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const ImageInput = ({ onGenerate, isGenerating }: ImageInputProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [mood, setMood] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {!image ? (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full h-48 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/40 flex flex-col items-center justify-center gap-3 transition-colors bg-muted/20"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <ImagePlus className="w-7 h-7 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Upload an image</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WebP — we'll translate it to sound</p>
          </div>
        </button>
      ) : (
        <div className="relative rounded-xl overflow-hidden">
          <img src={image} alt="Uploaded" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <button
            onClick={() => setImage(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>
      )}

      <input
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Add a mood or style hint (optional)..."
        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
      />

      <Button
        onClick={() => onGenerate(`Image-to-music: ${mood || "auto-detect mood"}`)}
        disabled={!image || isGenerating}
        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base rounded-xl glow-box transition-all disabled:opacity-40"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {isGenerating ? "Translating image..." : "Generate from Image"}
      </Button>
    </motion.div>
  );
};

export default ImageInput;
