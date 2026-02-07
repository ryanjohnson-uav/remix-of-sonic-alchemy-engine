import { Waves } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 px-6 py-12 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Waves className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">SonicForge</span>
        </div>

        <p className="text-xs text-muted-foreground">
          Multimodal audio generation — turn anything into sound.
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Docs</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
