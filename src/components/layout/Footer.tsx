import { Link } from 'react-router-dom';
import { Grid, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Grid className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PixelBeads</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Free online Perler bead pattern maker. Convert images to bead patterns, 
              generate designs with AI, and create printable templates.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/image-to-pattern" className="text-sm hover:text-primary transition-colors">Image to Pattern</Link></li>
              <li><Link to="/ai-generator" className="text-sm hover:text-primary transition-colors">AI Generator</Link></li>
              <li><Link to="/patterns" className="text-sm hover:text-primary transition-colors">Pattern Library</Link></li>
              <li><Link to="/calculator" className="text-sm hover:text-primary transition-colors">Size Calculator</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/about" className="text-sm hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2026 PixelBeads. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center mt-2 md:mt-0">
            Made with <Heart className="w-4 h-4 text-primary mx-1" /> for bead artists
          </p>
        </div>
      </div>
    </footer>
  );
}
