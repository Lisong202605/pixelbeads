import { useState } from 'react';
import { Grid, Undo, Redo, Download, ZoomIn, ZoomOut, Palette, Brush, Eraser, PaintBucket } from 'lucide-react';

export function Editor() {
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [zoom, setZoom] = useState(100);

  const tools = [
    { id: 'brush', name: 'Brush', icon: Brush },
    { id: 'fill', name: 'Fill', icon: PaintBucket },
    { id: 'eraser', name: 'Eraser', icon: Eraser },
  ];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
    '#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2',
    '#2D3436', '#636E72', '#B2BEC3', '#DFE6E9',
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-2 rounded-lg transition-colors ${
                selectedTool === tool.id
                  ? 'bg-red-100 text-red-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={tool.name}
            >
              <tool.icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Undo className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Redo className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button
            onClick={() => setZoom(Math.max(50, zoom - 25))}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto">
          <div
            className="bg-white shadow-lg"
            style={{
              width: `${zoom * 3}px`,
              height: `${zoom * 3}px`,
            }}
          >
            <Grid className="w-full h-full text-gray-200" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-white border-l border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Color Palette
          </h3>

          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  selectedColor === color
                    ? 'border-gray-900 scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Selected Color</h4>
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded border border-gray-200"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-sm text-gray-600">{selectedColor}</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Pattern Info</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Size: 50 × 60 beads</p>
              <p>Colors: 12</p>
              <p>Total: 3,000 beads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
