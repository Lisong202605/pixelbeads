import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

type Example = {
  id: string;
  name: string;
  before: string;
  after: string;
};

type FaqItem = {
  q: string;
  a: string;
};

const examples: Example[] = [
  { id: 'hat-kitty', name: 'Hat Kitty', before: '/examples/landscape-before.webp', after: '/examples/landscape-after.webp' },
  { id: 'golden-puppy', name: 'Golden Puppy', before: '/examples/sheep-before.webp', after: '/examples/sheep.webp' },
  { id: 'garden-bunny', name: 'Garden Bunny', before: '/examples/cat-before.webp', after: '/examples/cat.webp' },
  { id: 'baby-tiger', name: 'Baby Tiger', before: '/examples/panda-before.webp', after: '/examples/panda.webp' },
  { id: 'forest-teddy', name: 'Forest Teddy', before: '/examples/fox-before.webp', after: '/examples/fox.webp' },
];

const features = [
  {
    title: 'Brand Bead Palettes',
    desc: 'Built-in Perler, Hama, Artkal & MARD color palettes for accurate bead matching.',
  },
  {
    title: 'Auto Bead Counting',
    desc: 'Automatic per-color bead count with low-usage highlighting.',
  },
  {
    title: 'Pattern Export',
    desc: 'Export bead patterns as PNG or PDF, print-ready for crafting.',
  },
  {
    title: 'Manual Color Edit',
    desc: 'Click to replace colors on canvas with undo and redo support.',
  },
  {
    title: 'Adjustable Grid',
    desc: 'Change bead grid width, color count, and dithering in real time.',
  },
  {
    title: 'Instant Processing',
    desc: 'Browser-side image processing keeps the experience quick and private.',
  },
];

const resources = [
  { name: 'Photo to pattern', desc: 'Convert photos into printable bead grids' },
  { name: 'Pattern generator', desc: 'Free online Perler bead generator' },
  { name: 'Minecraft patterns', desc: 'Block-style bead pattern settings' },
  { name: 'Pokemon patterns', desc: 'Sprite and fan-art bead ideas' },
  { name: 'Color chart guide', desc: 'Perler, Hama, Artkal, and MARD colors' },
  { name: 'Board size guide', desc: 'Choose the right grid before export' },
  { name: 'Cute patterns', desc: 'Cats, hearts, charms, and gift ideas' },
  { name: 'Perler vs Hama vs Artkal', desc: 'Choose the right bead palette' },
];

const faqs: FaqItem[] = [
  {
    q: 'Is this perler bead pattern maker really free?',
    a: 'Yes. Pixelbead is free with no sign-up required. We will announce before any future pricing changes.',
  },
  {
    q: 'What image formats are supported?',
    a: 'JPG and PNG are supported, up to 10MB per image.',
  },
  {
    q: 'Can I mix different bead brands?',
    a: 'You can compare colors across brands, but one brand per project usually gives the most consistent result.',
  },
  {
    q: 'Can I print the bead pattern?',
    a: 'Yes. Export as PDF for print-ready A4 format, or PNG for digital use.',
  },
  {
    q: 'Is my photo uploaded to a server?',
    a: 'No. Image processing happens locally in your browser.',
  },
  {
    q: 'What makes Pixelbead different from other bead pattern makers?',
    a: 'Pixelbead focuses on accurate color matching, multiple bead palettes, and a cleaner crafting workflow.',
  },
];

function UploadBox() {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const openFilePicker = () => inputRef.current?.click();

  const handleFile = useCallback(
    (file?: File) => {
      if (!file || !file.type.match(/image\/(png|jpeg)/) || file.size > 10 * 1024 * 1024) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          sessionStorage.setItem('uploadedImage', result);
          navigate('/editor/');
        }
      };
      reader.readAsDataURL(file);
    },
    [navigate],
  );

  return (
    <div
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFile(event.dataTransfer.files[0]);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      className={`border-2 border-dashed rounded-xl p-12 md:p-16 text-center transition-all cursor-pointer bg-[#1e1e1e] ${
        isDragging
          ? 'border-[#d4a574] bg-[#d4a574]/5 shadow-[0_0_0_4px_rgba(212,165,116,0.1)]'
          : 'border-[#3a3a3a] hover:border-[#4a4a4a] hover:bg-[#252525]'
      }`}
      onClick={openFilePicker}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <p className="text-[#6b6560] font-medium mb-4 text-base">Drop or click to upload JPG/PNG, max 10MB</p>
      <button
        type="button"
        className="craft-btn px-8 py-3 text-base inline-flex items-center gap-2"
        onClick={(event) => {
          event.stopPropagation();
          openFilePicker();
        }}
      >
        <Upload className="w-4 h-4" />
        Upload & Create Pattern
      </button>
      <p className="mt-4 text-sm text-[#6b6560]">JPG / PNG · ≤ 10MB</p>
    </div>
  );
}

function ExampleSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slider, setSlider] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const active = examples[activeIndex];

  const updateSlider = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setSlider(Math.max(0, Math.min(100, next)));
  };

  return (
    <section id="examples" className="bg-[#1a1a1a] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#e8e6e3] text-center mb-4">
          Perler Bead Pattern Examples
        </h2>
        <p className="text-[#6b6560] text-center mb-12 max-w-2xl mx-auto">
          Drag the slider to see before and after. Upload your own photo to get started.
        </p>

        <div className="mb-10">
          <div
            className="relative w-full aspect-square max-w-xl mx-auto rounded-lg overflow-hidden cursor-ew-resize select-none border border-[#3a3a3a]"
            onMouseMove={(event) => isDragging && updateSlider(event.clientX, event.currentTarget)}
            onMouseDown={(event) => {
              setIsDragging(true);
              updateSlider(event.clientX, event.currentTarget);
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={(event) => updateSlider(event.touches[0].clientX, event.currentTarget)}
            onTouchStart={(event) => updateSlider(event.touches[0].clientX, event.currentTarget)}
            onTouchEnd={() => setIsDragging(false)}
          >
            <img src={active.after} alt={`${active.name} bead pattern`} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${slider}%` }}>
              <img
                src={active.before}
                alt={`${active.name} original`}
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: `${100 / (slider / 100 || 1)}%` }}
                draggable={false}
              />
            </div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${slider}%`, transform: 'translateX(-50%)' }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <span className="text-[#1a1a1a] text-sm font-bold">↔</span>
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-[#1a1a1a]/80 text-[#e8e6e3] text-xs font-medium px-3 py-1 rounded">
              Original Photo
            </div>
            <div className="absolute top-4 right-4 bg-[#d4a574]/90 text-[#1a1a1a] text-xs font-bold px-3 py-1 rounded">
              Bead Pattern
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          {examples.map((example, index) => (
            <button
              type="button"
              key={example.id}
              onClick={() => {
                setActiveIndex(index);
                setSlider(50);
              }}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex ? 'border-[#d4a574] ring-2 ring-[#d4a574]/30' : 'border-[#3a3a3a] hover:border-[#5a5a5a]'
              }`}
              aria-label={`Show ${example.name}`}
            >
              <img src={example.before} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
        <p className="text-center text-[#6b6560] text-sm mt-3">{active.name}</p>
      </div>
    </section>
  );
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto space-y-2">
      {items.map((item, index) => (
        <div key={item.q} className="craft-card overflow-hidden">
          <button
            type="button"
            className="w-full px-5 py-4 flex items-center justify-between text-left"
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          >
            <span className="text-[#e8e6e3] font-medium text-sm">{item.q}</span>
            <span className="text-[#d4a574] text-lg ml-4 flex-shrink-0">{openIndex === index ? '−' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className="px-5 pb-4 text-[#6b6560] text-sm leading-relaxed border-t border-[#3a3a3a] pt-3">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function Home() {
  return (
    <main className="bg-[#1a1a1a]">
      <section className="bg-[#1a1a1a] pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#e8e6e3] leading-tight mb-6 tracking-tight pt-8">
            Free Perler Bead Pattern Maker — Photo to Bead Art
          </h1>
          <p className="text-lg md:text-xl text-[#6b6560] max-w-2xl mx-auto mb-10 leading-relaxed">
            Drag & drop any photo to instantly create perler bead, hama bead, or fuse bead patterns.
            Accurate CIEDE2000 color matching with Perler, Hama, Artkal & MARD palettes.
          </p>
          <div className="max-w-xl mx-auto mb-8">
            <UploadBox />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="px-3 py-1.5 bg-[#252525] border border-[#3a3a3a] rounded-full text-[#6b6560] text-sm">100% Free</span>
            <span className="px-3 py-1.5 bg-[#252525] border border-[#3a3a3a] rounded-full text-[#6b6560] text-sm">No sign-up</span>
            <span className="px-3 py-1.5 bg-[#252525] border border-[#3a3a3a] rounded-full text-[#6b6560] text-sm">Perler / Hama / Artkal / MARD</span>
          </div>
          <a href="#examples" className="inline-flex items-center gap-2 text-[#d4a574] hover:text-[#c49464] transition-colors text-sm font-medium">
            See how it works →
          </a>
        </div>
      </section>

      <ExampleSlider />

      <section className="bg-[#1a1a1a] py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8e6e3] text-center mb-4">Bead Pattern Maker Features</h2>
          <p className="text-[#6b6560] text-center mb-16 max-w-xl mx-auto">Everything you need to create perfect bead patterns</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="craft-card p-6 craft-card-hover transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-[#d4a574]/10 border border-[#d4a574]/20 flex items-center justify-center mb-4">
                  <span className="w-3 h-3 rounded-sm bg-[#d4a574]" />
                </div>
                <h3 className="text-base font-semibold text-[#e8e6e3] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6b6560] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#1e1e1e] py-24 px-4 border-y border-[#2d2d2d]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8e6e3] text-center mb-4">Create Bead Patterns in 3 Steps</h2>
          <p className="text-[#6b6560] text-center mb-16 max-w-xl mx-auto">From photo to printable pattern in minutes</p>
          <div className="grid md:grid-cols-3 gap-6">
            {['Upload a photo or illustration', 'Pick bead brand, colors & dither style', 'Download bead pattern & materials list'].map((step, index) => (
              <div key={step} className="text-center">
                <div className="inline-flex w-14 h-14 rounded-xl bg-[#d4a574]/10 border border-[#d4a574]/30 items-center justify-center mb-4">
                  <span className="text-xl font-bold text-[#d4a574]">{index + 1}</span>
                </div>
                <p className="text-[#6b6560] text-sm leading-relaxed max-w-xs mx-auto">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8e6e3] text-center mb-4">Resources</h2>
          <p className="text-[#6b6560] text-center mb-16 max-w-xl mx-auto">Learn more about bead crafting</p>
          <div className="grid md:grid-cols-2 gap-3">
            {resources.map((resource) => (
              <div key={resource.name} className="craft-card p-5 craft-card-hover transition-all duration-300 flex items-start justify-between gap-4 group">
                <div>
                  <p className="font-medium text-[#e8e6e3] text-sm group-hover:text-[#d4a574] transition-colors">{resource.name}</p>
                  <p className="text-sm text-[#6b6560] mt-1">{resource.desc}</p>
                </div>
                <span className="text-[#4a4a4a] group-hover:text-[#d4a574] transition-colors flex-shrink-0">›</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1e1e1e] py-24 px-4 border-y border-[#2d2d2d]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8e6e3] text-center mb-4">Perler Bead Pattern Maker — FAQ</h2>
          <p className="text-[#6b6560] text-center mb-16 max-w-xl mx-auto">Common questions answered</p>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8e6e3] mb-4">About Pixelbead — The Free Perler Bead Pattern Generator</h2>
          <p className="text-[#6b6560] leading-relaxed max-w-2xl mx-auto">
            Pixelbead is a free online perler bead pattern maker that converts photos and illustrations into bead art designs.
            It supports common fuse bead workflows and keeps image processing local in your browser.
          </p>
        </div>
      </section>
    </main>
  );
}
