import { CheckCircle2, Image as ImageIcon, Printer, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ExampleSlider, UploadBox } from './Home';

const imageTypes = [
  {
    title: 'Photos with one clear subject',
    text: 'Portraits, pets, and objects convert best when the background is simple and the subject fills the frame.',
  },
  {
    title: 'Logos and pixel art',
    text: 'Flat colors and strong outlines produce compact patterns that are easy to build on standard pegboards.',
  },
  {
    title: 'Illustrations and game sprites',
    text: 'Use a moderate grid width to keep recognizable details without creating an unnecessarily large project.',
  },
];

const conversionSteps = [
  ['1', 'Upload your image', 'Choose a JPG or PNG up to 10MB. The file stays in your browser while it is processed.'],
  ['2', 'Set the bead grid', 'Pick the number of columns based on the physical size and detail you want to build.'],
  ['3', 'Match real bead colors', 'Choose Perler, Hama, Artkal, or MARD and limit the palette to colors you can source.'],
  ['4', 'Export the pattern', 'Download a printable PDF or PNG plus a color-by-color bead count for assembly.'],
];

const settingGuide = [
  ['Small icons', '32-48 columns', '8-14 colors', 'Fast projects and simple shapes'],
  ['Pets and portraits', '64-96 columns', '16-28 colors', 'Balanced detail and bead count'],
  ['Detailed wall art', '120+ columns', '24-40 colors', 'Large projects with fine detail'],
];

const questions = [
  {
    q: 'Does the converter upload my photo?',
    a: 'No. PixelBeads processes the image locally in your browser, so the source photo does not need to be stored on a server.',
  },
  {
    q: 'Which image format gives the best result?',
    a: 'Both JPG and PNG work. PNG is usually better for logos, transparent artwork, and crisp illustrations; JPG is suitable for ordinary photos.',
  },
  {
    q: 'How large should my Perler bead pattern be?',
    a: 'Start near 48 columns for simple art and 64-96 columns for portraits. Increase the size only when the preview needs more recognizable detail.',
  },
];

export function ImageToPattern() {
  return (
    <main className="bg-[#1a1a1a] text-[#e8e6e3]">
      <section className="px-4 pb-20 pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-bold uppercase text-[#d4a574]">Free browser-based converter</p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">Image to Perler Beads Converter</h1>
          <p className="mx-auto mb-10 mt-6 max-w-2xl text-lg leading-8 text-[#a09b94] md:text-xl">
            Turn a photo, logo, or illustration into a practical Perler bead pattern with an adjustable grid, real fuse bead palettes, and exact material counts.
          </p>
          <div className="mx-auto max-w-xl">
            <UploadBox />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-[#9a948d]">
            Your image is processed locally. Nothing is uploaded, no account is required, and you can export the finished pattern for printing.
          </p>
        </div>
      </section>

      <section className="border-y border-[#2d2d2d] bg-[#1e1e1e] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-bold md:text-4xl">Which images make good bead patterns?</h2>
            <p className="mt-4 leading-7 text-[#a09b94]">The converter can use almost any photo, but clear shapes and deliberate grid choices create patterns that are easier to recognize and assemble.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {imageTypes.map((item) => (
              <div key={item.title} className="border-l-2 border-[#d4a574] pl-5">
                <ImageIcon className="mb-4 h-6 w-6 text-[#d4a574]" />
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#a09b94]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ExampleSlider />

      <section className="border-y border-[#2d2d2d] bg-[#1e1e1e] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex items-start gap-4">
            <SlidersHorizontal className="mt-1 h-7 w-7 flex-shrink-0 text-[#d4a574]" />
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Convert a photo in four steps</h2>
              <p className="mt-3 leading-7 text-[#a09b94]">Work from project size to color count, then judge the preview at the distance where the finished bead art will be viewed.</p>
            </div>
          </div>
          <ol className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {conversionSteps.map(([number, title, text]) => (
              <li key={number} className="flex gap-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[#d4a574] font-bold text-[#1a1a1a]">{number}</span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#a09b94]">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-start gap-4">
            <Printer className="mt-1 h-7 w-7 flex-shrink-0 text-[#d4a574]" />
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Recommended grid settings</h2>
              <p className="mt-3 leading-7 text-[#a09b94]">These starting points keep the pattern useful for a real craft project. You can fine-tune every value in the editor.</p>
            </div>
          </div>
          <div className="overflow-x-auto border-y border-[#3a3a3a]">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-[#252525] text-[#e8e6e3]">
                <tr><th className="p-4">Project</th><th className="p-4">Grid width</th><th className="p-4">Color limit</th><th className="p-4">Best for</th></tr>
              </thead>
              <tbody>
                {settingGuide.map((row) => (
                  <tr key={row[0]} className="border-t border-[#3a3a3a] text-[#a09b94]">
                    {row.map((cell, index) => <td key={cell} className={`p-4 ${index === 0 ? 'font-bold text-[#e8e6e3]' : ''}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-y border-[#2d2d2d] bg-[#1e1e1e] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold md:text-4xl">Image to Perler beads FAQ</h2>
          <div className="mt-10 divide-y divide-[#3a3a3a] border-y border-[#3a3a3a]">
            {questions.map((item) => (
              <div key={item.q} className="py-6">
                <h3 className="flex items-start gap-3 font-bold"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#d4a574]" />{item.q}</h3>
                <p className="mt-2 pl-8 text-sm leading-6 text-[#a09b94]">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-[#a09b94]">Need more help choosing a photo or grid? Read the <Link to="/guide/" className="font-bold text-[#d4a574] hover:text-[#e3b984]">step-by-step Perler bead guide</Link>.</p>
        </div>
      </section>
    </main>
  );
}
