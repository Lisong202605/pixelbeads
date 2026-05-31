import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is this Perler bead pattern maker really free?',
      a: 'Yes! PixelBeads is completely free to use. No registration required, no usage limits, no watermarks. We may show ads to support the service, but all core features are free and will remain free.',
    },
    {
      q: 'Do I need to register or sign up?',
      a: 'No registration required. PixelBeads works right in your browser without any account. Just open the website and start creating patterns immediately.',
    },
    {
      q: 'Will PixelBeads become paid in the future?',
      a: 'Currently, PixelBeads is completely free and we have no immediate plans to charge. If we ever introduce premium features in the future, we will notify users 30 days in advance. All currently free features will remain free.',
    },
    {
      q: 'What image formats are supported?',
      a: 'We support JPG and PNG formats up to 10MB. For best results, use images with clear subjects and good contrast. Avoid blurry or low-resolution images.',
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
      a: 'Currently, patterns are saved in your browser\'s local storage. We recommend exporting your patterns as PDF or PNG to keep them permanently.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      <div className="text-center mb-12">
        <HelpCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-lg">
          Everything you need to know about PixelBeads
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-red-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-6">
                <p className="text-gray-600">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
