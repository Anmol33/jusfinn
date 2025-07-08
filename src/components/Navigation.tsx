import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Play } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-headline-small font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinScribe
              </h1>
              <p className="text-caption text-neutral-500 -mt-1">
                CA Practice Management
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-body-medium font-medium text-neutral-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/features" className="text-body-medium font-medium text-neutral-700 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-body-medium font-medium text-neutral-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-body-medium font-medium text-neutral-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-body-medium font-medium text-neutral-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="btn-secondary">
              <Play className="w-4 h-4 mr-2" />
              Demo
            </Button>
            <Link to="/dashboard">
              <Button className="btn-primary group">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 hover:bg-neutral-100 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-neutral-600" />
              ) : (
                <Menu className="h-6 w-6 text-neutral-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm rounded-xl border border-neutral-200/50 mt-2">
              <Link
                to="/"
                className="block px-3 py-2 text-body-medium font-medium text-neutral-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/features"
                className="block px-3 py-2 text-body-medium font-medium text-neutral-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="block px-3 py-2 text-body-medium font-medium text-neutral-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-body-medium font-medium text-neutral-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-body-medium font-medium text-neutral-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-neutral-200/50 mt-4">
                <div className="flex flex-col space-y-3">
                  <Button variant="outline" className="btn-secondary">
                    <Play className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                  <Link to="/dashboard">
                    <Button className="btn-primary w-full group">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
