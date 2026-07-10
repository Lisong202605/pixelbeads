import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Brush,
  ChevronDown,
  Download,
  FileImage,
  FileSpreadsheet,
  FileText,
  Grid3X3,
  ImagePlus,
  Palette,
  Redo2,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Undo2,
  Upload,
} from 'lucide-react';

interface ColorInfo {
  id: string;
  code: string;
  name: string;
  rgb: [number, number, number];
  count: number;
  enabled: boolean;
}

interface HistoryEntry {
  canvasUrl: string;
  colors: ColorInfo[];
}

interface TemplateImportSettings {
  title: string;
  gridWidth: number;
  maxColors: number;
  preserveColors: boolean;
}

interface PanelProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  summary?: string;
}

const brands = [
  { id: 'perler', name: 'Perler', type: 'Hard beads', colors: 80 },
  { id: 'artkal-s', name: 'Artkal S', type: 'Hard beads', colors: 178 },
  { id: 'artkal-c', name: 'Artkal C', type: 'Hard beads', colors: 178 },
  { id: 'artkal-r', name: 'Artkal R', type: 'Soft beads', colors: 100 },
  { id: 'mard', name: 'MARD', type: 'Hard beads', colors: 291 },
  { id: 'hama', name: 'Hama', type: 'Hard beads', colors: 70 },
];

const templateBrand = { id: 'template', name: 'Template', type: 'Original colors', colors: 0 };

const grainOptions = [
  { id: 'pixel', name: 'Clean pixel blocks', step: 32 },
  { id: 'smooth', name: 'Soft dotted blend', step: 24 },
  { id: 'soft', name: 'Gentle gradient detail', step: 16 },
];

const basePalette: Omit<ColorInfo, 'count' | 'enabled'>[] = [
  { id: 'C1', code: '#ffffff', name: 'White', rgb: [255, 255, 255] },
  { id: 'C2', code: '#f6e8c8', name: 'Cream', rgb: [246, 232, 200] },
  { id: 'C3', code: '#f7d26a', name: 'Pastel Yellow', rgb: [247, 210, 106] },
  { id: 'C4', code: '#f59a3d', name: 'Orange', rgb: [245, 154, 61] },
  { id: 'C5', code: '#d94a3d', name: 'Red', rgb: [217, 74, 61] },
  { id: 'C6', code: '#50aaf0', name: 'Sky Blue', rgb: [80, 170, 240] },
  { id: 'C7', code: '#3677d2', name: 'Cobalt Blue', rgb: [54, 119, 210] },
  { id: 'C8', code: '#1b3d8f', name: 'Navy', rgb: [27, 61, 143] },
  { id: 'C9', code: '#7b62d9', name: 'Violet', rgb: [123, 98, 217] },
  { id: 'C10', code: '#d879c8', name: 'Orchid', rgb: [216, 121, 200] },
  { id: 'C11', code: '#f3a6c8', name: 'Pink', rgb: [243, 166, 200] },
  { id: 'C12', code: '#2b7a46', name: 'Forest', rgb: [43, 122, 70] },
  { id: 'C13', code: '#71aa48', name: 'Leaf', rgb: [113, 170, 72] },
  { id: 'C14', code: '#a8c95a', name: 'Light Green', rgb: [168, 201, 90] },
  { id: 'C15', code: '#7b5d3a', name: 'Brown', rgb: [123, 93, 58] },
  { id: 'C16', code: '#4f4b45', name: 'Charcoal', rgb: [79, 75, 69] },
  { id: 'C17', code: '#9aa6b2', name: 'Grey', rgb: [154, 166, 178] },
  { id: 'C18', code: '#aacfef', name: 'Mist Blue', rgb: [170, 207, 239] },
  { id: 'C19', code: '#00a8c8', name: 'Lagoon', rgb: [0, 168, 200] },
  { id: 'C20', code: '#8d7a35', name: 'Olive', rgb: [141, 122, 53] },
  { id: 'C21', code: '#b7653f', name: 'Terracotta', rgb: [183, 101, 63] },
  { id: 'C22', code: '#2b2231', name: 'Blackberry', rgb: [43, 34, 49] },
  { id: 'C23', code: '#222222', name: 'Black', rgb: [34, 34, 34] },
  { id: 'C24', code: '#ffe4a8', name: 'Peach', rgb: [255, 228, 168] },
];

function Panel({ title, icon, children, defaultOpen = true, summary }: PanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-lg border border-[#3a3a3a] bg-[#202020] shadow-[0_14px_38px_rgba(0,0,0,0.22)]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="text-[#d4a574]">{icon}</span>
          <span>
            <span className="block text-base font-bold text-[#e8e6e3]">{title}</span>
            {summary && <span className="mt-0.5 block text-xs text-[#6b6560]">{summary}</span>}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-[#6b6560] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="border-t border-[#3a3a3a] px-4 pb-4 pt-3">{children}</div>}
    </section>
  );
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function downloadText(text: string, filename: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  URL.revokeObjectURL(url);
}

export function Editor() {
  const [templateImport] = useState<TemplateImportSettings | null>(() => {
    const storedSettings = sessionStorage.getItem('uploadedTemplateSettings');
    if (!storedSettings) return null;
    sessionStorage.removeItem('uploadedTemplateSettings');
    try {
      return JSON.parse(storedSettings) as TemplateImportSettings;
    } catch {
      return null;
    }
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(() => {
    const storedImage = sessionStorage.getItem('uploadedImage');
    if (storedImage) {
      sessionStorage.removeItem('uploadedImage');
    }
    return storedImage;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState<string | null>(null);
  const [gridWidth, setGridWidth] = useState(templateImport?.gridWidth ?? 140);
  const [maxColors, setMaxColors] = useState(templateImport?.maxColors ?? 40);
  const [preserveSourceColors, setPreserveSourceColors] = useState(Boolean(templateImport?.preserveColors));
  const [importedTemplateTitle, setImportedTemplateTitle] = useState(templateImport?.title ?? '');
  const [fineProcessing, setFineProcessing] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [minColorThreshold, setMinColorThreshold] = useState(0);
  const [grainEffect, setGrainEffect] = useState('pixel');
  const [selectedBrand, setSelectedBrand] = useState(templateImport ? 'template' : 'mard');
  const [brandFilter, setBrandFilter] = useState('all');
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [colorSort, setColorSort] = useState('count');
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [paintMode, setPaintMode] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingKeyRef = useRef('');

  const availableBrands = importedTemplateTitle ? [templateBrand, ...brands] : brands;
  const selectedBrandInfo = availableBrands.find((brand) => brand.id === selectedBrand) ?? brands[0];
  const totalBeads = colors.reduce((sum, color) => sum + color.count, 0);
  const enabledColors = colors.filter((color) => color.enabled).length;

  const sortedColors = useMemo(() => {
    return [...colors].sort((a, b) => {
      if (colorSort === 'hue') {
        const hueA = Math.atan2(Math.sqrt(3) * (a.rgb[1] - a.rgb[2]), 2 * a.rgb[0] - a.rgb[1] - a.rgb[2]);
        const hueB = Math.atan2(Math.sqrt(3) * (b.rgb[1] - b.rgb[2]), 2 * b.rgb[0] - b.rgb[1] - b.rgb[2]);
        return hueA - hueB;
      }
      if (colorSort === 'code') {
        return a.id.localeCompare(b.id);
      }
      return b.count - a.count;
    });
  }, [colorSort, colors]);

  const controlClass = 'rounded-lg border border-[#3a3a3a] bg-[#171717] px-3 py-2 text-sm text-[#e8e6e3] outline-none focus:border-[#d4a574]';
  const secondaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg border border-[#3a3a3a] bg-[#252525] px-4 py-3 text-sm font-bold text-[#e8e6e3] transition hover:border-[#5a5a5a] hover:bg-[#2b2b2b] disabled:cursor-not-allowed disabled:opacity-40';

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      setUploadedImage(readerEvent.target?.result as string);
      setPreserveSourceColors(false);
      setImportedTemplateTitle('');
      setSelectedBrand('mard');
      setHistory([]);
      setHistoryIndex(-1);
    };
    reader.readAsDataURL(file);
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
        const grain = grainOptions.find((option) => option.id === grainEffect) ?? grainOptions[0];
        const quantizeStep = preserveSourceColors ? 1 : fineProcessing ? Math.max(12, grain.step - 8) : grain.step;

        const offCanvas = document.createElement('canvas');
        offCanvas.width = pixelWidth;
        offCanvas.height = pixelHeight;
        const offCtx = offCanvas.getContext('2d');
        if (!offCtx) return;

        offCtx.drawImage(img, 0, 0, pixelWidth, pixelHeight);
        const imageData = offCtx.getImageData(0, 0, pixelWidth, pixelHeight);
        const data = imageData.data;
        const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          const nearWhite = removeBackground && r > 238 && g > 238 && b > 238;
          if (a < 128 || nearWhite) continue;

          const qr = Math.min(255, Math.round(r / quantizeStep) * quantizeStep);
          const qg = Math.min(255, Math.round(g / quantizeStep) * quantizeStep);
          const qb = Math.min(255, Math.round(b / quantizeStep) * quantizeStep);
          const key = `${qr},${qg},${qb}`;
          const current = colorMap.get(key);
          if (current) {
            current.count += 1;
          } else {
            colorMap.set(key, { r: qr, g: qg, b: qb, count: 1 });
          }
        }

        let sourceColors = Array.from(colorMap.values()).sort((a, b) => b.count - a.count);
        if (minColorThreshold > 0) {
          sourceColors = sourceColors.filter((color) => color.count >= minColorThreshold);
        }
        sourceColors = sourceColors.slice(0, maxColors);
        if (sourceColors.length === 0) {
          sourceColors = [{ r: 255, g: 255, b: 255, count: pixelWidth * pixelHeight }];
        }

        const usedColors: ColorInfo[] = sourceColors.map((sourceColor, index) => {
          const paletteColor = basePalette[index % basePalette.length];
          return {
            ...paletteColor,
            id: `${selectedBrandInfo.name[0]}${index + 1}`,
            code: `#${[sourceColor.r, sourceColor.g, sourceColor.b].map((value) => value.toString(16).padStart(2, '0')).join('')}`,
            rgb: [sourceColor.r, sourceColor.g, sourceColor.b],
            count: sourceColor.count,
            enabled: true,
          };
        });

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          const nearWhite = removeBackground && r > 238 && g > 238 && b > 238;
          if (a < 128 || nearWhite) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 0;
            continue;
          }

          let nearest = sourceColors[0];
          let minDistance = Infinity;
          for (const candidate of sourceColors) {
            const distance = (r - candidate.r) ** 2 + (g - candidate.g) ** 2 + (b - candidate.b) ** 2;
            if (distance < minDistance) {
              minDistance = distance;
              nearest = candidate;
            }
          }
          data[i] = nearest.r;
          data[i + 1] = nearest.g;
          data[i + 2] = nearest.b;
          data[i + 3] = 255;
        }

        offCtx.putImageData(imageData, 0, 0);

        const displayScale = 8;
        const displayCanvas = document.createElement('canvas');
        displayCanvas.width = pixelWidth * displayScale;
        displayCanvas.height = pixelHeight * displayScale;
        const displayCtx = displayCanvas.getContext('2d');
        if (!displayCtx) return;
        displayCtx.imageSmoothingEnabled = false;
        displayCtx.drawImage(offCanvas, 0, 0, displayCanvas.width, displayCanvas.height);

        if (showGrid) {
          displayCtx.strokeStyle = 'rgba(232, 230, 227, 0.22)';
          displayCtx.lineWidth = 1;
          for (let x = 0; x <= pixelWidth; x += 1) {
            displayCtx.beginPath();
            displayCtx.moveTo(x * displayScale, 0);
            displayCtx.lineTo(x * displayScale, displayCanvas.height);
            displayCtx.stroke();
          }
          for (let y = 0; y <= pixelHeight; y += 1) {
            displayCtx.beginPath();
            displayCtx.moveTo(0, y * displayScale);
            displayCtx.lineTo(displayCanvas.width, y * displayScale);
            displayCtx.stroke();
          }
        }

        const dataUrl = displayCanvas.toDataURL('image/png');
        setCanvasUrl(dataUrl);
        setColors(usedColors);
        setHistory((previous) => {
          const next = previous.slice(0, historyIndex + 1);
          next.push({ canvasUrl: dataUrl, colors: usedColors });
          setHistoryIndex(next.length - 1);
          return next;
        });
      } finally {
        setIsProcessing(false);
      }
    };
    img.onerror = () => setIsProcessing(false);
    img.src = uploadedImage;
  }, [
    fineProcessing,
    grainEffect,
    gridWidth,
    historyIndex,
    maxColors,
    minColorThreshold,
    preserveSourceColors,
    removeBackground,
    selectedBrandInfo.name,
    showGrid,
    uploadedImage,
  ]);

  useEffect(() => {
    if (!uploadedImage) return;
    const key = `${uploadedImage.length}:${gridWidth}:${maxColors}:${showGrid}:${fineProcessing}:${removeBackground}:${minColorThreshold}:${grainEffect}:${selectedBrand}`;
    if (processingKeyRef.current === key) return;
    processingKeyRef.current = key;
    const timer = window.setTimeout(processImage, 450);
    return () => window.clearTimeout(timer);
  }, [fineProcessing, grainEffect, gridWidth, maxColors, minColorThreshold, processImage, removeBackground, selectedBrand, showGrid, uploadedImage]);

  const restoreHistory = (index: number) => {
    const entry = history[index];
    if (!entry) return;
    setHistoryIndex(index);
    setCanvasUrl(entry.canvasUrl);
    setColors(entry.colors);
  };

  const handleColorToggle = (colorId: string) => {
    setColors((previous) =>
      previous.map((color) => (color.id === colorId ? { ...color, enabled: !color.enabled } : color)),
    );
  };

  const exportPng = () => {
    if (canvasUrl) downloadDataUrl(canvasUrl, 'pixelbeads-pattern.png');
  };

  const exportCsv = () => {
    const rows = [
      ['Color ID', 'Code', 'Name', 'RGB', 'Count', 'Enabled'],
      ...sortedColors.map((color) => [
        color.id,
        color.code,
        color.name,
        `rgb(${color.rgb.join(' ')})`,
        String(color.count),
        color.enabled ? 'yes' : 'no',
      ]),
    ];
    downloadText(rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n'), 'pixelbeads-materials.csv', 'text/csv;charset=utf-8');
  };

  const exportPdf = async () => {
    if (!canvasUrl) return;
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    pdf.setFontSize(18);
    pdf.text('PixelBeads Pattern', 14, 16);
    pdf.setFontSize(10);
    pdf.text(`${selectedBrandInfo.name} - ${gridWidth} columns - ${enabledColors} colors - ${totalBeads.toLocaleString()} beads`, 14, 24);
    pdf.addImage(canvasUrl, 'PNG', 14, 32, 170, 120);
    pdf.setFontSize(11);
    pdf.text('Material list', 198, 32);
    sortedColors.slice(0, 18).forEach((color, index) => {
      const y = 42 + index * 7;
      pdf.setFillColor(color.rgb[0], color.rgb[1], color.rgb[2]);
      pdf.rect(198, y - 4, 5, 5, 'F');
      pdf.text(`${color.id} ${color.code} ${color.count}`, 206, y);
    });
    pdf.save('pixelbeads-pattern.pdf');
  };

  const exportShareCard = () => {
    if (!canvasUrl) return;
    const card = document.createElement('canvas');
    card.width = 1200;
    card.height = 900;
    const ctx = card.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, card.width, card.height);
    ctx.fillStyle = '#e8e6e3';
    ctx.font = 'bold 42px Arial';
    ctx.fillText('PixelBeads Pattern', 64, 78);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#a09b94';
    ctx.fillText(`${selectedBrandInfo.name} - ${gridWidth} columns - ${enabledColors} colors - ${totalBeads.toLocaleString()} beads`, 64, 118);
    const image = new Image();
    image.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#202020';
      ctx.fillRect(64, 160, 780, 640);
      ctx.drawImage(image, 84, 180, 740, 600);
      ctx.fillStyle = '#202020';
      ctx.fillRect(880, 160, 256, 640);
      ctx.fillStyle = '#d4a574';
      ctx.font = 'bold 26px Arial';
      ctx.fillText('Top colors', 904, 206);
      sortedColors.slice(0, 9).forEach((color, index) => {
        const y = 252 + index * 58;
        ctx.fillStyle = `rgb(${color.rgb.join(',')})`;
        ctx.fillRect(904, y - 28, 34, 34);
        ctx.fillStyle = '#e8e6e3';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(color.id, 952, y - 10);
        ctx.font = '18px Arial';
        ctx.fillStyle = '#a09b94';
        ctx.fillText(`${color.count} beads`, 952, y + 14);
      });
      downloadDataUrl(card.toDataURL('image/png'), 'pixelbeads-share-card.png');
    };
    image.src = canvasUrl;
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e8e6e3]">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      <header className="border-b border-[#3a3a3a] bg-[#1a1a1a]/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1880px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#e8e6e3]">PixelBeads Studio</h1>
            <p className="mt-1 text-sm text-[#6b6560]">Convert photos, tune palettes, count beads, and export print-ready patterns.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="craft-btn inline-flex items-center gap-2 px-5 py-3 text-sm">
              <ImagePlus className="h-4 w-4" />
              Change Image
            </button>
            <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-[#3a3a3a] bg-[#252525] px-5 py-3 text-sm font-bold text-[#e8e6e3] transition hover:border-[#5a5a5a] hover:bg-[#2b2b2b]">
              <ArrowLeft className="h-4 w-4" />
              Back Home
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1880px] grid-cols-1 gap-5 px-4 py-5 xl:grid-cols-[minmax(0,1fr)_520px]">
        <main className="min-w-0">
          {importedTemplateTitle && (
            <div role="status" className="mb-4 rounded-lg border border-[#d4a574]/40 bg-[#d4a574]/10 px-4 py-3 text-sm text-[#e8e6e3]">
              Editing <strong>{importedTemplateTitle}</strong> at its original {gridWidth}-column grid with {maxColors} colors.
            </div>
          )}
          <div className="mb-4 grid gap-3 rounded-lg border border-[#3a3a3a] bg-[#202020] p-3 md:grid-cols-[1fr_auto_auto] md:items-center">
            <label className="flex items-center gap-3 text-sm font-medium text-[#a09b94]">
              <span className="w-20 flex-shrink-0">Zoom</span>
              <input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="w-full accent-[#d4a574]" />
              <span className="w-12 text-right text-[#d4a574]">{zoom.toFixed(1)}x</span>
            </label>
            <button type="button" onClick={() => setZoom(1)} className="inline-flex items-center justify-center gap-2 rounded-md border border-[#3a3a3a] bg-[#252525] px-4 py-2 text-sm font-medium text-[#e8e6e3] hover:bg-[#2b2b2b]">
              <RotateCcw className="h-4 w-4" />
              Reset View
            </button>
            <label className="inline-flex items-center gap-2 rounded-md border border-[#3a3a3a] bg-[#252525] px-4 py-2 text-sm font-medium text-[#e8e6e3]">
              <input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} className="accent-[#d4a574]" />
              Show Grid
            </label>
          </div>

          <section className="flex min-h-[640px] items-center justify-center overflow-auto rounded-lg border border-[#3a3a3a] bg-[#202020] p-4 shadow-inner">
            {!uploadedImage ? (
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg border border-[#d4a574]/20 bg-[#d4a574]/10 text-[#d4a574]">
                  <Upload className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-[#e8e6e3]">Upload an image to begin</h2>
                <p className="mt-2 text-sm leading-6 text-[#6b6560]">Use a clear subject with good contrast. PixelBeads will build a pattern, bead counts, and export files locally in your browser.</p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="craft-btn mt-5 inline-flex items-center gap-2 px-5 py-3 text-sm">
                  <Upload className="h-4 w-4" />
                  Choose Image
                </button>
              </div>
            ) : isProcessing ? (
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#d4a574] border-t-transparent" />
                <p className="text-sm text-[#6b6560]">Rebuilding pattern...</p>
              </div>
            ) : canvasUrl ? (
              <div className="flex h-full w-full items-center justify-center overflow-auto">
                <img
                  src={canvasUrl}
                  alt="Generated bead pattern"
                  className={`max-w-none rounded-sm ${highlightMode && selectedColor ? 'ring-4 ring-[#d4a574]' : ''}`}
                  style={{
                    imageRendering: 'pixelated',
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    cursor: paintMode ? 'crosshair' : 'grab',
                  }}
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#d4a574] border-t-transparent" />
                <p className="text-sm text-[#6b6560]">Generating pattern...</p>
              </div>
            )}
          </section>
        </main>

        <aside className="min-w-0 xl:sticky xl:top-5 xl:h-[calc(100vh-120px)] xl:overflow-y-auto xl:pr-2">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 rounded-lg border border-[#3a3a3a] bg-[#202020] p-4 shadow-sm">
              <div>
                <p className="text-xs text-[#6b6560]">Total Beads</p>
                <p className="mt-1 text-xl font-bold text-[#e8e6e3]">{totalBeads.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b6560]">Colors</p>
                <p className="mt-1 text-xl font-bold text-[#e8e6e3]">{enabledColors}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b6560]">Brand</p>
                <p className="mt-1 truncate text-xl font-bold text-[#e8e6e3]">{selectedBrandInfo.name}</p>
              </div>
            </div>

            <Panel title="Export & Share" icon={<Download className="h-5 w-5" />} summary="Pattern files, materials, and share card">
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={exportPng} disabled={!canvasUrl} className={secondaryButtonClass}><FileImage className="h-4 w-4" />PNG</button>
                <button type="button" onClick={exportPdf} disabled={!canvasUrl} className={secondaryButtonClass}><FileText className="h-4 w-4" />PDF</button>
                <button type="button" onClick={exportCsv} disabled={colors.length === 0} className={secondaryButtonClass}><FileSpreadsheet className="h-4 w-4" />CSV</button>
                <button type="button" onClick={exportShareCard} disabled={!canvasUrl} className={secondaryButtonClass}><Share2 className="h-4 w-4" />Share Card</button>
              </div>
            </Panel>

            <Panel title="Pattern Settings" icon={<SlidersHorizontal className="h-5 w-5" />} summary={`${gridWidth} columns - max ${maxColors} colors`}>
              <div className="space-y-5 text-[#e8e6e3]">
                <label className="block">
                  <span className="mb-2 flex justify-between text-sm font-medium"><span>Bead Width</span><span className="text-[#d4a574]">{gridWidth}</span></span>
                  <input type="range" min="20" max="220" value={gridWidth} onChange={(event) => setGridWidth(Number(event.target.value))} className="w-full accent-[#d4a574]" />
                </label>
                <label className="block">
                  <span className="mb-2 flex justify-between text-sm font-medium"><span>Max Colors</span><span className="text-[#d4a574]">{maxColors}</span></span>
                  <input type="range" min="4" max="80" value={maxColors} onChange={(event) => setMaxColors(Number(event.target.value))} className="w-full accent-[#d4a574]" />
                </label>
                <div className="grid gap-3">
                  <label className="flex items-center justify-between gap-3 text-sm"><span>Fine Processing</span><input type="checkbox" checked={fineProcessing} onChange={(event) => setFineProcessing(event.target.checked)} className="accent-[#d4a574]" /></label>
                  <label className="flex items-center justify-between gap-3 text-sm"><span>Remove White Background</span><input type="checkbox" checked={removeBackground} onChange={(event) => setRemoveBackground(event.target.checked)} className="accent-[#d4a574]" /></label>
                </div>
                <label className="block">
                  <span className="mb-2 flex justify-between text-sm font-medium"><span>Minimum Color Count</span><span className="text-[#d4a574]">{minColorThreshold}</span></span>
                  <input type="range" min="0" max="100" value={minColorThreshold} onChange={(event) => setMinColorThreshold(Number(event.target.value))} className="w-full accent-[#d4a574]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Dither Style</span>
                  <select value={grainEffect} onChange={(event) => setGrainEffect(event.target.value)} className={controlClass}>
                    {grainOptions.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </select>
                </label>
              </div>
            </Panel>

            <Panel
              title="Palette & Brand"
              icon={<Palette className="h-5 w-5" />}
              summary={selectedBrand === 'template' ? 'Original template colors' : `${selectedBrandInfo.name} - ${selectedBrandInfo.colors} reference colors`}
            >
              <div className="grid grid-cols-2 gap-3">
                {availableBrands.map((brand) => (
                  <label key={brand.id} className={`relative cursor-pointer rounded-lg border p-3 transition ${selectedBrand === brand.id ? 'border-[#d4a574] bg-[#d4a574]/10' : 'border-[#3a3a3a] bg-[#171717] hover:border-[#5a5a5a]'}`}>
                    <input type="radio" name="brand" value={brand.id} checked={selectedBrand === brand.id} onChange={(event) => setSelectedBrand(event.target.value)} className="absolute right-3 top-3 accent-[#d4a574]" />
                    <span className="block pr-6 text-base font-bold text-[#e8e6e3]">{brand.name}</span>
                    <span className="mt-1 block text-xs text-[#6b6560]">{brand.type} - {brand.colors} colors</span>
                  </label>
                ))}
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-medium text-[#e8e6e3]">Color Range</span>
                <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)} className={controlClass}>
                  <option value="all">All colors</option>
                  <option value="classic">Classic basics</option>
                  <option value="pastel">Pastel colors</option>
                  <option value="dark">Dark outlines</option>
                </select>
              </label>
              <p className="mt-3 text-xs leading-5 text-[#6b6560]">Brand palettes are organized for exports and can be expanded into full official color libraries.</p>
            </Panel>

            <Panel title="Color Management" icon={<Sparkles className="h-5 w-5" />} defaultOpen={false} summary={`${sortedColors.length} generated colors`}>
              <div className="mb-3 flex items-center gap-3">
                <span className="text-sm font-medium text-[#e8e6e3]">Sort</span>
                <select value={colorSort} onChange={(event) => setColorSort(event.target.value)} className={`${controlClass} min-w-0 flex-1`}>
                  <option value="count">By count</option>
                  <option value="hue">By hue</option>
                  <option value="code">By code</option>
                </select>
              </div>
              <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {sortedColors.length > 0 ? (
                  sortedColors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color.id);
                        if (!paintMode) handleColorToggle(color.id);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${selectedColor === color.id ? 'border-[#d4a574] bg-[#d4a574]/10' : 'border-transparent bg-[#171717] hover:border-[#3a3a3a]'} ${color.enabled ? '' : 'opacity-50'}`}
                    >
                      <span className="h-9 w-9 flex-shrink-0 rounded-md border border-white/10" style={{ backgroundColor: `rgb(${color.rgb.join(',')})` }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-[#e8e6e3]">{color.id} - {color.name}</span>
                        <span className="block truncate text-xs text-[#6b6560]">{color.code} - {color.count.toLocaleString()} beads</span>
                      </span>
                      <span className="rounded-full border border-[#3a3a3a] px-3 py-1 text-xs font-bold text-[#e8e6e3]">{color.enabled ? 'Disable' : 'Enable'}</span>
                    </button>
                  ))
                ) : (
                  <p className="rounded-lg bg-[#171717] p-4 text-center text-sm text-[#6b6560]">Upload an image to see color statistics.</p>
                )}
              </div>
            </Panel>

            <Panel title="Manual Paint" icon={<Brush className="h-5 w-5" />} defaultOpen={false} summary={paintMode ? 'Paint mode enabled' : 'Select a color to mark'}>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setPaintMode((value) => !value)} disabled={!canvasUrl} className={`${paintMode ? 'craft-btn' : secondaryButtonClass} px-4 py-2 text-sm`}><Brush className="h-4 w-4" />{paintMode ? 'Exit Paint Mode' : 'Enter Paint Mode'}</button>
                <button type="button" onClick={() => restoreHistory(historyIndex - 1)} disabled={historyIndex <= 0} className={`${secondaryButtonClass} px-4 py-2`}><Undo2 className="h-4 w-4" />Undo</button>
                <button type="button" onClick={() => restoreHistory(historyIndex + 1)} disabled={historyIndex >= history.length - 1} className={`${secondaryButtonClass} px-4 py-2`}><Redo2 className="h-4 w-4" />Redo</button>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#6b6560]">The paint workflow keeps color selection and undo ready for single-bead editing.</p>
            </Panel>

            <Panel title="Pattern Interaction" icon={<Grid3X3 className="h-5 w-5" />} defaultOpen={false} summary={highlightMode ? 'Highlight enabled' : 'Highlight selected colors'}>
              <button type="button" onClick={() => setHighlightMode((value) => !value)} disabled={!selectedColor} className={`${secondaryButtonClass} px-4 py-2`}>
                {highlightMode ? 'Clear Highlight' : 'Highlight Selected Color'}
              </button>
              <p className="mt-3 text-xs leading-5 text-[#6b6560]">Select a color, then highlight it while assembling the physical bead project.</p>
            </Panel>
          </div>
        </aside>
      </div>
    </div>
  );
}
