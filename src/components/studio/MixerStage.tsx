import { motion } from "framer-motion";
import { Project, Track } from "@/types/studio";
import ChannelStrip from "./ChannelStrip";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import TrackInspector from "./TrackInspector";

interface MixerStageProps {
  project: Project;
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void;
  onToggleMute: (trackId: string) => void;
  onToggleSolo: (trackId: string) => void;
  onTogglePlay: (trackId: string) => void;
  isTrackPlaying: (trackId: string) => boolean;
  trackDurations: Record<string, number>;
  masterVolume: number;
  onMasterVolumeChange: (volume: number) => void;
}

const MixerStage = ({
  project,
  onUpdateTrack,
  onToggleMute,
  onToggleSolo,
  onTogglePlay,
  isTrackPlaying,
  trackDurations,
  masterVolume,
  onMasterVolumeChange,
}: MixerStageProps) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedTrackId && project.tracks.length > 0) {
      setSelectedTrackId(project.tracks[0].id);
    }
    if (selectedTrackId && !project.tracks.find((track) => track.id === selectedTrackId)) {
      setSelectedTrackId(project.tracks[0]?.id ?? null);
    }
  }, [project.tracks, selectedTrackId]);

  const selectedTrack = project.tracks.find((track) => track.id === selectedTrackId);

  return (
    <div className="space-y-6">
      {/* Effect rack hint */}
      <div className="glass-panel p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Effect Rack</h4>
        <div className="grid grid-cols-4 gap-2">
          {["EQ", "Reverb", "Compressor", "Delay"].map((fx) => (
            <button
              key={fx}
              className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-primary/20 transition-colors text-center"
            >
              {fx}
            </button>
          ))}
        </div>
      </div>

      {/* Channel strips */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-2 min-w-min">
          {project.tracks.length === 0 ? (
            <div className="flex-1 py-16 text-center text-muted-foreground">
              <p className="text-sm">No tracks to mix. Add some in the Idea stage!</p>
            </div>
          ) : (
            <>
              {project.tracks.map((track) => (
                <ChannelStrip
                  key={track.id}
                  track={track}
                  onVolumeChange={(v) => onUpdateTrack(track.id, { volume: v })}
                  onPanChange={(p) => onUpdateTrack(track.id, { pan: p })}
                  onToggleMute={() => onToggleMute(track.id)}
                  onToggleSolo={() => onToggleSolo(track.id)}
                  onTogglePlay={() => onTogglePlay(track.id)}
                  isPlaying={isTrackPlaying(track.id)}
                  onSelect={() => setSelectedTrackId(track.id)}
                  isSelected={track.id === selectedTrackId}
                />
              ))}

              {/* Master channel */}
              <div className="w-px bg-border/30 mx-2 self-stretch" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-3 flex flex-col items-center gap-3 min-w-[80px] border-primary/20"
              >
                <div className="w-full h-1 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-primary">MASTER</span>

                <div className="flex gap-0.5 h-32 items-end">
                  {[0, 1].map((ch) => (
                    <div key={ch} className="w-3 h-full bg-muted/30 rounded-sm overflow-hidden flex flex-col-reverse">
                      <motion.div
                        className="w-full rounded-sm"
                        style={{
                          background: `linear-gradient(to top, hsl(187, 94%, 43%), hsl(187, 94%, 43%), hsl(45, 90%, 55%))`,
                        }}
                        animate={{
                          height: `${masterVolume * 0.7 + Math.random() * 15}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  ))}
                </div>

                <div className="h-28 flex flex-col items-center">
                  <Slider
                    orientation="vertical"
                    value={[masterVolume]}
                    onValueChange={([v]) => onMasterVolumeChange(v)}
                    min={0}
                    max={100}
                    className="h-full"
                  />
                </div>
                <span className="text-[10px] font-mono text-primary">{masterVolume}</span>

                <Volume2 className="w-4 h-4 text-primary" />
              </motion.div>
            </>
          )}
        </div>
      </div>

      {selectedTrack && (
        <TrackInspector
          track={selectedTrack}
          durationSeconds={trackDurations[selectedTrack.id]}
          isPlaying={isTrackPlaying(selectedTrack.id)}
          onTogglePlay={() => onTogglePlay(selectedTrack.id)}
          onUpdateTrack={(updates) => onUpdateTrack(selectedTrack.id, updates)}
        />
      )}
    </div>
  );
};

export default MixerStage;
