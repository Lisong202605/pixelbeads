import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, ImageIcon, Settings, Download, Grid, Palette, X, Loader2 } from 'lucide-react';

const API_URL = 'https://pixelbeads-api.lisong20260508.workers.dev';

export function ImageToPattern() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [gridSize, setGridSize] = useState(50);
  const [colorLimit, setColorLimit] = useState(16);
  const [brand, setBrand] = useState('perler');
  const [dithering, setDithering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [patternResult, setPatternResult] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        setUploadedFile(file);
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
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Process image via API
  const processImage = useCallback(async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);
      formData.append('gridWidth', gridSize.toString());
      formData.append('colorLimit', colorLimit.toString());
      formData.append('brand', brand);

      const response = await fetch(`${API_URL}/api/process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const result = await response.json();
      setPatternResult(result);
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback to client-side processing
      processClientSide();
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedFile, gridSize, colorLimit, brand]);

  // Client-side processing fallback
  const processClientSide = useCallback(() => {
    if (!uploadedImage || !canvasRef.current) return;
    
    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      
      const aspectRatio = img.width / img.height;
      const pixelWidth = gridSize;
      const pixelHeight = Math.round(pixelWidth / aspectRatio);
      
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      
      ctx.drawImage(img, 0, 0, pixelWidth, pixelHeight);
      
      const imageData = ctx.getImageData(0, 0, pixelWidth, pixelHeight);
      const data = imageData.data;
      
      // Simple color quantization
      const colorMap = new Map<string, number>();
      
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const color = `rgb(${r},${g},${b})`;
        colorMap.set(color, (colorMap.get(color) || 0) + 1);
      }
      
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, colorLimit)
        .map(([color]) => color);
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        let nearestColor = sortedColors[0];
        let minDistance = Infinity;
        
        for (const color of sortedColors) {
          const match = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
          if (match) {
            const cr = parseInt(match[1]);
            const cg = parseInt(match[2]);
            const cb = parseInt(match[3]);
            const distance = Math.sqrt(
              Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestColor = color;
            }
          }
        }
        
        const match = nearestColor.match(/rgb\((\d+),(\d+),(\d+)\)/);
        if (match) {
          data[i] = parseInt(match[1]);
          data[i + 1] = parseInt(match[2]);
          data[i + 2] = parseInt(match[3]);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Scale up for display
      const displayCanvas = document.createElement('canvas');
      const displayCtx = displayCanvas.getContext('2d')!;
      const scale = Math.min(600 / pixelWidth, 600 / pixelHeight);
      displayCanvas.width = pixelWidth * scale;
      displayCanvas.height = pixelHeight * scale;
      displayCtx.imageSmoothingEnabled = false;
      displayCtx.drawImage(canvas, 0, 0, displayCanvas.width, displayCanvas.height);
      
      canvas.width = displayCanvas.width;
      canvas.height = displayCanvas.height;
      ctx.drawImage(displayCanvas, 0, 0);
      
      setIsProcessing(false);
    };
    img.src = uploadedImage;
  }, [uploadedImage, gridSize, colorLimit]);

  // Auto-process when image is uploaded
  useEffect(() => {
    if (uploadedImage && uploadedFile) {
      processImage();
    }
  }, [uploadedImage, uploadedFile]);

  const brands = [
    { id: 'perler', name: 'Perler', colors: 80 },
    { id: 'hama', name: 'Hama', colors: 70 },
    { id: 'artkal', name: 'Artkal', colors: 200 },
    { id: 'mard', name: 'MARD', colors: 50 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
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
                <ImageIcon className="w-4 h-4 mr-2" />
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
                onClick={() => {
                  setUploadedImage(null);
                  setUploadedFile(null);
                  setPatternResult(null);
                }}
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

            {/* Reprocess Button */}
            {uploadedImage && (
              <button
                onClick={processImage}
                disabled={isProcessing}
                className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Grid className="w-4 h-4 mr-2" />
                    Generate Pattern
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
            {uploadedImage ? (
              <div className="text-center">
                {isProcessing ? (
                  <div>
                    <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-500">Processing...</p>
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    className="max-w-full rounded-lg shadow-lg"
                    style={{ imageRendering: 'pixelated' }}
                  />
                )}
              </div>
            ) : (
              <div className="text-center">
                <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload an image to see the pattern preview</p>
              </div>
            )}
          </div>

          {/* Color Chart */}
          {patternResult?.colorChart && (
            <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Color Chart</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {patternResult.colorChart.map((color: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-200"
                      style={{ backgroundColor: `rgb(${color.rgb.join(',')})` }}
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{color.name}</p>
                      <p className="text-gray-500">{color.count} beads</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Bar */}
          {uploadedImage && !isProcessing && (
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
