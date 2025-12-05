
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="rounded-full backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border border-gray-200/50 dark:border-gray-700/50 shadow-lg px-6 py-3 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Proflo" className="h-8 w-8" />
          <span className="font-bold text-xl bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
            Spikelance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/features">
            <Button variant="ghost" className="rounded-full">Features</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="ghost" className="rounded-full">Pricing</Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" className="rounded-full">About</Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" className="rounded-full">Contact</Button>
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          <ModeToggle />
          <Link to="/auth">
            <Button variant="outline" className="rounded-full">Log in</Button>
          </Link>
          <Link to="/auth">
            <Button className="rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue text-white">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden transition-all duration-300 overflow-hidden",
        isMenuOpen ? "max-h-96 mt-4" : "max-h-0"
      )}>
        <nav className="flex flex-col space-y-2 py-2">
          <Link to="/features" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start rounded-full">Features</Button>
          </Link>
          <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start rounded-full">Pricing</Button>
          </Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start rounded-full">About</Button>
          </Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start rounded-full">Contact</Button>
          </Link>
          <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full rounded-full">Log in</Button>
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue text-white">
                Sign up
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default LandingNavbar;
