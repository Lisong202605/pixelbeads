import { Grid, Heart, Shield, Zap } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Grid className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About PixelBeads</h1>
        <p className="text-gray-600 text-lg">
          The free online Perler bead pattern generator for crafters and pixel art enthusiasts
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          PixelBeads is a free online tool designed to help crafters, pixel art enthusiasts, and 
          anyone who loves fuse beads create beautiful Perler bead patterns from photos and AI prompts.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          We believe everyone should have access to high-quality bead pattern creation tools. 
          Whether you're a beginner looking to create your first pattern or an experienced crafter 
          working on complex designs, PixelBeads provides the features you need.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-start">
            <Zap className="w-6 h-6 text-red-500 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Instant Processing</h3>
              <p className="text-gray-600">Convert photos to patterns in seconds</p>
            </div>
          </div>
          <div className="flex items-start">
            <Shield className="w-6 h-6 text-red-500 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Privacy First</h3>
              <p className="text-gray-600">All processing happens in your browser</p>
            </div>
          </div>
          <div className="flex items-start">
            <Heart className="w-6 h-6 text-red-500 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Free Forever</h3>
              <p className="text-gray-600">No cost, no signup required</p>
            </div>
          </div>
          <div className="flex items-start">
            <Grid className="w-6 h-6 text-red-500 mr-3 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900">Multi-Brand Support</h3>
              <p className="text-gray-600">Perler, Hama, Artkal, and MARD palettes</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Technology</h2>
        <p className="text-gray-600 mb-6">
          We use the CIEDE2000 color difference algorithm for the most accurate color matching 
          between your images and available bead colors. This ensures your patterns look as close 
          to the original as possible.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact</h2>
        <p className="text-gray-600">
          Have questions or feedback? We'd love to hear from you at{' '}
          <a href="mailto:hello@pixelbeads.design" className="text-red-500 hover:underline">
            hello@pixelbeads.design
          </a>
        </p>
      </div>
    </div>
  );
}
