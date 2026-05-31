import { Link } from 'react-router-dom';
import { Grid, ArrowRight, Gamepad2, Heart, Mountain, User, Sparkles, Cat } from 'lucide-react';

export function Templates() {
  const categories = [
    {
      icon: Gamepad2,
      title: 'Pixel Art & Retro Gaming',
      description: 'Classic game sprites, characters, and retro designs',
      examples: ['Mario', 'Pac-Man', 'Space Invaders', 'Tetris'],
    },
    {
      icon: Sparkles,
      title: 'Anime & Manga Characters',
      description: 'Popular anime characters and chibi designs',
      examples: ['Pokemon', 'Naruto', 'Studio Ghibli', 'One Piece'],
    },
    {
      icon: Cat,
      title: 'Animals & Pets',
      description: 'Cute animals, pets, and wildlife patterns',
      examples: ['Cats', 'Dogs', 'Birds', 'Marine Life'],
    },
    {
      icon: Mountain,
      title: 'Landscapes & Nature',
      description: 'Scenery, flowers, and natural elements',
      examples: ['Sunsets', 'Mountains', 'Flowers', 'Trees'],
    },
    {
      icon: User,
      title: 'Portraits & People',
      description: 'Human figures, faces, and character designs',
      examples: ['Celebrities', 'Self-portraits', 'Fantasy', 'Emojis'],
    },
    {
      icon: Heart,
      title: 'Cute & Kawaii',
      description: 'Hearts, charms, and adorable designs',
      examples: ['Hearts', 'Stars', 'Food', 'Gifts'],
    },
  ];

  const sizes = [
    { name: 'Small', range: '20-30 cols', time: '1-2 hours', difficulty: 'Beginner' },
    { name: 'Medium', range: '40-60 cols', time: '3-5 hours', difficulty: 'Intermediate' },
    { name: 'Large', range: '80-100 cols', time: '6-10 hours', difficulty: 'Advanced' },
    { name: 'XL', range: '120+ cols', time: '12+ hours', difficulty: 'Expert' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Free Perler Bead Templates & Pattern Ideas
        </h1>
        <p className="text-gray-600 text-lg">
          Browse our collection of pattern ideas and get inspired for your next project
        </p>
      </div>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pattern Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <category.icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-2">
                {category.examples.map((example) => (
                  <span key={example} className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Size Guide */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perler Bead Grid Size Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sizes.map((size) => (
            <div key={size.name} className="bg-gray-50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{size.name}</h3>
              <p className="text-2xl font-bold text-red-500 mb-2">{size.range}</p>
              <p className="text-gray-600 text-sm mb-1">{size.time}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                size.difficulty === 'Beginner' ? 'bg-green-100 text-green-600' :
                size.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                size.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-600' :
                'bg-red-100 text-red-600'
              }`}>
                {size.difficulty}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-red-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Own Pattern</h2>
        <p className="text-gray-600 mb-6">
          Upload any image and convert it to a custom bead pattern instantly.
        </p>
        <Link
          to="/image-to-pattern"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors"
        >
          <Grid className="w-5 h-5 mr-2" />
          Create Custom Pattern
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </section>
    </div>
  );
}
