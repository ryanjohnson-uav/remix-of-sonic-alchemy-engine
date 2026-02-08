import { motion } from "framer-motion";
import { Plus, ZoomIn, ZoomOut, Scissors, Copy, Trash2, Clipboard } from "lucide-react";
import { Project, Track } from "@/types/studio";
import { useArrangement } from "@/hooks/useArrangement";
import TrackTimeline from "./TrackTimeline";
import { toast } from "sonner";

interface ArrangementStageProps {
  project: Project;
  onAddTrack: (name: string, type: "generated" | "uploaded") => void;
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void;
  onToggleMute: (trackId: string) => void;
  onToggleSolo: (trackId: string) => void;
  onTogglePlay: (trackId: string) => void;
  isTrackPlaying: (trackId: string) => boolean;
}

const ArrangementStage = ({
  project,
  onAddTrack,
  onUpdateTrack,
  onToggleMute,
  onToggleSolo,
  onTogglePlay,
  isTrackPlaying,
}: ArrangementStageProps) => {
  const totalBeats = 36;
  const baseBeatWidth = 32;

  const arrangement = useArrangement(project.tracks, onUpdateTrack);
  const beatWidth = baseBeatWidth * arrangement.zoomLevel;

  const handleSplit = () => {
    if (!arrangement.selectedClipId || !arrangement.selectedTrackId) {
      toast.error("Select a clip first to split");
      return;
    }
    const track = project.tracks.find((t) => t.id === arrangement.selectedTrackId);
    const clip = track?.clips.find((c) => c.id === arrangement.selectedClipId);
    if (clip && clip.duration > 1) {
      arrangement.splitClip(clip.start + Math.floor(clip.duration / 2));
      toast.success("Clip split");
    } else {
      toast.error("Clip too short to split");
    }
  };

  const handleCopy = () => {
    if (!arrangement.selectedClipId) {
      toast.error("Select a clip first to copy");
      return;
    }
    arrangement.copyClip();
    toast.success("Clip copied");
  };

  const handlePaste = () => {
    if (!arrangement.clipboard) {
      toast.error("Nothing to paste");
      return;
    }
    if (!arrangement.selectedTrackId) {
      toast.error("Select a track first");
      return;
    }
    arrangement.pasteClip();
    toast.success("Clip pasted");
  };

  const handleDelete = () => {
    if (!arrangement.selectedClipId) {
      toast.error("Select a clip first to delete");
      return;
    }
    arrangement.deleteClip();
    toast.success("Clip deleted");
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={arrangement.zoomOut}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground w-12 text-center">
            {Math.round(arrangement.zoomLevel * 100)}%
          </span>
          <button
            onClick={arrangement.zoomIn}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-border/50 mx-1" />
          <button
            onClick={handleSplit}
            className={`p-2 rounded-lg transition-colors ${
              arrangement.selectedClipId
                ? "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                : "text-muted-foreground/40 cursor-not-allowed"
            }`}
            title="Split Clip"
            disabled={!arrangement.selectedClipId}
          >
            <Scissors className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-colors ${
              arrangement.selectedClipId
                ? "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                : "text-muted-foreground/40 cursor-not-allowed"
            }`}
            title="Copy Clip"
            disabled={!arrangement.selectedClipId}
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handlePaste}
            className={`p-2 rounded-lg transition-colors ${
              arrangement.clipboard
                ? "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                : "text-muted-foreground/40 cursor-not-allowed"
            }`}
            title="Paste Clip"
            disabled={!arrangement.clipboard}
          >
            <Clipboard className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className={`p-2 rounded-lg transition-colors ${
              arrangement.selectedClipId
                ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                : "text-muted-foreground/40 cursor-not-allowed"
            }`}
            title="Delete Clip"
            disabled={!arrangement.selectedClipId}
          >
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
        <div className="overflow-x-auto" onClick={() => arrangement.clearSelection()}>
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
                beatWidth={beatWidth}
                onToggleMute={() => onToggleMute(track.id)}
                onToggleSolo={() => onToggleSolo(track.id)}
                onTogglePlay={() => onTogglePlay(track.id)}
                isPlaying={isTrackPlaying(track.id)}
                onMoveClip={(clipId, newStart) => arrangement.moveClip(track.id, clipId, newStart)}
                onResizeClip={(clipId, newDuration) => arrangement.resizeClip(track.id, clipId, newDuration)}
                onSelectClip={(clipId) => {
                  arrangement.selectClip(clipId, track.id);
                }}
                selectedClipId={arrangement.selectedClipId}
              />
            ))
          )}
        </div>
      </div>

      {/* Selection info */}
      {arrangement.selectedClipId && (
        <div className="text-xs text-muted-foreground">
          Selected: {project.tracks
            .flatMap((t) => t.clips)
            .find((c) => c.id === arrangement.selectedClipId)?.label || "Unknown"}
          <span className="ml-2 text-primary">(Drag to move, edge to resize)</span>
        </div>
      )}
    </div>
  );
};

export default ArrangementStage;
