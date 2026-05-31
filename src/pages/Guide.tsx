import { Link } from 'react-router-dom';
import { Upload, ArrowRight, Check } from 'lucide-react';

export function Guide() {
  const steps = [
    {
      title: 'Choose Your Image',
      content: 'The best images for Perler bead patterns have clear subjects, good contrast, and aren\'t too detailed. Portraits, cartoon characters, and simple landscapes work great.',
      tips: [
        'Use high-contrast images',
        'Avoid overly complex scenes',
        'Clear subjects work best',
        'Good lighting helps accuracy',
      ],
    },
    {
      title: 'Upload to PixelBeads',
      content: 'Go to our Photo to Pattern tool and upload your image. Supported formats include JPG and PNG, up to 10MB.',
      tips: [
        'Drag and drop or click to browse',
        'Maximum file size: 10MB',
        'JPG and PNG supported',
        'Processing happens in your browser',
      ],
    },
    {
      title: 'Customize Your Pattern',
      content: 'Fine-tune your bead pattern with several options including bead brand, grid size, color limit, and dithering.',
      tips: [
        'Choose from Perler, Hama, Artkal, or MARD',
        'Adjust grid width for more/less detail',
        'Control color limit',
        'Apply dithering for smoother transitions',
      ],
    },
    {
      title: 'Export and Print',
      content: 'Download your pattern as a PDF with color chart and bead count. Start creating your bead art!',
      tips: [
        'PDF includes color chart',
        'Exact bead counts provided',
        'Print-ready templates',
        'Grid overlay for easy placement',
      ],
    },
  ];

  const brands = [
    { name: 'Perler', colors: 80, origin: 'USA', popular: true },
    { name: 'Hama', colors: 70, origin: 'Denmark', popular: true },
    { name: 'Artkal', colors: 200, origin: 'China', popular: false },
    { name: 'MARD', colors: 50, origin: 'Japan', popular: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How to Make Perler Bead Patterns from Photos
        </h1>
        <p className="text-gray-600 text-lg">
          A complete beginner guide to converting any photo into beautiful bead patterns
        </p>
      </div>

      {/* What are Perler Beads */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Perler Beads?</h2>
        <p className="text-gray-600 mb-4">
          Perler beads (also known as fuse beads, Hama beads, or iron beads) are small plastic beads 
          that can be arranged on a pegboard to create colorful patterns and designs. Once arranged, 
          the beads are fused together using a household iron, creating a solid piece of pixel-style art.
        </p>
        <p className="text-gray-600">
          Perler bead art has become increasingly popular among crafters, pixel art enthusiasts, 
          and families looking for creative activities. From simple patterns for beginners to complex 
          portraits and anime characters, the possibilities are endless.
        </p>
      </section>

      {/* Steps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Guide</h2>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{step.content}</p>
              <ul className="space-y-2">
                {step.tips.map((tip) => (
                  <li key={tip} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Brands */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported Bead Brands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brands.map((brand) => (
            <div key={brand.name} className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                {brand.popular && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Popular</span>
                )}
              </div>
              <p className="text-gray-600">{brand.colors} colors available</p>
              <p className="text-sm text-gray-500">Made in {brand.origin}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-red-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to try it yourself?</h2>
        <p className="text-gray-600 mb-6">Convert your first photo to a bead pattern in seconds.</p>
        <Link
          to="/image-to-pattern"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors"
        >
          <Upload className="w-5 h-5 mr-2" />
          Start Creating
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </section>
    </div>
  );
}
