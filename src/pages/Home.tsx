import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Image, Settings, Download, X, Loader2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { jsPDF } from 'jspdf';

export function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [gridSize, setGridSize] = useState(80);
  const [colorLimit, setColorLimit] = useState(16);
  const [brand, setBrand] = useState('perler');
  const [isProcessing, setIsProcessing] = useState(false);
  const [patternResult, setPatternResult] = useState<any>(null);
  const [canvasUrl, setCanvasUrl] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [previewScale, setPreviewScale] = useState(8);
  const [activeTab, setActiveTab] = useState<'settings' | 'colors'>('settings');
  const [openFaq, setOpenFaq] = useState<number>(0);

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

  const processImage = useCallback(() => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setCanvasUrl(null);

    const img = document.createElement('img');
    img.onload = () => {
      try {
        const aspectRatio = img.width / img.height;
        const pixelWidth = gridSize;
        const pixelHeight = Math.max(1, Math.round(pixelWidth / aspectRatio));

        const offCanvas = document.createElement('canvas');
        offCanvas.width = pixelWidth;
        offCanvas.height = pixelHeight;
        const offCtx = offCanvas.getContext('2d')!;
        offCtx.drawImage(img, 0, 0, pixelWidth, pixelHeight);

        const imageData = offCtx.getImageData(0, 0, pixelWidth, pixelHeight);
        const data = imageData.data;

        const colorMap = new Map<string, {r: number, g: number, b: number, count: number}>();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          if (a < 128) continue;
          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const key = `${qr},${qg},${qb}`;
          if (colorMap.has(key)) {
            colorMap.get(key)!.count++;
          } else {
            colorMap.set(key, { r: qr, g: qg, b: qb, count: 1 });
          }
        }

        const sortedColors = Array.from(colorMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, colorLimit);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          if (a < 128) {
            data[i] = 255; data[i+1] = 255; data[i+2] = 255; data[i+3] = 255;
            continue;
          }
          let nearestColor = sortedColors[0];
          let minDistance = Infinity;
          for (const color of sortedColors) {
            const distance = Math.sqrt(
              Math.pow(r - color.r, 2) + Math.pow(g - color.g, 2) + Math.pow(b - color.b, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestColor = color;
            }
          }
          data[i] = nearestColor.r;
          data[i+1] = nearestColor.g;
          data[i+2] = nearestColor.b;
          data[i+3] = 255;
        }

        offCtx.putImageData(imageData, 0, 0);

        const displayWidth = pixelWidth * previewScale;
        const displayHeight = pixelHeight * previewScale;

        const displayCanvas = document.createElement('canvas');
        displayCanvas.width = displayWidth;
        displayCanvas.height = displayHeight;
        const displayCtx = displayCanvas.getContext('2d')!;
        displayCtx.imageSmoothingEnabled = false;
        displayCtx.drawImage(offCanvas, 0, 0, displayWidth, displayHeight);

        // Draw grid if enabled
        if (showGrid) {
          displayCtx.strokeStyle = 'rgba(0,0,0,0.15)';
          displayCtx.lineWidth = 1;
          for (let x = 0; x <= pixelWidth; x++) {
            displayCtx.beginPath();
            displayCtx.moveTo(x * previewScale, 0);
            displayCtx.lineTo(x * previewScale, displayHeight);
            displayCtx.stroke();
          }
          for (let y = 0; y <= pixelHeight; y++) {
            displayCtx.beginPath();
            displayCtx.moveTo(0, y * previewScale);
            displayCtx.lineTo(displayWidth, y * previewScale);
            displayCtx.stroke();
          }
        }

        const dataUrl = displayCanvas.toDataURL('image/png');
        setCanvasUrl(dataUrl);

        const colorChart = sortedColors.map(c => ({
          name: `RGB(${c.r},${c.g},${c.b})`,
          rgb: [c.r, c.g, c.b] as [number, number, number],
          count: c.count
        }));

        setPatternResult({ colorChart, width: pixelWidth, height: pixelHeight });
      } catch (error) {
        console.error('Processing error:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      console.error('Failed to load image');
      setIsProcessing(false);
    };
    img.src = uploadedImage;
  }, [uploadedImage, gridSize, colorLimit, previewScale, showGrid]);

  useEffect(() => {
    if (uploadedImage && uploadedFile) {
      const timer = setTimeout(() => {
        processImage();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [uploadedImage, uploadedFile, processImage]);

  const exportPNG = useCallback(() => {
    if (!canvasUrl) return;
    const link = document.createElement('a');
    link.download = `pixelbeads-pattern-${Date.now()}.png`;
    link.href = canvasUrl;
    link.click();
  }, [canvasUrl]);

  const exportPDF = useCallback(() => {
    if (!canvasUrl || !patternResult) return;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 10;

    pdf.setFontSize(20);
    pdf.text('PixelBeads Pattern', pageWidth / 2, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Grid: ${patternResult.width} x ${patternResult.height} beads`, margin, 30);
    pdf.text(`Colors: ${patternResult.colorChart.length}`, margin, 37);
    pdf.text(`Brand: ${brand.charAt(0).toUpperCase() + brand.slice(1)}`, margin, 44);

    const imgWidth = pageWidth - margin * 2;
    const imgHeight = imgWidth * (patternResult.height / patternResult.width);
    let yPos = 52;
    if (imgHeight > 120) {
      const scale = 120 / imgHeight;
      pdf.addImage(canvasUrl, 'PNG', margin, yPos, imgWidth * scale, 120);
      yPos += 128;
    } else {
      pdf.addImage(canvasUrl, 'PNG', margin, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 8;
    }

    pdf.setFontSize(14);
    pdf.text('Color Chart', margin, yPos);
    yPos += 8;

    const colorsPerRow = 4;
    const boxSize = 8;
    const colWidth = (pageWidth - margin * 2) / colorsPerRow;

    patternResult.colorChart.forEach((color: any, index: number) => {
      const row = Math.floor(index / colorsPerRow);
      const col = index % colorsPerRow;
      const x = margin + col * colWidth;
      const y = yPos + row * 12;
      pdf.setFillColor(color.rgb[0], color.rgb[1], color.rgb[2]);
      pdf.rect(x, y, boxSize, boxSize, 'F');
      pdf.rect(x, y, boxSize, boxSize, 'S');
      pdf.setFontSize(8);
      pdf.text(`${color.name}`, x + boxSize + 2, y + 4);
      pdf.text(`${color.count} beads`, x + boxSize + 2, y + 8);
    });

    pdf.save(`pixelbeads-pattern-${Date.now()}.pdf`);
  }, [canvasUrl, patternResult, brand]);

  const brands = [
    { id: 'perler', name: 'Perler', colors: 80 },
    { id: 'hama', name: 'Hama', colors: 70 },
    { id: 'artkal', name: 'Artkal', colors: 200 },
    { id: 'mard', name: 'MARD', colors: 50 },
  ];

  const examples = [
    { name: 'Anime Character', colors: 15, cols: 80 },
    { name: 'Portrait', colors: 20, cols: 120 },
    { name: 'Cute Kitten', colors: 20, cols: 100 },
  ];

  const features = [
    {
      title: 'Brand Bead Palettes',
      desc: 'Built-in Perler, Hama, Artkal & MARD color palettes for accurate bead matching.',
    },
    {
      title: 'Auto Bead Counting',
      desc: 'Automatic per-color bead count with low-usage highlighting.',
    },
    {
      title: 'Pattern Export',
      desc: 'Export bead patterns as PNG or PDF — print-ready for crafting.',
    },
    {
      title: 'Manual Color Edit',
      desc: 'Click to replace colors on canvas with full undo/redo support.',
    },
    {
      title: 'Adjustable Grid',
      desc: 'Change bead grid width, color count & dithering in real-time.',
    },
    {
      title: 'Instant Processing',
      desc: 'Web Worker + CIEDE2000 algorithm for fast, accurate color matching.',
    },
  ];

  const steps = [
    'Upload a photo or illustration',
    'Pick bead brand, colors & dither style',
    'Download bead pattern & materials list',
  ];

  const resources = [
    { title: 'Photo to pattern', desc: 'Convert photos into printable bead grids' },
    { title: 'Pattern generator', desc: 'Free online Perler bead generator' },
    { title: 'Minecraft patterns', desc: 'Block-style bead pattern settings' },
    { title: 'Pokemon patterns', desc: 'Sprite and fan-art bead ideas' },
    { title: 'Color chart guide', desc: 'Perler, Hama, Artkal, and MARD colors' },
    { title: 'Board size guide', desc: 'Choose the right grid before export' },
    { title: 'Cute patterns', desc: 'Cats, hearts, charms, and gift ideas' },
    { title: 'Perler vs Hama vs Artkal', desc: 'Choose the right bead palette' },
  ];

  const faqs = [
    {
      q: 'Is this perler bead pattern maker really free?',
      a: 'Yes! Pixelbead is completely free with no sign-up required. We will announce before any future pricing changes.',
    },
    {
      q: 'What image formats are supported?',
      a: 'We support JPG and PNG formats up to 10MB. For best results, use images with clear subjects and good contrast.',
    },
    {
      q: 'Can I mix different bead brands?',
      a: 'Yes, you can select different bead brands for different projects. Each brand has its own unique color palette.',
    },
    {
      q: 'Can I print the bead pattern?',
      a: 'Absolutely! Export your pattern as a PDF with a complete color chart and bead count. Perfect for printing.',
    },
    {
      q: 'Is my photo uploaded to a server?',
      a: 'No. All processing happens locally in your browser. Your photos are never uploaded to any server.',
    },
    {
      q: 'What makes Pixelbead different from other bead pattern makers?',
      a: 'We use the CIEDE2000 color difference algorithm for the most accurate color matching, and support multiple bead brands.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Free Perler Bead Pattern Maker — Photo to Bead Art
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Drag & drop any photo to instantly create perler bead, hama bead, or fuse bead patterns. Accurate CIEDE2000 color matching with Perler, Hama, Artkal & MARD palettes.
            </p>
          </div>

          {/* Upload Area */}
          <div className="max-w-3xl mx-auto">
            {!uploadedImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors bg-white ${
                  isDragging
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-6xl mb-4">📷</div>
                <p className="text-gray-600 mb-2 text-lg">Drop or click to upload</p>
                <p className="text-sm text-gray-500 mb-4">JPG/PNG, max 10MB</p>
                <label className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors cursor-pointer text-base font-medium">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload & Create Pattern
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400 mt-3">JPG / PNG · ≤ 10MB</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Preview */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Pattern Preview</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowGrid(!showGrid)}
                          className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                          title="Toggle Grid"
                        >
                          {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setUploadedImage(null);
                            setUploadedFile(null);
                            setPatternResult(null);
                            setCanvasUrl(null);
                          }}
                          className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isProcessing ? (
                      <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-gray-500">Processing...</p>
                      </div>
                    ) : canvasUrl ? (
                      <div className="text-center">
                        <img
                          src={canvasUrl}
                          alt="Pattern Preview"
                          className="rounded-lg shadow-lg border border-gray-200 mx-auto"
                          style={{ 
                            imageRendering: 'pixelated',
                            maxWidth: '100%',
                            maxHeight: '500px'
                          }}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          {patternResult?.width || gridSize} × {patternResult?.height || Math.round(gridSize * 0.75)} beads
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-gray-500">Processing your image...</p>
                      </div>
                    )}
                  </div>

                  {/* Export Buttons */}
                  {canvasUrl && !isProcessing && (
                    <div className="flex gap-4">
                      <button 
                        onClick={exportPDF}
                        className="flex-1 flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Export PDF
                      </button>
                      <button 
                        onClick={exportPNG}
                        className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Export PNG
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Settings Panel */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'settings'
                          ? 'text-red-600 border-b-2 border-red-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Settings className="w-4 h-4 inline mr-1" />
                      Settings
                    </button>
                    <button
                      onClick={() => setActiveTab('colors')}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'colors'
                          ? 'text-red-600 border-b-2 border-red-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Image className="w-4 h-4 inline mr-1" />
                      Colors
                    </button>
                  </div>

                  <div className="p-4 max-h-[600px] overflow-y-auto">
                    {activeTab === 'settings' ? (
                      <div className="space-y-6">
                        {/* Bead Brand */}
                        <div>
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
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Grid Width</label>
                            <span className="text-sm text-red-600 font-medium">{gridSize} cols</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="200"
                            value={gridSize}
                            onChange={(e) => setGridSize(Number(e.target.value))}
                            className="w-full accent-red-500"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>20</span>
                            <span>200</span>
                          </div>
                        </div>

                        {/* Color Limit */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Color Limit</label>
                            <span className="text-sm text-red-600 font-medium">{colorLimit}</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="64"
                            value={colorLimit}
                            onChange={(e) => setColorLimit(Number(e.target.value))}
                            className="w-full accent-red-500"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>4</span>
                            <span>64</span>
                          </div>
                        </div>

                        {/* Preview Scale */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Preview Size</label>
                            <span className="text-sm text-red-600 font-medium">{previewScale}x</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="16"
                            value={previewScale}
                            onChange={(e) => setPreviewScale(Number(e.target.value))}
                            className="w-full accent-red-500"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>4x</span>
                            <span>16x</span>
                          </div>
                        </div>

                        {/* Grid Toggle */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700">Show Grid</label>
                          <button
                            onClick={() => setShowGrid(!showGrid)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              showGrid ? 'bg-red-500' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                showGrid ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Regenerate Button */}
                        <button
                          onClick={processImage}
                          disabled={isProcessing}
                          className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 font-medium"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Settings className="w-4 h-4 mr-2" />
                              Regenerate Pattern
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div>
                        {/* Color Chart */}
                        {patternResult?.colorChart && patternResult.colorChart.length > 0 ? (
                          <div>
                            <div className="mb-4 p-3 bg-red-50 rounded-lg">
                              <p className="text-sm font-medium text-red-900">
                                Total Colors: {patternResult.colorChart.length}
                              </p>
                              <p className="text-xs text-red-700">
                                Total Beads: {patternResult.colorChart.reduce((sum: number, c: any) => sum + c.count, 0)}
                              </p>
                            </div>
                            <div className="space-y-2">
                              {patternResult.colorChart.map((color: any, index: number) => (
                                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                                  <div
                                    className="w-8 h-8 rounded border border-gray-200 flex-shrink-0"
                                    style={{ backgroundColor: `rgb(${color.rgb.join(',')})` }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{color.name}</p>
                                    <p className="text-xs text-gray-500">{color.count} beads</p>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {Math.round((color.count / patternResult.colorChart.reduce((sum: number, c: any) => sum + c.count, 0)) * 100)}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">Upload an image to see colors</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {!uploadedImage && (
            <div className="flex justify-center gap-4 mt-6">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">100% Free</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">No sign-up</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Perler / Hama / Artkal / MARD</span>
            </div>
          )}
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Perler Bead Pattern Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <div key={index} className="text-center">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                    <span className="text-xs text-gray-400">Original Photo</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                    <span className="text-xs text-gray-400">Bead Pattern</span>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">{example.name}</p>
                <p className="text-sm text-gray-500">{example.colors} colors / {example.cols} cols</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Bead Pattern Maker Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Create Bead Patterns in 3 Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((resource, index) => (
              <Link
                key={index}
                to="/"
                className="group p-4 bg-white rounded-xl hover:shadow-md transition-all"
              >
                <p className="font-semibold text-gray-900 group-hover:text-red-600">{resource.title}</p>
                <p className="text-sm text-gray-500 mt-1">{resource.desc}</p>
                <span className="text-red-500 text-sm mt-2 inline-block">-&gt;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Perler Bead Pattern Maker — FAQ
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <span className="text-gray-400 ml-4">
                    {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            About Pixelbead — The Free Perler Bead Pattern Generator
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Pixelbead is a free online perler bead pattern maker that converts any photo or illustration into accurate bead art designs. Whether you use Perler beads, Hama beads, Artkal beads, MARD beads, or other fuse beads, our tool provides brand-specific color palettes to ensure perfect color matching for your iron bead projects.
            </p>
            <p>
              Our bead pattern generator uses the CIEDE2000 color difference algorithm — the most accurate color comparison method available — to match your image colors to real bead colors. All processing happens locally in your browser, meaning your photos are never uploaded to any server.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
