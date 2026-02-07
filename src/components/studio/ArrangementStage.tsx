import { motion } from "framer-motion";
import { Plus, ZoomIn, ZoomOut, Scissors, Copy, Trash2 } from "lucide-react";
import { Project } from "@/types/studio";
import TrackTimeline from "./TrackTimeline";

interface ArrangementStageProps {
  project: Project;
  onAddTrack: (name: string, type: "generated" | "uploaded") => void;
  onToggleMute: (trackId: string) => void;
  onToggleSolo: (trackId: string) => void;
}

const ArrangementStage = ({ project, onAddTrack, onToggleMute, onToggleSolo }: ArrangementStageProps) => {
  const totalBeats = 36;
  const beatWidth = 32;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-border/50 mx-1" />
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
            <Scissors className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <motion.button
          onClick={() => onAddTrack(`Track ${project.tracks.length + 1}`, "generated")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors border border-primary/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Add Track
        </motion.button>
      </div>

      {/* Timeline */}
      <div className="glass-panel overflow-hidden">
        {/* Time ruler */}
        <div className="flex border-b border-border/30">
          <div className="w-48 flex-shrink-0 p-2 border-r border-border/30 bg-card/30">
            <span className="text-xs text-muted-foreground font-medium">Tracks</span>
          </div>
          <div className="flex-1 overflow-x-auto">
            <div className="flex" style={{ minWidth: totalBeats * beatWidth }}>
              {Array.from({ length: Math.ceil(totalBeats / 4) }).map((_, i) => (
                <div
                  key={i}
                  className="text-center border-l border-border/30"
                  style={{ width: 4 * beatWidth }}
                >
                  <span className="text-[10px] text-muted-foreground/60 font-mono">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tracks */}
        <div className="overflow-x-auto">
          {project.tracks.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-sm">No tracks yet. Generate some audio in the Idea stage!</p>
            </div>
          ) : (
            project.tracks.map((track) => (
              <TrackTimeline
                key={track.id}
                track={track}
                totalBeats={totalBeats}
                onToggleMute={() => onToggleMute(track.id)}
                onToggleSolo={() => onToggleSolo(track.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArrangementStage;
