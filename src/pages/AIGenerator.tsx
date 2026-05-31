import { useState } from 'react';
import { Wand2, Sparkles, Image, Loader2 } from 'lucide-react';

export function AIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPatterns, setGeneratedPatterns] = useState<string[]>([]);

  const styles = [
    { id: 'cartoon', name: 'Cartoon', icon: '🎨' },
    { id: 'pixel', name: 'Pixel Art', icon: '👾' },
    { id: 'realistic', name: 'Realistic', icon: '📷' },
    { id: 'minimal', name: 'Minimal', icon: '◻️' },
  ];

  const [selectedStyle, setSelectedStyle] = useState('pixel');

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setGeneratedPatterns([
        'Pattern 1',
        'Pattern 2',
        'Pattern 3',
        'Pattern 4',
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Wand2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Bead Pattern Generator
        </h1>
        <p className="text-gray-600 text-lg">
          Describe your design and let AI create a unique bead pattern
        </p>
      </div>

      {/* Prompt Input */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your pattern... e.g., 'cute cat with flowers', 'Mario character', 'sunset over mountains'"
          className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-32 mb-4"
        />

        {/* Style Selector */}
        <div className="flex gap-2 mb-4">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                selectedStyle === style.id
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{style.icon}</span>
              {style.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full flex items-center justify-center px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Pattern
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {generatedPatterns.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Patterns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedPatterns.map((pattern, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{pattern}</p>
                <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Use This Pattern
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
