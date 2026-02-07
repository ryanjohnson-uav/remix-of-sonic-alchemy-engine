import { motion } from "framer-motion";
import { Lightbulb, LayoutList, Sliders, Download, ChevronRight } from "lucide-react";
import { PipelineStage } from "@/types/studio";

interface PipelineNavProps {
  currentStage: PipelineStage;
  onStageChange: (stage: PipelineStage) => void;
}

const stages: { key: PipelineStage; label: string; icon: typeof Lightbulb }[] = [
  { key: "idea", label: "Idea", icon: Lightbulb },
  { key: "arrange", label: "Arrange", icon: LayoutList },
  { key: "mix", label: "Mix", icon: Sliders },
  { key: "master", label: "Export", icon: Download },
];

const PipelineNav = ({ currentStage, onStageChange }: PipelineNavProps) => {
  const currentIndex = stages.findIndex((s) => s.key === currentStage);

  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, i) => {
        const isActive = stage.key === currentStage;
        const isPast = i < currentIndex;
        const Icon = stage.icon;

        return (
          <div key={stage.key} className="flex items-center">
            <motion.button
              onClick={() => onStageChange(stage.key)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : isPast
                  ? "bg-muted/60 text-foreground border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{stage.label}</span>
              {isActive && (
                <motion.div
                  layoutId="stage-indicator"
                  className="absolute inset-0 rounded-lg border border-primary/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
            {i < stages.length - 1 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 mx-0.5 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PipelineNav;
