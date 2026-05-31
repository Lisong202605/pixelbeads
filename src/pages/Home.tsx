import { Link } from 'react-router-dom';
import { Image, Grid, Calculator, Palette, Upload, ArrowRight } from 'lucide-react';

export function Home() {
  const mainFeatures = [
    {
      icon: Image,
      title: 'Photo to Pattern',
      description: 'Upload any photo and convert it into a pixel-perfect Perler bead pattern. Supports JPG and PNG up to 10MB.',
      to: '/image-to-pattern',
      color: 'bg-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Grid,
      title: 'Pattern Editor',
      description: 'Create and edit bead patterns from scratch. Draw pixel by pixel with our easy-to-use grid editor.',
      to: '/editor',
      color: 'bg-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Calculator,
      title: 'Bead Calculator',
      description: 'Calculate exactly how many beads you need for your project. Choose board size and get bead counts.',
      to: '/calculator',
      color: 'bg-purple-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Palette,
      title: 'Color Guide',
      description: 'Browse color charts for Perler, Hama, Artkal, and MARD beads. Find the perfect match for your project.',
      to: '/guide',
      color: 'bg-orange-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  const faqs = [
    {
      q: 'Is this Perler bead pattern maker free or paid?',
      a: 'Currently free and no registration required. PixelBeads is committed to providing the best free Perler bead tool. If there are any paid plans in the future, we will notify users in advance.',
    },
    {
      q: 'What image formats are supported?',
      a: 'We support JPG and PNG formats up to 10MB. For best results, use images with clear subjects and good contrast.',
    },
    {
      q: 'Can I print the bead pattern?',
      a: 'Absolutely! Export your pattern as a PDF with a complete color chart and bead count. Perfect for printing.',
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
              Convert photos to bead patterns instantly. No signup required.
            </p>
            <Link
              to="/image-to-pattern"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload & Create Pattern
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features - 4 Core Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create beautiful Perler bead patterns
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainFeatures.map((feature) => (
              <Link
                key={feature.title}
                to={feature.to}
                className="group p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {feature.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-red-500">
                      Try it now
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Upload Photo</h3>
              <p className="text-gray-600">Choose any JPG or PNG image up to 10MB</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Customize</h3>
              <p className="text-gray-600">Select bead brand, grid size, and colors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Export</h3>
              <p className="text-gray-600">Download as PDF or PNG with color chart</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About PixelBeads
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              PixelBeads is a free online Perler bead pattern generator designed for crafters, 
              pixel art enthusiasts, and anyone who loves fuse beads. Our tool converts your photos 
              into accurate bead patterns with support for multiple bead brands.
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
