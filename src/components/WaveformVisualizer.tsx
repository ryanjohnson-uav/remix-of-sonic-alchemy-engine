import { motion } from "framer-motion";

const WaveformVisualizer = ({ isPlaying = false, barCount = 40 }: { isPlaying?: boolean; barCount?: number }) => {
  return (
    <div className="flex items-center justify-center gap-[2px] h-16">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-primary/60 to-primary"
          initial={{ height: "20%" }}
          animate={
            isPlaying
              ? {
                  height: ["20%", `${30 + Math.random() * 60}%`, "20%"],
                }
              : { height: "20%" }
          }
          transition={{
            duration: 0.6 + Math.random() * 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.03,
          }}
        />
      ))}
    </div>
  );
};

export default WaveformVisualizer;
