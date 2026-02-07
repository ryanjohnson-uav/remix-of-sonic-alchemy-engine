import { motion } from "framer-motion";
import { Waves } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between glass-panel px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Waves className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            SonicForge
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Create
          </a>
          <Link to="/studio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Studio
          </Link>
          <a href="#explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Explore
          </a>
        </div>

        <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors border border-primary/20">
          Sign in
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
