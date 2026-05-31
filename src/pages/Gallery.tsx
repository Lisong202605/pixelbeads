import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Search, Heart } from 'lucide-react';

// Pattern preview component
function PatternPreview({ title, colors }: { title: string; colors: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d')!;
    const size = 16;
    const pixelSize = 12;
    
    canvas.width = size * pixelSize;
    canvas.height = size * pixelSize;
    
    // Background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Generate pattern
    const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const rand = Math.abs(Math.sin(seed * (x + 1) * (y + 1) * 0.1) * 10000);
        const colorIndex = Math.floor(rand % colors.length);
        
        const centerX = size / 2;
        const centerY = size / 2;
        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        
        // Create pattern - more pixels in center
        const shouldDraw = rand % 3 !== 0 || distFromCenter < size / 2.5;
        
        if (shouldDraw) {
          ctx.fillStyle = colors[colorIndex];
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 1, pixelSize - 1);
        }
      }
    }
  }, [title, colors]);
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <canvas
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: '100%',
          imageRendering: 'pixelated',
          objectFit: 'contain'
        }}
        className="max-w-[80%] max-h-[80%]"
      />
    </div>
  );
}

export function Gallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'animals', label: 'Animals' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'anime', label: 'Anime' },
    { id: 'nature', label: 'Nature' },
    { id: 'cute', label: 'Cute' },
  ];

  const patterns = [
    { id: 1, title: 'Cute Cat', category: 'animals', beads: 240, colors: 8, likes: 156, palette: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#2D3436', '#DFE6E9', '#B2BEC3'] },
    { id: 2, title: 'Mario', category: 'gaming', beads: 480, colors: 12, likes: 234, palette: ['#FF0000', '#0000FF', '#FFD700', '#8B4513', '#FF6B6B', '#FFFFFF', '#000000', '#87CEEB'] },
    { id: 3, title: 'Pikachu', category: 'anime', beads: 360, colors: 6, likes: 312, palette: ['#FFD700', '#FF0000', '#000000', '#8B4513', '#FFE66D', '#FFFFFF'] },
    { id: 4, title: 'Sunset', category: 'nature', beads: 600, colors: 15, likes: 189, palette: ['#FF6B6B', '#FF8E53', '#FE6B8B', '#FF8E53', '#FFD700', '#FF6347', '#FF4500', '#FFA500'] },
    { id: 5, title: 'Heart', category: 'cute', beads: 120, colors: 4, likes: 98, palette: ['#FF6B6B', '#F38181', '#FCBAD3', '#FFD700'] },
    { id: 6, title: 'Dog', category: 'animals', beads: 320, colors: 10, likes: 145, palette: ['#8B4513', '#D2691E', '#F4A460', '#DEB887', '#FFE4C4', '#000000', '#FFFFFF', '#FF6B6B'] },
    { id: 7, title: 'Link', category: 'gaming', beads: 520, colors: 14, likes: 267, palette: ['#228B22', '#FFD700', '#87CEEB', '#8B4513', '#FFE66D', '#FFFFFF', '#000000', '#FF6B6B'] },
    { id: 8, title: 'Totoro', category: 'anime', beads: 420, colors: 8, likes: 298, palette: ['#808080', '#FFFFFF', '#000000', '#FFE66D', '#87CEEB', '#228B22', '#8B4513', '#FF6B6B'] },
  ];

  const filteredPatterns = patterns.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      <div className="text-center mb-12">
        <Grid className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pattern Gallery</h1>
        <p className="text-gray-600 text-lg">Browse our collection of Perler bead patterns</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Patterns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPatterns.map((pattern) => (
          <div
            key={pattern.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group"
          >
            {/* Pattern Preview */}
            <div className="aspect-square">
              <PatternPreview title={pattern.title} colors={pattern.palette} />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{pattern.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span>{pattern.beads} beads</span>
                <span className="mx-2">•</span>
                <span>{pattern.colors} colors</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Heart className="w-4 h-4 mr-1" />
                  {pattern.likes}
                </div>
                <Link
                  to={`/pattern/${pattern.id}`}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  View →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No patterns found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
