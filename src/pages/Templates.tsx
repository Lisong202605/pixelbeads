const categories = [
  { name: 'Animals', desc: 'Cats, dogs, birds, and wildlife patterns' },
  { name: 'Anime & Games', desc: 'Popular characters and sprites' },
  { name: 'Food', desc: 'Cute food and drink designs' },
  { name: 'Nature', desc: 'Flowers, trees, and landscapes' },
  { name: 'Geometric', desc: 'Patterns, mandalas, and abstract art' },
  { name: 'Holidays', desc: 'Seasonal and holiday-themed designs' },
];

const sizes = [
  { name: 'Small (29x29)', desc: 'Quick projects, keychains, magnets' },
  { name: 'Medium (58x58)', desc: 'Standard projects, coasters, small art' },
  { name: 'Large (80x80)', desc: 'Detailed projects, wall art' },
  { name: 'Extra Large (120x120)', desc: 'Complex designs, large portraits' },
];

export function Templates() {
  return (
    <main className="bg-[#1a1a1a] min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e8e6e3] mb-4">Templates</h1>
        <p className="text-[#6b6560] mb-10 max-w-2xl">
          Starting points for choosing bead pattern subjects and board sizes.
        </p>

        <h2 className="text-2xl font-bold text-[#e8e6e3] mb-4">Categories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {categories.map((category) => (
            <div key={category.name} className="craft-card p-5 craft-card-hover">
              <h3 className="text-[#e8e6e3] font-semibold mb-2">{category.name}</h3>
              <p className="text-sm text-[#6b6560]">{category.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-[#e8e6e3] mb-4">Board Sizes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {sizes.map((size) => (
            <div key={size.name} className="craft-card p-5 craft-card-hover">
              <h3 className="text-[#e8e6e3] font-semibold mb-2">{size.name}</h3>
              <p className="text-sm text-[#6b6560]">{size.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
