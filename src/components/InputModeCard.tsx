import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface InputModeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  accentClass?: string;
}

const InputModeCard = ({ icon: Icon, title, description, isActive, onClick, accentClass = "glow-box" }: InputModeCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-full text-left p-6 rounded-xl border transition-all duration-300 ${
        isActive
          ? `glass-panel ${accentClass} border-primary/30`
          : "bg-card/40 border-border/50 hover:border-border hover:bg-card/60"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
        isActive ? "bg-primary/20" : "bg-muted"
      }`}>
        <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <h3 className="text-lg font-semibold mb-1 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.button>
  );
};

export default InputModeCard;
