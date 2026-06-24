import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/privacy/', label: 'Privacy Policy' },
  { to: '/terms/', label: 'Terms of Service' },
  { to: '/guide/', label: 'Beginner Guide' },
  { to: '/templates/', label: 'Templates' },
  { to: '/faq/', label: 'FAQ' },
  { to: '/contact/', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-[#3a3a3a] py-8 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-1 mb-6">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-1.5 text-sm text-[#6b6560] hover:text-[#d4a574] transition-colors rounded-md hover:bg-[#ffffff05]"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="craft-divider mb-4" />
        <p className="text-center text-xs text-[#6b6560] tracking-wide">
          (c) 2026 PixelBeads. Free Perler bead pattern maker.
        </p>
      </div>
    </footer>
  );
}
