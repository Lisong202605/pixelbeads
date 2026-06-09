const galleryItems = [
  { name: 'Landscape', image: '/examples/landscape-after.webp' },
  { name: 'Cute Puppy', image: '/examples/sheep.webp' },
  { name: 'Field Bunny', image: '/examples/cat.webp' },
  { name: 'Lively Tiger', image: '/examples/panda.webp' },
  { name: 'Mushroom Bear', image: '/examples/fox.webp' },
];

export function Gallery() {
  return (
    <main className="bg-[#1a1a1a] min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e8e6e3] mb-4">Gallery</h1>
        <p className="text-[#6b6560] mb-10 max-w-2xl">
          Example bead patterns generated from photos and illustrations.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <article key={item.name} className="craft-card overflow-hidden craft-card-hover">
              <img src={item.image} alt={item.name} className="w-full aspect-square object-cover" loading="lazy" />
              <div className="p-4">
                <h2 className="text-[#e8e6e3] font-semibold">{item.name}</h2>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
