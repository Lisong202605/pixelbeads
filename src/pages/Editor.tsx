import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, ArrowLeft, RotateCcw } from 'lucide-react';

interface ColorInfo {
  id: string;
  code: string;
  name: string;
  rgb: [number, number, number];
  count: number;
  enabled: boolean;
}

export function Editor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState<string | null>(null);

  // Parameters
  const [gridWidth, setGridWidth] = useState(140);
  const [maxColors, setMaxColors] = useState(40);
  const [fineProcessing, setFineProcessing] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [minColorThreshold, setMinColorThreshold] = useState(0);
  const [grainEffect, setGrainEffect] = useState('pixel');

  // Brand
  const [selectedBrand, setSelectedBrand] = useState('perler');

  // View
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);

  // Colors
  const [colorSort, setColorSort] = useState('count');
  const [colors, setColors] = useState<ColorInfo[]>([]);

  // Manual paint
  const [paintMode, setPaintMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const brands = [
    { id: 'perler', name: 'Perler', type: '硬质' },
    { id: 'artkal-s', name: 'Artkal S', type: '硬质' },
    { id: 'artkal-c', name: 'Artkal C', type: '硬质' },
    { id: 'artkal-r', name: 'Artkal R', type: '软质' },
    { id: 'mard', name: 'MARD', type: '硬质' },
    { id: 'hama', name: 'Hama', type: '硬质' },
  ];

  const grainOptions = [
    { id: 'pixel', name: '卡通/像素 · 干净色块' },
    { id: 'smooth', name: '平滑点阵 · 天空背景' },
    { id: 'soft', name: '柔和渐变 · 保细节' },
  ];

  // Perler color palette (sample)
  const perlerColors: ColorInfo[] = [
    { id: 'P01', code: '80-15179', name: 'Evergreen', rgb: [0, 128, 0], count: 0, enabled: true },
    { id: 'P02', code: '80-15181', name: 'Light Grey', rgb: [200, 200, 200], count: 0, enabled: true },
    { id: 'P03', code: '80-15182', name: '薰衣草', rgb: [200, 150, 200], count: 0, enabled: true },
    { id: 'P04', code: '80-15199', name: 'Shamrock', rgb: [0, 200, 100], count: 0, enabled: true },
    { id: 'P05', code: '80-15200', name: 'Cobalt', rgb: [0, 50, 150], count: 0, enabled: true },
    { id: 'P06', code: '80-15201', name: 'Midnight', rgb: [20, 20, 60], count: 0, enabled: true },
    { id: 'P07', code: '80-15202', name: "Robin's Egg", rgb: [100, 200, 220], count: 0, enabled: true },
    { id: 'P08', code: '80-15203', name: 'Flamingo', rgb: [255, 150, 180], count: 0, enabled: true },
    { id: 'P09', code: '80-15204', name: 'Salmon', rgb: [255, 150, 130], count: 0, enabled: true },
    { id: 'P10', code: '80-15205', name: 'Fawn', rgb: [200, 170, 130], count: 0, enabled: true },
    { id: 'P11', code: '80-15206', name: 'Pewter', rgb: [150, 150, 160], count: 0, enabled: true },
    { id: 'P12', code: '80-15207', name: 'Charcoal', rgb: [60, 60, 60], count: 0, enabled: true },
    { id: 'P13', code: '80-15208', name: 'Toasted Marshmallow', rgb: [240, 220, 180], count: 0, enabled: true },
    { id: 'P14', code: '80-15210', name: 'Orchid', rgb: [200, 120, 200], count: 0, enabled: true },
    { id: 'P15', code: '80-15211', name: 'Tomato', rgb: [255, 80, 60], count: 0, enabled: true },
    { id: 'P16', code: '80-15212', name: 'Spice', rgb: [200, 100, 50], count: 0, enabled: true },
    { id: 'P17', code: '80-15213', name: 'Apricot', rgb: [255, 200, 150], count: 0, enabled: true },
    { id: 'P18', code: '80-15214', name: 'Sherbet', rgb: [255, 180, 160], count: 0, enabled: true },
    { id: 'P19', code: '80-15215', name: 'Mist', rgb: [200, 210, 220], count: 0, enabled: true },
    { id: 'P20', code: '80-15216', name: 'Sky', rgb: [100, 180, 255], count: 0, enabled: true },
    { id: 'P21', code: '80-15217', name: 'Lagoon', rgb: [0, 150, 180], count: 0, enabled: true },
    { id: 'P22', code: '80-15218', name: 'Teal', rgb: [0, 130, 130], count: 0, enabled: true },
    { id: 'P23', code: '80-15219', name: 'Fern', rgb: [80, 160, 80], count: 0, enabled: true },
    { id: 'P24', code: '80-15220', name: 'Olive', rgb: [120, 130, 50], count: 0, enabled: true },
    { id: 'P25', code: '80-15961', name: 'Cherry', rgb: [200, 30, 60], count: 0, enabled: true },
    { id: 'P26', code: '80-19001', name: '白', rgb: [255, 255, 255], count: 0, enabled: true },
    { id: 'P27', code: '80-19002', name: 'Creme', rgb: [255, 240, 210], count: 0, enabled: true },
    { id: 'P28', code: '80-19003', name: '黄', rgb: [255, 220, 0], count: 0, enabled: true },
    { id: 'P29', code: '80-19004', name: '橙', rgb: [255, 150, 0], count: 0, enabled: true },
    { id: 'P30', code: '80-19005', name: '红', rgb: [220, 30, 30], count: 0, enabled: true },
    { id: 'P31', code: '80-19006', name: 'Bubblegum', rgb: [255, 150, 200], count: 0, enabled: true },
    { id: 'P32', code: '80-19007', name: '紫', rgb: [150, 50, 200], count: 0, enabled: true },
    { id: 'P33', code: '80-19008', name: '深蓝', rgb: [30, 50, 150], count: 0, enabled: true },
    { id: 'P34', code: '80-19009', name: '浅蓝', rgb: [150, 200, 255], count: 0, enabled: true },
    { id: 'P35', code: '80-19010', name: '深绿', rgb: [0, 100, 50], count: 0, enabled: true },
    { id: 'P36', code: '80-19011', name: '浅绿', rgb: [150, 255, 150], count: 0, enabled: true },
    { id: 'P37', code: '80-19012', name: '棕', rgb: [150, 100, 50], count: 0, enabled: true },
    { id: 'P38', code: '80-19017', name: '灰', rgb: [150, 150, 150], count: 0, enabled: true },
    { id: 'P39', code: '80-19018', name: '黑', rgb: [30, 30, 30], count: 0, enabled: true },
    { id: 'P40', code: '80-19020', name: '铁锈红', rgb: [180, 60, 30], count: 0, enabled: true },
  ];

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
        const pixelWidth = gridWidth;
        const pixelHeight = Math.max(1, Math.round(pixelWidth / aspectRatio));

        const offCanvas = document.createElement('canvas');
        offCanvas.width = pixelWidth;
        offCanvas.height = pixelHeight;
        const offCtx = offCanvas.getContext('2d')!;
        offCtx.drawImage(img, 0, 0, pixelWidth, pixelHeight);

        const imageData = offCtx.getImageData(0, 0, pixelWidth, pixelHeight);
        const data = imageData.data;

        // Simple color quantization
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
          .slice(0, maxColors);

        // Map to nearest Perler color
        const usedColors: ColorInfo[] = [];
        sortedColors.forEach((sc, idx) => {
          const perlerColor = perlerColors[idx % perlerColors.length];
          usedColors.push({
            ...perlerColor,
            count: sc.count,
            rgb: [sc.r, sc.g, sc.b] as [number, number, number]
          });
        });

        // Replace colors in image
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          if (a < 128) {
            data[i] = 255; data[i+1] = 255; data[i+2] = 255; data[i+3] = 255;
            continue;
          }
          let nearestIdx = 0;
          let minDistance = Infinity;
          sortedColors.forEach((sc, idx) => {
            const distance = Math.sqrt(
              Math.pow(r - sc.r, 2) + Math.pow(g - sc.g, 2) + Math.pow(b - sc.b, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestIdx = idx;
            }
          });
          const nearest = sortedColors[nearestIdx];
          data[i] = nearest.r;
          data[i+1] = nearest.g;
          data[i+2] = nearest.b;
          data[i+3] = 255;
        }

        offCtx.putImageData(imageData, 0, 0);

        // Create display canvas
        const displayScale = 8;
        const displayWidth = pixelWidth * displayScale;
        const displayHeight = pixelHeight * displayScale;

        const displayCanvas = document.createElement('canvas');
        displayCanvas.width = displayWidth;
        displayCanvas.height = displayHeight;
        const displayCtx = displayCanvas.getContext('2d')!;
        displayCtx.imageSmoothingEnabled = false;
        displayCtx.drawImage(offCanvas, 0, 0, displayWidth, displayHeight);

        // Draw grid
        if (showGrid) {
          displayCtx.strokeStyle = 'rgba(0,0,0,0.15)';
          displayCtx.lineWidth = 1;
          for (let x = 0; x <= pixelWidth; x++) {
            displayCtx.beginPath();
            displayCtx.moveTo(x * displayScale, 0);
            displayCtx.lineTo(x * displayScale, displayHeight);
            displayCtx.stroke();
          }
          for (let y = 0; y <= pixelHeight; y++) {
            displayCtx.beginPath();
            displayCtx.moveTo(0, y * displayScale);
            displayCtx.lineTo(displayWidth, y * displayScale);
            displayCtx.stroke();
          }
        }

        const dataUrl = displayCanvas.toDataURL('image/png');
        setCanvasUrl(dataUrl);
        setColors(usedColors);

        // Save to history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ canvasUrl: dataUrl, colors: usedColors });
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
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
  }, [uploadedImage, gridWidth, maxColors, showGrid, perlerColors, history, historyIndex]);

  useEffect(() => {
    if (uploadedImage && uploadedFile) {
      const timer = setTimeout(() => {
        processImage();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [uploadedImage, uploadedFile, processImage]);

  const handleColorToggle = (colorId: string) => {
    setColors(prev => prev.map(c => 
      c.id === colorId ? { ...c, enabled: !c.enabled } : c
    ));
  };

  const sortedColors = [...colors].sort((a, b) => {
    if (colorSort === 'count') {
      return b.count - a.count;
    } else {
      // Sort by hue
      const hueA = Math.atan2(Math.sqrt(3) * (a.rgb[1] - a.rgb[2]), 2 * a.rgb[0] - a.rgb[1] - a.rgb[2]);
      const hueB = Math.atan2(Math.sqrt(3) * (b.rgb[1] - b.rgb[2]), 2 * b.rgb[0] - b.rgb[1] - b.rgb[2]);
      return hueA - hueB;
    }
  });

  const totalBeads = colors.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">拼豆大师 · 在线工作间</h1>
              <p className="text-sm text-gray-500 mt-1">上传即出稿，色号计数与图纸导出一站搞定</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer text-sm font-medium">
                <Upload className="w-4 h-4 mr-2" />
                换图
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回主页
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">视图缩放</span>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-24 accent-red-500"
                    />
                    <span className="text-sm text-gray-500">{zoom.toFixed(1)}x</span>
                  </div>
                  <button
                    onClick={() => setZoom(1)}
                    className="text-sm text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 inline mr-1" />
                    重置视角
                  </button>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-600">显示网格</span>
                  </label>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg overflow-hidden">
                {!uploadedImage ? (
                  <div className="text-center py-12">
                    <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">请上传一张图片开始生成图纸</p>
                    <label className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer text-sm font-medium mt-4">
                      <Upload className="w-4 h-4 mr-2" />
                      选择图片
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : isProcessing ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-500">处理中...</p>
                  </div>
                ) : canvasUrl ? (
                  <div 
                    className="overflow-auto max-h-[600px] w-full flex items-center justify-center"
                    style={{ 
                      cursor: paintMode ? 'crosshair' : 'grab',
                    }}
                  >
                    <div
                      style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.2s ease-out',
                      }}
                    >
                      <img
                        src={canvasUrl}
                        alt="Pattern"
                        className="mx-auto"
                        style={{
                          imageRendering: 'pixelated',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-500">正在生成图纸...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Settings Panel */}
          <div className="space-y-4">
            {/* Basic Parameters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基础参数</h2>
              
              <div className="space-y-4">
                {/* Grid Width */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-gray-700">珠子宽度（列数）</label>
                    <span className="text-sm text-red-600 font-medium">{gridWidth}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={gridWidth}
                    onChange={(e) => setGridWidth(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>

                {/* Max Colors */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-gray-700">最大颜色数</label>
                    <span className="text-sm text-red-600 font-medium">{maxColors}</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    value={maxColors}
                    onChange={(e) => setMaxColors(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </div>

                {/* Fine Processing */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">精细处理（较慢）</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fineProcessing}
                      onChange={(e) => setFineProcessing(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    <span className="ml-2 text-sm text-gray-500">{fineProcessing ? '开启' : '关闭'}</span>
                  </label>
                </div>

                {/* Remove Background */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <label className="text-sm text-gray-700">去除简单背景</label>
                      <span className="text-xs text-gray-400" title="适合白底、纯色或边缘连通的简单背景。复杂背景可能误删主体。">?</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={removeBackground}
                        onChange={(e) => setRemoveBackground(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      <span className="ml-2 text-sm text-gray-500">{removeBackground ? '开启' : '关闭'}</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">适合白底、纯色或边缘连通的简单背景。复杂背景可能误删主体。</p>
                </div>

                {/* Min Color Threshold */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1">
                      <label className="text-sm text-gray-700">最少颜色阈值</label>
                      <span className="text-xs text-gray-400" title="少于该数量的颜色将被自动替换为最接近的高频色，设为 0 关闭。">?</span>
                    </div>
                    <span className="text-sm text-red-600 font-medium">{minColorThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={minColorThreshold}
                    onChange={(e) => setMinColorThreshold(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">少于该数量的颜色将被自动替换为最接近的高频色，设为 0 关闭。</p>
                </div>

                {/* Grain Effect */}
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    <label className="text-sm text-gray-700">颗粒效果</label>
                    <span className="text-xs text-gray-400" title="卡通/像素：不加噪点，边缘硬朗；平滑点阵：棋盘细颗粒，适合天空/背景；柔和渐变：保渐变细节，纯色区略有噪点。">?</span>
                  </div>
                  <select
                    value={grainEffect}
                    onChange={(e) => setGrainEffect(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {grainOptions.map((option) => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">卡通/像素：不加噪点，边缘硬朗；平滑点阵：棋盘细颗粒，适合天空/背景；柔和渐变：保渐变细节，纯色区略有噪点。</p>
                </div>
              </div>
            </div>

            {/* Brand Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">色彩与品牌</h2>
              <div className="space-y-2">
                {brands.map((b) => (
                  <label key={b.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      value={b.id}
                      checked={selectedBrand === b.id}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">{b.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{b.type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Statistics */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">颜色统计与管理</h2>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">排序</span>
                <select
                  value={colorSort}
                  onChange={(e) => setColorSort(e.target.value)}
                  className="p-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="count">按数量</option>
                  <option value="hue">按色值</option>
                </select>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                色号来自公开色卡，屏幕颜色仅供参考。禁用/启用会立即重新计算图纸颜色。
              </p>

              {/* Manual Paint */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">手动上色</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPaintMode(!paintMode)}
                    disabled={!canvasUrl}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paintMode ? '退出上色模式' : '进入上色模式'}
                  </button>
                  <button
                    onClick={() => {
                      if (historyIndex > 0) {
                        setHistoryIndex(historyIndex - 1);
                        setCanvasUrl(history[historyIndex - 1].canvasUrl);
                        setColors(history[historyIndex - 1].colors);
                      }
                    }}
                    disabled={historyIndex <= 0}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    撤销
                  </button>
                  <button
                    onClick={() => {
                      if (historyIndex < history.length - 1) {
                        setHistoryIndex(historyIndex + 1);
                        setCanvasUrl(history[historyIndex + 1].canvasUrl);
                        setColors(history[historyIndex + 1].colors);
                      }
                    }}
                    disabled={historyIndex >= history.length - 1}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    重做
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  上色模式下点击画布可替换颜色。
                </p>
              </div>

              {/* Color List */}
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {sortedColors.length > 0 ? (
                  sortedColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        if (paintMode) {
                          setSelectedColor(color.id);
                        } else {
                          handleColorToggle(color.id);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                        selectedColor === color.id && paintMode
                          ? 'bg-red-50 ring-2 ring-red-500'
                          : color.enabled
                          ? 'hover:bg-gray-50'
                          : 'opacity-50 bg-gray-50'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded border border-gray-200 flex-shrink-0"
                        style={{ backgroundColor: `rgb(${color.rgb.join(',')})` }}
                      />
                      <div className="flex-1 text-left">
                        <span className="text-sm text-gray-700">{color.id} · {color.code} {color.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{color.count} beads</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">上传图片后显示颜色列表</p>
                )}
              </div>

              {totalBeads > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    总珠子数: <span className="font-medium text-gray-900">{totalBeads}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    颜色数: <span className="font-medium text-gray-900">{colors.length}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
