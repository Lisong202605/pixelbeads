import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/guide', label: 'Guide' },
  { to: '/templates', label: 'Templates' },
  { to: '/faq', label: 'FAQ' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/image-to-pattern';
    }
    return location.pathname === path;
  };

  return (
    <nav className="craft-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight text-[#e8e6e3] flex items-center gap-2">
          <div className="w-7 h-7 bg-[#d4a574] rounded flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1">
              <span className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-sm" />
              <span className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-sm" />
              <span className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-sm" />
              <span className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-sm" />
            </div>
          </div>
          PIXELBEADS
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <div key={link.to} className="flex items-center gap-1">
              {index === 1 && <span className="w-px h-4 bg-[#3a3a3a] mx-1" />}
              <Link
                to={link.to}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  isActive(link.to)
                    ? 'text-[#d4a574] bg-[#d4a574]/10'
                    : 'text-[#6b6560] hover:text-[#e8e6e3] hover:bg-[#ffffff08]'
                }`}
              >
                {link.label}
              </Link>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-md text-[#a09b94] hover:text-[#e8e6e3] hover:bg-[#ffffff08]"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-[#3a3a3a] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2 text-sm rounded-md ${
                isActive(link.to)
                  ? 'text-[#d4a574] bg-[#d4a574]/10'
                  : 'text-[#6b6560] hover:text-[#e8e6e3]'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
