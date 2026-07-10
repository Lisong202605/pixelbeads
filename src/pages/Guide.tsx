import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Download, Palette, SlidersHorizontal, Upload } from 'lucide-react';

export function Guide() {
  const steps = [
    {
      icon: Upload,
      title: 'Choose a clean source photo',
      content:
        'Use a photo with one clear subject, strong lighting, and readable color blocks. Portraits, pets, game sprites, icons, and simple landscapes convert best.',
      tips: ['High contrast beats tiny detail', 'Crop before uploading', 'Avoid busy backgrounds', 'Use bright, natural lighting'],
    },
    {
      icon: Palette,
      title: 'Match to real bead colors',
      content:
        'PixelBeads compares your image against real bead palettes so the finished pattern is easier to build with actual Perler, Hama, Artkal, or MARD colors.',
      tips: ['Pick your bead brand first', 'Use fewer colors for beginners', 'Keep rare colors optional', 'Review the palette before export'],
    },
    {
      icon: SlidersHorizontal,
      title: 'Tune grid size and detail',
      content:
        'Larger grids preserve more detail; smaller grids are faster to finish. Adjust width, color count, cleanup, and dithering until the preview feels craft-ready.',
      tips: ['Small charms: 32-64 columns', 'Wall art: 96-160 columns', 'Use dithering for gradients', 'Disable noisy colors when needed'],
    },
    {
      icon: Download,
      title: 'Export, sort, and build',
      content:
        'Download a printable pattern with grid lines, color chart, and material counts. Sort beads by color first, then work section by section.',
      tips: ['PDF for printing', 'PNG for sharing', 'CSV for material planning', 'Save an editor copy for later tweaks'],
    },
  ];

  const brands = [
    { name: 'Perler', colors: 80, origin: 'USA', note: 'Beginner friendly', popular: true },
    { name: 'Hama', colors: 70, origin: 'Denmark', note: 'Classic craft choice', popular: true },
    { name: 'Artkal', colors: 200, origin: 'China', note: 'Large palette range', popular: false },
    { name: 'MARD', colors: 50, origin: 'Japan', note: 'Curated color set', popular: false },
  ];

  return (
    <main className="min-h-screen bg-[#1a1a1a] px-4 pb-20 pt-32 text-[#e8e6e3]">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-[#3a3a3a] bg-[#252525] px-4 py-2 text-sm font-bold text-[#a09b94] transition hover:border-[#5a5a5a] hover:text-[#e8e6e3]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <section className="mb-14">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#252525] px-3 py-1.5 text-sm font-medium text-[#d4a574]">
            Beginner Guide
          </p>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#e8e6e3] md:text-6xl">
            How to Make Perler Bead Patterns from Photos
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#9a948d]">
            Convert a favorite photo into bead-ready pixel art, choose real bead colors, then export a printable pattern with color counts.
            This image to Perler beads workflow works best when you balance detail, grid size, and the number of colors you actually own.
          </p>
        </section>

        <section className="mb-14 grid gap-5 md:grid-cols-[1fr_0.8fr]">
          <div className="craft-card p-6">
            <h2 className="text-2xl font-bold text-[#e8e6e3]">What Are Perler Beads?</h2>
            <p className="mt-4 leading-7 text-[#9a948d]">
              Perler beads, also called fuse beads, Hama beads, or iron beads, are small plastic beads arranged on a pegboard and fused
              with heat. Because each bead behaves like a pixel, photos and illustrations can become physical pixel art.
            </p>
            <p className="mt-4 leading-7 text-[#9a948d]">
              The trick is reducing detail without losing the subject. Good patterns balance grid size, color count, and readable shapes.
            </p>
            <p className="mt-4 leading-7 text-[#9a948d]">
              If you are using a photo to Perler bead pattern converter, start with a cropped image and choose a target size before judging color accuracy.
            </p>
          </div>

          <div className="craft-card p-6">
            <h2 className="text-2xl font-bold text-[#e8e6e3]">Quick Settings</h2>
            <div className="mt-5 space-y-4">
              {[
                ['Simple icon', '48-64 columns, 12-20 colors'],
                ['Pet portrait', '96-128 columns, 24-40 colors'],
                ['Wall art', '128-180 columns, 40-60 colors'],
              ].map(([name, value]) => (
                <div key={name} className="rounded-lg border border-[#3a3a3a] bg-[#171717] p-4">
                  <p className="font-bold text-[#e8e6e3]">{name}</p>
                  <p className="mt-1 text-sm text-[#9a948d]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#d4a574]">Workflow</p>
              <h2 className="mt-2 text-3xl font-bold text-[#e8e6e3]">Step-by-Step Guide</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="craft-card p-6 craft-card-hover">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#d4a574]/30 bg-[#d4a574]/10 text-[#d4a574]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#d4a574]">Step {index + 1}</p>
                      <h3 className="text-xl font-bold text-[#e8e6e3]">{step.title}</h3>
                    </div>
                  </div>
                  <p className="leading-7 text-[#9a948d]">{step.content}</p>
                  <ul className="mt-5 space-y-3">
                    {step.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-3 text-sm text-[#a09b94]">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#d4a574]" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-14">
          <p className="text-sm font-bold uppercase tracking-wide text-[#d4a574]">Materials</p>
          <h2 className="mt-2 text-3xl font-bold text-[#e8e6e3]">Supported Bead Brands</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <article key={brand.name} className="craft-card p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-[#e8e6e3]">{brand.name}</h3>
                  {brand.popular && (
                    <span className="rounded-full border border-[#d4a574]/30 bg-[#d4a574]/10 px-2 py-1 text-xs font-bold text-[#d4a574]">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#9a948d]">{brand.colors} colors available</p>
                <p className="mt-1 text-sm text-[#6b6560]">Made in {brand.origin}</p>
                <p className="mt-4 rounded-md border border-[#3a3a3a] bg-[#171717] px-3 py-2 text-sm text-[#a09b94]">{brand.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#d4a574]/30 bg-[#d4a574]/10 p-8 text-center">
          <h2 className="text-3xl font-bold text-[#e8e6e3]">Ready to make your first pattern?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#a09b94]">
            Upload a photo, preview the bead colors, and export a print-ready pattern in a few clicks.
          </p>
          <Link to="/image-to-pattern/" className="craft-btn mt-6 inline-flex items-center justify-center gap-2 px-6 py-3">
            <Upload className="h-5 w-5" />
            Start Creating
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </div>
    </main>
  );
}
