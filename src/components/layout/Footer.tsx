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
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Grid className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PixelBeads</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Free online Perler bead pattern maker. Convert photos to bead patterns, 
              generate designs with AI, and create printable templates.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/image-to-pattern" className="text-sm hover:text-red-400 transition-colors">Photo to Pattern</Link></li>
              <li><Link to="/ai-generator" className="text-sm hover:text-red-400 transition-colors">AI Generator</Link></li>
              <li><Link to="/gallery" className="text-sm hover:text-red-400 transition-colors">Gallery</Link></li>
              <li><Link to="/calculator" className="text-sm hover:text-red-400 transition-colors">Size Calculator</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/guide" className="text-sm hover:text-red-400 transition-colors">Beginner Guide</Link></li>
              <li><Link to="/templates" className="text-sm hover:text-red-400 transition-colors">Templates</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-red-400 transition-colors">FAQ</Link></li>
              <li><Link to="/about" className="text-sm hover:text-red-400 transition-colors">About</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2026 PixelBeads. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</Link>
            <span className="text-sm text-gray-400 flex items-center">
              Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for bead artists
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
