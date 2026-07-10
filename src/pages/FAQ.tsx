import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, HelpCircle, Lock, Palette, Printer, Sparkles } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is this Perler bead pattern maker free or paid?',
      a: 'Currently free and no registration required. PixelBeads is committed to providing the best free Perler bead tool. If there are any paid plans in the future, we will notify users in advance.',
    },
    {
      q: 'What image formats are supported?',
      a: 'We support JPG and PNG formats up to 10MB. For best results, use images with clear subjects and good contrast. Avoid blurry or low-resolution images.',
    },
    {
      q: 'Can I convert an image to Perler beads online?',
      a: 'Yes. Upload a JPG or PNG image, choose a bead palette, adjust the grid width and color count, then export a printable Perler bead pattern with bead counts.',
    },
    {
      q: 'What is the best image size for a Perler bead pattern?',
      a: 'Simple icons work well at 48 to 64 columns, portraits usually need 96 to 128 columns, and detailed wall art often needs 128 columns or more.',
    },
    {
      q: 'Can I mix different bead brands?',
      a: 'Currently, you can choose one bead brand per pattern. We support Perler, Hama, Artkal, and MARD palettes. Each brand has its own unique color range.',
    },
    {
      q: 'Can I print the bead pattern?',
      a: 'Absolutely! Export your pattern as a PDF with a complete color chart and bead count. The PDF includes a grid overlay that makes it easy to follow while placing beads.',
    },
    {
      q: 'Is my photo uploaded to a server?',
      a: 'No. All image processing happens in your browser using JavaScript. Your photos never leave your device, ensuring complete privacy and security.',
    },
    {
      q: 'What makes PixelBeads different from other bead pattern makers?',
      a: 'We use the CIEDE2000 color matching algorithm for the most accurate brand color matching. We support multiple bead brands, process everything locally for privacy, and offer a fully functional pattern editor.',
    },
    {
      q: 'How accurate is the color matching?',
      a: 'We use CIEDE2000, the industry-standard color difference formula, to match your image colors to the closest bead colors. This provides highly accurate results, though some artistic interpretation may be needed.',
    },
    {
      q: 'Can I edit the pattern after generation?',
      a: 'Yes! Our editor allows you to click individual beads to change their colors. You can also adjust the overall color limit and grid size.',
    },
    {
      q: 'What is the maximum grid size?',
      a: 'You can create patterns up to 200 columns wide. Larger grids provide more detail but require more beads and time to complete.',
    },
    {
      q: 'Can I save my patterns?',
      a: "Currently, patterns are saved in your browser's local storage. We recommend exporting your patterns as PDF or PNG to keep them permanently.",
    },
  ];

  const highlights = [
    { icon: Lock, title: 'Private by default', text: 'Photo processing happens in your browser.' },
    { icon: Palette, title: 'Real bead palettes', text: 'Perler, Hama, Artkal, and MARD colors.' },
    { icon: Printer, title: 'Print-ready export', text: 'PDF patterns include chart and bead counts.' },
  ];

  return (
    <main className="min-h-screen bg-[#1a1a1a] px-4 pb-20 pt-32 text-[#e8e6e3]">
      <div className="mx-auto max-w-5xl">
        <section className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-[#d4a574]/30 bg-[#d4a574]/10 text-[#d4a574]">
            <HelpCircle className="h-7 w-7" />
          </div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#d4a574]">FAQ</p>
          <h1 className="text-4xl font-bold leading-tight text-[#e8e6e3] md:text-6xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#9a948d]">
            Everything you need to know about creating, editing, printing, and saving bead patterns with PixelBeads.
          </p>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="craft-card p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#d4a574]/30 bg-[#d4a574]/10 text-[#d4a574]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-[#e8e6e3]">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#9a948d]">{item.text}</p>
              </article>
            );
          })}
        </section>

        <section className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <article
                key={faq.q}
                className={`overflow-hidden rounded-lg border transition ${
                  isOpen ? 'border-[#d4a574]/40 bg-[#202020]' : 'border-[#3a3a3a] bg-[#202020] hover:border-[#5a5a5a]'
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="flex items-start gap-4">
                    <span
                      className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border text-sm font-bold ${
                        isOpen ? 'border-[#d4a574]/40 bg-[#d4a574]/10 text-[#d4a574]' : 'border-[#3a3a3a] bg-[#171717] text-[#a09b94]'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-bold text-[#e8e6e3] md:text-lg">{faq.q}</span>
                  </span>
                  <ChevronDown className={`h-5 w-5 flex-shrink-0 text-[#d4a574] transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-[#3a3a3a] bg-[#171717] px-5 py-5 md:pl-[4.75rem]">
                    <p className="max-w-3xl leading-7 text-[#9a948d]">{faq.a}</p>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <section className="mt-12 rounded-lg border border-[#d4a574]/30 bg-[#d4a574]/10 p-7 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#d4a574]">
              <Sparkles className="h-4 w-4" />
              Still deciding?
            </div>
            <h2 className="text-2xl font-bold text-[#e8e6e3]">Try a photo and see the pattern instantly.</h2>
            <p className="mt-2 text-sm leading-6 text-[#9a948d]">No account, no upload to server, no setup.</p>
          </div>
          <Link to="/image-to-pattern/" className="craft-btn mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 md:mt-0">
            Start Creating
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </div>
    </main>
  );
}
