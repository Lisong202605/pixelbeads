import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator as CalculatorIcon, Ruler, Grid, ArrowLeft } from 'lucide-react';

export function Calculator() {
  const [boardWidth, setBoardWidth] = useState(29);
  const [boardHeight, setBoardHeight] = useState(29);
  const [beadSize, setBeadSize] = useState(5);

  const totalBeads = boardWidth * boardHeight;
  const widthMm = boardWidth * beadSize;
  const heightMm = boardHeight * beadSize;
  const widthInch = (widthMm / 25.4).toFixed(2);
  const heightInch = (heightMm / 25.4).toFixed(2);

  const boards = [
    { name: 'Small', size: '29×29', beads: 841 },
    { name: 'Medium', size: '58×58', beads: 3364 },
    { name: 'Large', size: '58×86', beads: 4988 },
    { name: 'XL', size: '86×86', beads: 7396 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-red-500 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </div>

      <div className="text-center mb-12">
        <CalculatorIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bead Size Calculator</h1>
        <p className="text-gray-600 text-lg">Calculate project dimensions and bead counts</p>
      </div>

      {/* Calculator */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Board Width (beads)</label>
            <input
              type="number"
              value={boardWidth}
              onChange={(e) => setBoardWidth(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Board Height (beads)</label>
            <input
              type="number"
              value={boardHeight}
              onChange={(e) => setBoardHeight(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bead Size (mm)</label>
            <select
              value={beadSize}
              onChange={(e) => setBeadSize(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value={5}>Standard (5mm)</option>
              <option value={2.6}>Mini (2.6mm)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <Grid className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalBeads.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Beads</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Ruler className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{widthMm}mm</p>
            <p className="text-sm text-gray-600">Width</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Ruler className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{heightMm}mm</p>
            <p className="text-sm text-gray-600">Height</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Ruler className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{widthInch}×{heightInch}"</p>
            <p className="text-sm text-gray-600">Inches</p>
          </div>
        </div>
      </div>

      {/* Board Sizes */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Board Sizes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <div
              key={board.name}
              className="bg-gray-50 rounded-xl p-6 text-center cursor-pointer hover:bg-red-50 transition-colors"
              onClick={() => {
                const [w, h] = board.size.split('×').map(Number);
                setBoardWidth(w);
                setBoardHeight(h);
              }}
            >
              <h3 className="font-semibold text-gray-900 mb-2">{board.name}</h3>
              <p className="text-2xl font-bold text-red-500 mb-1">{board.size}</p>
              <p className="text-sm text-gray-600">{board.beads.toLocaleString()} beads</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
