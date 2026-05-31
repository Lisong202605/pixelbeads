import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calculator, BookOpen, HelpCircle } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '/guide', label: 'Guide', icon: BookOpen },
    { to: '/calculator', label: 'Calculator', icon: Calculator },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="grid grid-cols-3 gap-0.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
                ))}
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">PixelBeads</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-gray-100 transition-colors"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden py-2 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
