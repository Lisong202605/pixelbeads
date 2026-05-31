import { useState, useRef, useCallback, useEffect } from 'react';
import { Undo, Redo, Download, ZoomIn, ZoomOut, Palette, Brush, Eraser, PaintBucket } from 'lucide-react';

interface Cell {
  color: string | null;
}

export function Editor() {
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [zoom, setZoom] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gridWidth, setGridWidth] = useState(30);
  const [gridHeight, setGridHeight] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cells, setCells] = useState<Cell[][]>(() => {
    return Array(gridHeight).fill(null).map(() =>
      Array(gridWidth).fill(null).map(() => ({ color: null }))
    );
  });
  const [history, setHistory] = useState<Cell[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const tools = [
    { id: 'brush', name: 'Brush', icon: Brush },
    { id: 'fill', name: 'Fill', icon: PaintBucket },
    { id: 'eraser', name: 'Eraser', icon: Eraser },
  ];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3',
    '#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2',
    '#2D3436', '#636E72', '#B2BEC3', '#DFE6E9',
    '#E17055', '#00B894', '#0984E3', '#6C5CE7',
    '#FD79A8', '#FDCB6E', '#E84393', '#00CEC9',
  ];

  // Calculate cell size based on zoom
  const baseCellSize = 20;
  const cellSize = Math.max(8, Math.round(baseCellSize * (zoom / 100)));
  const canvasWidth = gridWidth * cellSize;
  const canvasHeight = gridHeight * cellSize;

  // Draw the grid
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw cells
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const cell = cells[y][x];
        const px = x * cellSize;
        const py = y * cellSize;

        if (cell.color) {
          ctx.fillStyle = cell.color;
          ctx.fillRect(px, py, cellSize, cellSize);
        }

        // Draw grid line
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, py, cellSize, cellSize);
      }
    }
  }, [cells, cellSize, canvasWidth, canvasHeight, gridWidth, gridHeight]);

  // Redraw when cells or zoom change
  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  // Get cell from mouse position
  const getCellFromMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return null;
    return { x, y };
  };

  // Save history
  const saveHistory = useCallback((newCells: Cell[][]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCells.map(row => row.map(cell => ({ ...cell }))));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Paint cell
  const paintCell = useCallback((x: number, y: number) => {
    setCells(prev => {
      const newCells = prev.map(row => row.map(cell => ({ ...cell })));
      
      if (selectedTool === 'brush') {
        newCells[y][x].color = selectedColor;
      } else if (selectedTool === 'eraser') {
        newCells[y][x].color = null;
      }
      
      return newCells;
    });
  }, [selectedTool, selectedColor]);

  // Flood fill
  const floodFill = useCallback((startX: number, startY: number) => {
    setCells(prev => {
      const newCells = prev.map(row => row.map(cell => ({ ...cell })));
      const targetColor = newCells[startY][startX].color;
      
      if (targetColor === selectedColor) return prev;

      const stack = [{ x: startX, y: startY }];
      const visited = new Set<string>();

      while (stack.length > 0) {
        const { x, y } = stack.pop()!;
        const key = `${x},${y}`;

        if (visited.has(key)) continue;
        if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) continue;
        if (newCells[y][x].color !== targetColor) continue;

        visited.add(key);
        newCells[y][x].color = selectedColor;

        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
      }

      return newCells;
    });
  }, [selectedColor, gridWidth, gridHeight]);

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cell = getCellFromMouse(e);
    if (!cell) return;

    setIsDrawing(true);

    if (selectedTool === 'fill') {
      floodFill(cell.x, cell.y);
      saveHistory(cells);
    } else {
      paintCell(cell.x, cell.y);
    }
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (selectedTool === 'fill') return;

    const cell = getCellFromMouse(e);
    if (!cell) return;

    paintCell(cell.x, cell.y);
  };

  // Handle mouse up
  const handleMouseUp = () => {
    if (isDrawing && selectedTool !== 'fill') {
      saveHistory(cells);
    }
    setIsDrawing(false);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (isDrawing && selectedTool !== 'fill') {
      saveHistory(cells);
    }
    setIsDrawing(false);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCells(history[newIndex].map(row => row.map(cell => ({ ...cell }))));
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCells(history[newIndex].map(row => row.map(cell => ({ ...cell }))));
    }
  };

  // Export PNG
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `pixelbeads-editor-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      const initialCells = cells.map(row => row.map(cell => ({ ...cell })));
      setHistory([initialCells]);
      setHistoryIndex(0);
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
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
          <button 
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button 
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"
          >
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
          <button 
            onClick={exportPNG}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto p-4">
          <div className="bg-white shadow-lg border border-gray-200">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className="cursor-crosshair"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                imageRendering: 'pixelated',
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Color Palette
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
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
            <h4 className="font-medium text-gray-900 mb-2">Grid Size</h4>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-600">Width: {gridWidth}</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={gridWidth}
                  onChange={(e) => {
                    const newWidth = Number(e.target.value);
                    setGridWidth(newWidth);
                    setCells(prev => {
                      const newCells: Cell[][] = Array(gridHeight).fill(null).map(() =>
                        Array(newWidth).fill(null).map(() => ({ color: null }))
                      );
                      // Copy existing cells
                      for (let y = 0; y < Math.min(gridHeight, prev.length); y++) {
                        for (let x = 0; x < Math.min(newWidth, prev[y].length); x++) {
                          newCells[y][x] = { ...prev[y][x] };
                        }
                      }
                      return newCells;
                    });
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Height: {gridHeight}</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={gridHeight}
                  onChange={(e) => {
                    const newHeight = Number(e.target.value);
                    setGridHeight(newHeight);
                    setCells(prev => {
                      const newCells: Cell[][] = Array(newHeight).fill(null).map(() =>
                        Array(gridWidth).fill(null).map(() => ({ color: null }))
                      );
                      // Copy existing cells
                      for (let y = 0; y < Math.min(newHeight, prev.length); y++) {
                        for (let x = 0; x < Math.min(gridWidth, prev[y]?.length || 0); x++) {
                          newCells[y][x] = { ...prev[y][x] };
                        }
                      }
                      return newCells;
                    });
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Pattern Info</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Size: {gridWidth} × {gridHeight} beads</p>
              <p>Colors: {new Set(cells.flat().map(c => c.color).filter(Boolean)).size}</p>
              <p>Total: {gridWidth * gridHeight} beads</p>
            </div>
          </div>

          <button
            onClick={() => {
              const newCells = Array(gridHeight).fill(null).map(() =>
                Array(gridWidth).fill(null).map(() => ({ color: null }))
              );
              setCells(newCells);
              saveHistory(newCells);
            }}
            className="w-full mt-4 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear Canvas
          </button>
        </div>
      </div>
    </div>
  );
}
