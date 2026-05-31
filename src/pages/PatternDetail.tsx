import { useParams } from 'react-router-dom';
import { Grid, Heart, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PatternDetail() {
  const { id } = useParams();

  // Mock pattern data
  const pattern = {
    id,
    title: 'Cute Cat Pattern',
    beads: 240,
    colors: 8,
    likes: 156,
    gridSize: '30×40',
    brand: 'Perler',
  };

  const colorChart = [
    { color: '#FF6B6B', name: 'Red', count: 45, code: 'R01' },
    { color: '#4ECDC4', name: 'Teal', count: 32, code: 'T03' },
    { color: '#FFE66D', name: 'Yellow', count: 28, code: 'Y02' },
    { color: '#95E1D3', name: 'Mint', count: 25, code: 'M05' },
    { color: '#F38181', name: 'Pink', count: 38, code: 'P04' },
    { color: '#AA96DA', name: 'Purple', count: 22, code: 'PU01' },
    { color: '#FCBAD3', name: 'Light Pink', count: 30, code: 'LP02' },
    { color: '#2D3436', name: 'Black', count: 20, code: 'BK01' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/gallery"
        className="inline-flex items-center text-gray-600 hover:text-red-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pattern Preview */}
        <div>
          <div className="aspect-square bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-4">
            <Grid className="w-32 h-32 text-red-300" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5 mr-1" />
                {pattern.likes}
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </button>
              <button className="flex items-center px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                PNG
              </button>
            </div>
          </div>
        </div>

        {/* Pattern Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{pattern.title}</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Total Beads</p>
              <p className="text-2xl font-bold text-gray-900">{pattern.beads}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Colors</p>
              <p className="text-2xl font-bold text-gray-900">{pattern.colors}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Grid Size</p>
              <p className="text-2xl font-bold text-gray-900">{pattern.gridSize}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Brand</p>
              <p className="text-2xl font-bold text-gray-900">{pattern.brand}</p>
            </div>
          </div>

          {/* Color Chart */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Color Chart</h2>
          <div className="space-y-2">
            {colorChart.map((item) => (
              <div
                key={item.code}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg border border-gray-200"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.count}</p>
                  <p className="text-sm text-gray-500">beads</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
