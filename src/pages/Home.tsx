import { Link } from 'react-router-dom';
import { Image, Wand2, Grid, Download, ArrowRight } from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: Image,
      title: 'Image to Pattern',
      description: 'Upload any image and convert it to a Perler bead pattern instantly.',
      link: '/image-to-pattern',
    },
    {
      icon: Wand2,
      title: 'AI Generator',
      description: 'Describe your design and let AI create a unique bead pattern for you.',
      link: '/ai-generator',
    },
    {
      icon: Download,
      title: 'Export & Print',
      description: 'Download your patterns as PDF, PNG, or SVG with color charts.',
      link: '/patterns',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Free Perler Bead
              <br />
              <span className="text-primary">Pattern Maker</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create beautiful bead patterns from images or AI prompts. 
              Multi-brand color matching, printable templates, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/image-to-pattern"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                <Image className="w-5 h-5 mr-2" />
                Upload Image
              </Link>
              <Link
                to="/ai-generator"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-base font-medium rounded-lg text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                AI Generator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="group p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <span className="inline-flex items-center text-primary font-medium">
                  Try it now
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-100 transition-colors"
          >
            <Grid className="w-5 h-5 mr-2" />
            Start Creating
          </Link>
        </div>
      </section>
    </div>
  );
}
