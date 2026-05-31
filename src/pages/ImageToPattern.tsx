import { useState, useCallback } from 'react';
import { Upload, Image, Settings, Download, Grid, Palette, X } from 'lucide-react';

export function ImageToPattern() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [gridSize, setGridSize] = useState(50);
  const [colorLimit, setColorLimit] = useState(16);
  const [brand, setBrand] = useState('perler');
  const [dithering, setDithering] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const brands = [
    { id: 'perler', name: 'Perler', colors: 80 },
    { id: 'hama', name: 'Hama', colors: 70 },
    { id: 'artkal', name: 'Artkal', colors: 200 },
    { id: 'mard', name: 'MARD', colors: 50 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Photo to Bead Pattern</h1>
        <p className="text-gray-600">Upload an image and convert it to a Perler bead pattern</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Upload & Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload Area */}
          {!uploadedImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                isDragging
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drop or click to upload</p>
              <p className="text-sm text-gray-500 mb-4">JPG/PNG, max 10MB</p>
              <label className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer">
                <Image className="w-4 h-4 mr-2" />
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full rounded-xl"
              />
              <button
                onClick={() => setUploadedImage(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Settings */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </h3>

            {/* Brand */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bead Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.colors} colors)
                  </option>
                ))}
              </select>
            </div>

            {/* Grid Size */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grid Width: {gridSize} cols
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Color Limit */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Limit: {colorLimit}
              </label>
              <input
                type="range"
                min="4"
                max="32"
                value={colorLimit}
                onChange={(e) => setColorLimit(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Dithering */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dithering"
                checked={dithering}
                onChange={(e) => setDithering(e.target.checked)}
                className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
              />
              <label htmlFor="dithering" className="ml-2 text-sm text-gray-700">
                Enable Dithering
              </label>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-2xl p-6 h-full min-h-[400px] flex items-center justify-center">
            {uploadedImage ? (
              <div className="text-center">
                <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Pattern preview will appear here</p>
                <p className="text-sm text-gray-400 mt-2">
                  {gridSize} cols × {Math.round(gridSize * 1.2)} rows • {colorLimit} colors
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload an image to see the pattern preview</p>
              </div>
            )}
          </div>

          {/* Export Bar */}
          {uploadedImage && (
            <div className="mt-4 flex gap-4">
              <button className="flex-1 flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Export PDF
              </button>
              <button className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Export PNG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
