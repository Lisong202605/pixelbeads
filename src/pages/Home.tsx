import { Link } from 'react-router-dom';
import { Grid, Download, Palette, Sliders, MousePointer, Zap, ArrowRight, Upload } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: Palette,
      title: 'Brand Bead Palettes',
      description: 'Match colors with Perler, Hama, Artkal, and MARD bead palettes automatically.',
    },
    {
      icon: Grid,
      title: 'Auto Bead Counting',
      description: 'Get exact bead counts for each color. Know exactly how many beads you need.',
    },
    {
      icon: Download,
      title: 'Pattern Export',
      description: 'Export as PDF, PNG, or SVG. Print-ready templates with color charts.',
    },
    {
      icon: MousePointer,
      title: 'Manual Color Edit',
      description: 'Click any bead to change its color. Fine-tune your pattern pixel by pixel.',
    },
    {
      icon: Sliders,
      title: 'Adjustable Grid',
      description: 'Choose grid size from 20 to 100+ columns. More columns = more detail.',
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Your image is processed in seconds using advanced color matching algorithms.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Your Image',
      description: 'Drag and drop or click to upload JPG/PNG up to 10MB.',
    },
    {
      number: '02',
      title: 'Customize Settings',
      description: 'Choose bead brand, grid size, color limit, and dithering options.',
    },
    {
      number: '03',
      title: 'Export & Create',
      description: 'Download your pattern as PDF with color chart and start beading!',
    },
  ];

  const resources = [
    { title: 'Photo to Pattern', desc: 'Convert photos into printable bead grids', to: '/image-to-pattern' },
    { title: 'Pattern Gallery', desc: 'Browse community bead patterns', to: '/gallery' },
    { title: 'Minecraft Patterns', desc: 'Block-style bead pattern settings', to: '/templates' },
    { title: 'Pokemon Patterns', desc: 'Sprite and fan-art bead ideas', to: '/gallery' },
    { title: 'Color Chart Guide', desc: 'Perler, Hama, Artkal, and MARD colors', to: '/guide' },
    { title: 'Board Size Guide', desc: 'Choose the right grid before export', to: '/calculator' },
    { title: 'Cute Patterns', desc: 'Cats, hearts, charms, and gift ideas', to: '/templates' },
    { title: 'Brand Comparison', desc: 'Perler vs Hama vs Artkal', to: '/guide' },
  ];

  const faqs = [
    {
      q: 'Is this Perler bead pattern maker really free?',
      a: 'Yes! PixelBeads is completely free to use. You can convert unlimited images to bead patterns without any cost.',
    },
    {
      q: 'What image formats are supported?',
      a: 'We support JPG and PNG formats up to 10MB. For best results, use images with clear subjects and good contrast.',
    },
    {
      q: 'Can I mix different bead brands?',
      a: 'Currently, you can choose one bead brand per pattern. We support Perler, Hama, Artkal, and MARD palettes.',
    },
    {
      q: 'Can I print the bead pattern?',
      a: 'Absolutely! Export your pattern as a PDF with a complete color chart and bead count. Perfect for printing.',
    },
    {
      q: 'Is my photo uploaded to a server?',
      a: 'No. All image processing happens in your browser. Your photos never leave your device, ensuring complete privacy.',
    },
    {
      q: 'What makes PixelBeads different?',
      a: 'We use the CIEDE2000 color matching algorithm for accurate brand color matching, support multiple bead brands, and process everything locally for privacy.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50 to-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Free Perler Bead
              <br />
              <span className="text-red-500">Pattern Maker</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Convert photos to bead patterns instantly. Multi-brand color matching, 
              printable templates, and pixel-perfect design tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/image-to-pattern"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload & Create Pattern
              </Link>
              <Link
                to="/editor"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl text-red-600 border-2 border-red-500 hover:bg-red-50 transition-colors"
              >
                <Grid className="w-5 h-5 mr-2" />
                Pattern Editor
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              Supports JPG/PNG, max 10MB. No signup required.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bead Pattern Maker Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create perfect Perler bead patterns
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors"
                >
                  <feature.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Create Bead Patterns in 3 Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="text-5xl font-bold text-red-200 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((resource) => (
              <Link
                key={resource.title}
                to={resource.to}
                className="group p-4 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{resource.desc}</p>
                <ArrowRight className="w-4 h-4 text-red-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About PixelBeads
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              PixelBeads is a free online Perler bead pattern generator designed for crafters, 
              pixel art enthusiasts, and anyone who loves fuse beads. Our tool uses advanced 
              color matching algorithms to convert your photos into accurate bead patterns 
              with support for multiple bead brands including Perler, Hama, Artkal, and MARD.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to create your first pattern?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            No signup required. Start creating beautiful Perler bead patterns in seconds.
          </p>
          <Link
            to="/image-to-pattern"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl text-gray-900 bg-white hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Start Creating Now
          </Link>
        </div>
      </section>
    </div>
  );
}
