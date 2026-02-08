import { motion, PanInfo, useDragControls } from "framer-motion";
import { useState, useRef } from "react";
import { Clip } from "@/types/studio";
import { GripVertical } from "lucide-react";

interface DraggableClipProps {
  clip: Clip;
  beatWidth: number;
  trackHeight: number;
  onMove: (clipId: string, newStart: number) => void;
  onResize: (clipId: string, newDuration: number) => void;
  onSelect: (clipId: string) => void;
  isSelected: boolean;
}

const DraggableClip = ({
  clip,
  beatWidth,
  trackHeight,
  onMove,
  onResize,
  onSelect,
  isSelected,
}: DraggableClipProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragControls = useDragControls();
  const clipRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const beatsMoved = Math.round(info.offset.x / beatWidth);
    const newStart = Math.max(0, clip.start + beatsMoved);
    onMove(clip.id, newStart);
    setIsDragging(false);
  };

  const handleResizeEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const beatsChanged = Math.round(info.offset.x / beatWidth);
    const newDuration = Math.max(1, clip.duration + beatsChanged);
    onResize(clip.id, newDuration);
    setIsResizing(false);
  };

  return (
    <motion.div
      ref={clipRef}
      className={`absolute top-1 cursor-grab active:cursor-grabbing overflow-hidden group ${
        isSelected ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""
      }`}
      style={{
        left: clip.start * beatWidth,
        width: clip.duration * beatWidth,
        height: trackHeight - 8,
        backgroundColor: `${clip.color}20`,
        borderLeft: `3px solid ${clip.color}`,
        borderRadius: "0.375rem",
      }}
      drag="x"
      dragConstraints={{ left: -clip.start * beatWidth, right: 1000 }}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(clip.id)}
      whileHover={{ scale: isResizing ? 1 : 1.01, y: isResizing ? 0 : -1 }}
      animate={{
        boxShadow: isDragging 
          ? "0 8px 20px rgba(0,0,0,0.3)" 
          : isSelected 
          ? "0 4px 12px rgba(0,0,0,0.15)" 
          : "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Drag handle */}
      <div className="absolute left-0 top-0 bottom-0 w-4 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity cursor-grab">
        <GripVertical className="w-3 h-3 text-foreground/60" />
      </div>

      {/* Clip content */}
      <div className="px-2 py-1 pl-4">
        <span className="text-[10px] font-medium text-foreground/80 truncate block">
          {clip.label}
        </span>
      </div>

      {/* Mini waveform */}
      <div className="flex items-end gap-[1px] px-1 h-4">
        {Array.from({ length: Math.min(clip.duration * 4, 60) }).map((_, j) => (
          <div
            key={j}
            className="flex-1 rounded-sm"
            style={{
              backgroundColor: clip.color,
              opacity: 0.4,
              height: `${20 + Math.sin(j * 0.7) * 30 + Math.random() * 50}%`,
            }}
          />
        ))}
      </div>

      {/* Resize handle (right edge) */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-transparent hover:bg-white/20 transition-colors"
        drag="x"
        dragConstraints={{ left: 0, right: 500 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={(e) => {
          e.stopPropagation();
          setIsResizing(true);
        }}
        onDragEnd={handleResizeEnd}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

export default DraggableClip;
