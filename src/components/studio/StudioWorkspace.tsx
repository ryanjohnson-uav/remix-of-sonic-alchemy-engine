import { motion, AnimatePresence } from "framer-motion";
import { Waves, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useStudioProject } from "@/hooks/useStudioProject";
import { useTrackAudioEngine } from "@/hooks/useTrackAudioEngine";
import PipelineNav from "./PipelineNav";
import TransportControls from "./TransportControls";
import IdeaStage from "./IdeaStage";
import ArrangementStage from "./ArrangementStage";
import MixerStage from "./MixerStage";
import MasteringStage from "./MasteringStage";

const StudioWorkspace = () => {
  const {
    project,
    setStage,
    updateProjectMeta,
    addTrack,
    removeTrack,
    updateTrack,
    toggleMute,
    toggleSolo,
  } = useStudioProject();
  const audioEngine = useTrackAudioEngine(project.tracks);

  return (
    <div className="min-h-screen bg-background gradient-mesh flex flex-col">
      {/* Studio header */}
      <header className="border-b border-border/30 bg-card/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: logo + back */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <Waves className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-bold text-foreground tracking-tight">SonicForge</span>
            </div>
            <div className="w-px h-5 bg-border/40 mx-1" />
            <PipelineNav currentStage={project.stage} onStageChange={setStage} />
          </div>

          {/* Right: transport */}
          <div className="hidden md:block">
            <TransportControls
              bpm={project.bpm}
              timeSignature={project.timeSignature}
              onBpmChange={(bpm) => updateProjectMeta({ bpm })}
              isPlaying={audioEngine.isAnyPlaying}
              onPlayToggle={() =>
                audioEngine.isAnyPlaying ? audioEngine.pauseAll() : audioEngine.playAll()
              }
              onStop={() => audioEngine.stopAll()}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {project.stage === "idea" && (
            <motion.div key="idea" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <IdeaStage
                project={project}
                onUpdateProject={updateProjectMeta}
                onAddTrack={addTrack}
                onNext={() => setStage("arrange")}
              />
            </motion.div>
          )}
          {project.stage === "arrange" && (
            <motion.div key="arrange" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <ArrangementStage
                project={project}
                onAddTrack={addTrack}
                onToggleMute={toggleMute}
                onToggleSolo={toggleSolo}
                onTogglePlay={audioEngine.toggleTrack}
                isTrackPlaying={audioEngine.isTrackPlaying}
              />
            </motion.div>
          )}
          {project.stage === "mix" && (
            <motion.div key="mix" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <MixerStage
                project={project}
                onUpdateTrack={updateTrack}
                onToggleMute={toggleMute}
                onToggleSolo={toggleSolo}
                onTogglePlay={audioEngine.toggleTrack}
                isTrackPlaying={audioEngine.isTrackPlaying}
                trackDurations={audioEngine.durations}
                masterVolume={audioEngine.masterVolume}
                onMasterVolumeChange={audioEngine.setMasterVolume}
              />
            </motion.div>
          )}
          {project.stage === "master" && (
            <motion.div key="master" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <MasteringStage project={project} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StudioWorkspace;
