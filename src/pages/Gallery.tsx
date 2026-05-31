import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Search, Heart } from 'lucide-react';

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
    { id: 1, title: 'Cute Cat', category: 'animals', beads: 240, colors: 8, likes: 156, image: '/patterns/pattern1.jpg' },
    { id: 2, title: 'Mario', category: 'gaming', beads: 480, colors: 12, likes: 234, image: '/patterns/pattern2.jpg' },
    { id: 3, title: 'Pikachu', category: 'anime', beads: 360, colors: 6, likes: 312, image: '/patterns/pattern3.jpg' },
    { id: 4, title: 'Sunset', category: 'nature', beads: 600, colors: 15, likes: 189, image: '/patterns/pattern4.jpg' },
    { id: 5, title: 'Heart', category: 'cute', beads: 120, colors: 4, likes: 98, image: '/patterns/pattern5.jpg' },
    { id: 6, title: 'Dog', category: 'animals', beads: 320, colors: 10, likes: 145, image: '/patterns/pattern6.jpg' },
    { id: 7, title: 'Link', category: 'gaming', beads: 520, colors: 14, likes: 267, image: '/patterns/pattern7.jpg' },
    { id: 8, title: 'Totoro', category: 'anime', beads: 420, colors: 8, likes: 298, image: '/patterns/pattern8.jpg' },
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
            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
              <img
                src={pattern.image}
                alt={pattern.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
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
