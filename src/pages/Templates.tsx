import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileImage, FileSpreadsheet, Shapes, SlidersHorizontal } from 'lucide-react';

type Category = 'Animals' | 'Kawaii' | 'Food' | 'Nature' | 'Space' | 'Game Style' | 'Holidays';

type PatternTemplate = {
  id: string;
  title: string;
  category: Category;
  width: number;
  height: number;
  palette: Record<string, string>;
  cells: string[];
  tags: string[];
  difficulty: 'Medium' | 'Detailed' | 'Advanced';
};

const categories: Array<'All' | Category> = ['All', 'Animals', 'Kawaii', 'Food', 'Nature', 'Space', 'Game Style', 'Holidays'];

const palette = {
  empty: 'transparent',
  outline: '#171717',
  white: '#f8f6ec',
  cream: '#f1dcad',
  tan: '#d69759',
  caramel: '#b8733f',
  brown: '#76482f',
  darkBrown: '#463024',
  black: '#111111',
  blush: '#f3a1a9',
  pink: '#ee7fb7',
  rose: '#d84f7b',
  red: '#d8453e',
  orange: '#df7e38',
  coral: '#f06f5f',
  yellow: '#f2c84a',
  gold: '#d6a936',
  lime: '#a4c94a',
  green: '#3e8c55',
  leaf: '#6fa23a',
  mint: '#78cda1',
  teal: '#2baaa4',
  sky: '#65b8ee',
  blue: '#3f7fd8',
  navy: '#243964',
  lavender: '#b9a6ef',
  purple: '#7d63d9',
  violet: '#573ba8',
  grey: '#817b72',
  lightGrey: '#cac4b8',
  charcoal: '#3a3834',
};

const colorCodes: Record<string, string> = {
  outline: 'o',
  white: 'w',
  cream: 'c',
  tan: 't',
  caramel: 'a',
  brown: 'b',
  darkBrown: 'q',
  black: 'k',
  blush: 'h',
  pink: 'p',
  rose: 'z',
  red: 'r',
  orange: 'x',
  coral: 'f',
  yellow: 'y',
  gold: 'd',
  lime: 'l',
  green: 'g',
  leaf: 'v',
  mint: 'm',
  teal: 'e',
  sky: 's',
  blue: 'u',
  navy: 'n',
  lavender: 'i',
  purple: 'P',
  violet: 'V',
  grey: 'G',
  lightGrey: 'L',
  charcoal: 'C',
};

const colorNamesByCode = Object.fromEntries(Object.entries(colorCodes).map(([name, code]) => [code, name]));

function makeGrid(width: number, height: number) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => '.'));
}

function dot(grid: string[][], x: number, y: number, key: string) {
  if (grid[y]?.[x] !== undefined) grid[y][x] = key;
}

function rect(grid: string[][], x: number, y: number, w: number, h: number, key: string) {
  for (let row = y; row < y + h; row += 1) {
    for (let col = x; col < x + w; col += 1) dot(grid, col, row, key);
  }
}

function ellipse(grid: string[][], cx: number, cy: number, rx: number, ry: number, key: string) {
  for (let row = Math.floor(cy - ry); row <= Math.ceil(cy + ry); row += 1) {
    for (let col = Math.floor(cx - rx); col <= Math.ceil(cx + rx); col += 1) {
      const dx = (col - cx) / rx;
      const dy = (row - cy) / ry;
      if (dx * dx + dy * dy <= 1) dot(grid, col, row, key);
    }
  }
}

function ring(grid: string[][], cx: number, cy: number, rx: number, ry: number, key: string) {
  ellipse(grid, cx, cy, rx, ry, key);
  ellipse(grid, cx, cy, Math.max(1, rx - 1.6), Math.max(1, ry - 1.6), '.');
}

function line(grid: string[][], x0: number, y0: number, x1: number, y1: number, key: string, thickness = 1) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i += 1) {
    const x = Math.round(x0 + ((x1 - x0) * i) / steps);
    const y = Math.round(y0 + ((y1 - y0) * i) / steps);
    rect(grid, x - Math.floor(thickness / 2), y - Math.floor(thickness / 2), thickness, thickness, key);
  }
}

function diamond(grid: string[][], cx: number, cy: number, radius: number, key: string) {
  for (let row = cy - radius; row <= cy + radius; row += 1) {
    const span = radius - Math.abs(row - cy);
    rect(grid, cx - span, row, span * 2 + 1, 1, key);
  }
}

function sparkle(grid: string[][], x: number, y: number, key: string) {
  dot(grid, x, y, key);
  dot(grid, x - 1, y, key);
  dot(grid, x + 1, y, key);
  dot(grid, x, y - 1, key);
  dot(grid, x, y + 1, key);
}

function outline(grid: string[][], key = 'outline') {
  const copy = grid.map((row) => [...row]);
  for (let y = 0; y < copy.length; y += 1) {
    for (let x = 0; x < copy[y].length; x += 1) {
      if (copy[y][x] === '.') continue;
      for (let oy = -1; oy <= 1; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          if (Math.abs(ox) + Math.abs(oy) !== 1) continue;
          if (grid[y + oy]?.[x + ox] === '.') grid[y + oy][x + ox] = key;
        }
      }
    }
  }
}

function build(width: number, height: number, draw: (grid: string[][]) => void) {
  const grid = makeGrid(width, height);
  draw(grid);
  return grid.map((row) => row.map((key) => (key === '.' ? '.' : colorCodes[key] ?? key)).join(''));
}

const baseTemplates: PatternTemplate[] = [
  {
    id: 'hat-kitty-portrait',
    title: 'Bow Hat Kitty Portrait',
    category: 'Animals',
    width: 58,
    height: 58,
    palette,
    tags: ['cat', 'bow', 'cute mascot'],
    difficulty: 'Detailed',
    cells: build(58, 58, (g) => {
      ellipse(g, 29, 31, 18, 17, 'tan');
      ellipse(g, 19, 22, 7, 10, 'tan');
      ellipse(g, 39, 22, 7, 10, 'tan');
      ellipse(g, 19, 23, 4, 6, 'pink');
      ellipse(g, 39, 23, 4, 6, 'pink');
      ellipse(g, 29, 37, 11, 8, 'cream');
      ellipse(g, 22, 31, 5, 5, 'white');
      ellipse(g, 36, 31, 5, 5, 'white');
      ellipse(g, 22, 31, 2, 3, 'green');
      ellipse(g, 36, 31, 2, 3, 'green');
      rect(g, 22, 31, 1, 2, 'black');
      rect(g, 36, 31, 1, 2, 'black');
      rect(g, 28, 36, 3, 2, 'pink');
      line(g, 16, 37, 7, 35, 'brown');
      line(g, 16, 40, 7, 41, 'brown');
      line(g, 42, 37, 51, 35, 'brown');
      line(g, 42, 40, 51, 41, 'brown');
      rect(g, 22, 18, 14, 3, 'caramel');
      rect(g, 18, 13, 22, 5, 'orange');
      rect(g, 24, 8, 11, 8, 'cream');
      rect(g, 21, 10, 18, 3, 'red');
      rect(g, 28, 6, 5, 3, 'mint');
      line(g, 23, 26, 15, 23, 'caramel', 2);
      line(g, 35, 26, 43, 23, 'caramel', 2);
      line(g, 26, 18, 20, 14, 'brown', 2);
      line(g, 32, 18, 38, 14, 'brown', 2);
      outline(g);
    }),
  },
  {
    id: 'red-panda-gamer',
    title: 'Red Panda Gamer',
    category: 'Animals',
    width: 60,
    height: 58,
    palette,
    tags: ['red panda', 'animal', 'cute'],
    difficulty: 'Detailed',
    cells: build(60, 58, (g) => {
      ellipse(g, 30, 31, 19, 16, 'orange');
      ellipse(g, 16, 20, 8, 9, 'orange');
      ellipse(g, 44, 20, 8, 9, 'orange');
      ellipse(g, 16, 20, 4, 5, 'darkBrown');
      ellipse(g, 44, 20, 4, 5, 'darkBrown');
      ellipse(g, 30, 36, 14, 10, 'cream');
      ellipse(g, 22, 31, 5, 6, 'white');
      ellipse(g, 38, 31, 5, 6, 'white');
      rect(g, 20, 31, 4, 3, 'black');
      rect(g, 36, 31, 4, 3, 'black');
      rect(g, 28, 37, 4, 2, 'black');
      line(g, 25, 42, 30, 45, 'brown');
      line(g, 35, 42, 30, 45, 'brown');
      rect(g, 18, 47, 24, 5, 'teal');
      rect(g, 14, 48, 7, 4, 'charcoal');
      rect(g, 39, 48, 7, 4, 'charcoal');
      rect(g, 26, 48, 8, 3, 'sky');
      line(g, 14, 31, 9, 29, 'darkBrown', 2);
      line(g, 46, 31, 51, 29, 'darkBrown', 2);
      outline(g);
    }),
  },
  {
    id: 'axolotl-bubble',
    title: 'Axolotl Bubble Friend',
    category: 'Animals',
    width: 60,
    height: 56,
    palette,
    tags: ['axolotl', 'aquarium', 'kawaii'],
    difficulty: 'Detailed',
    cells: build(60, 56, (g) => {
      ellipse(g, 30, 31, 18, 13, 'pink');
      ellipse(g, 19, 20, 6, 5, 'rose');
      ellipse(g, 13, 24, 7, 4, 'rose');
      ellipse(g, 41, 20, 6, 5, 'rose');
      ellipse(g, 47, 24, 7, 4, 'rose');
      ellipse(g, 22, 31, 4, 5, 'white');
      ellipse(g, 38, 31, 4, 5, 'white');
      rect(g, 22, 31, 2, 3, 'black');
      rect(g, 38, 31, 2, 3, 'black');
      rect(g, 28, 36, 4, 2, 'rose');
      line(g, 18, 38, 12, 42, 'pink', 3);
      line(g, 42, 38, 48, 42, 'pink', 3);
      ellipse(g, 30, 43, 10, 5, 'pink');
      ring(g, 10, 10, 3, 3, 'sky');
      ring(g, 50, 12, 4, 4, 'sky');
      ring(g, 47, 42, 3, 3, 'sky');
      sparkle(g, 13, 47, 'white');
      sparkle(g, 52, 31, 'white');
      outline(g);
    }),
  },
  {
    id: 'capybara-hot-spring',
    title: 'Capybara Hot Spring',
    category: 'Animals',
    width: 64,
    height: 52,
    palette,
    tags: ['capybara', 'cozy', 'animal'],
    difficulty: 'Detailed',
    cells: build(64, 52, (g) => {
      ellipse(g, 31, 27, 18, 11, 'tan');
      ellipse(g, 43, 23, 10, 9, 'tan');
      ellipse(g, 35, 39, 26, 7, 'sky');
      ellipse(g, 35, 41, 28, 5, 'blue');
      rect(g, 16, 33, 28, 5, 'tan');
      ellipse(g, 45, 24, 2, 2, 'black');
      rect(g, 51, 26, 3, 2, 'darkBrown');
      rect(g, 39, 16, 4, 4, 'brown');
      rect(g, 49, 16, 4, 4, 'brown');
      ellipse(g, 45, 30, 5, 3, 'cream');
      ellipse(g, 49, 13, 4, 4, 'orange');
      ellipse(g, 52, 11, 3, 3, 'orange');
      ellipse(g, 46, 10, 3, 3, 'green');
      line(g, 10, 38, 55, 36, 'white', 2);
      line(g, 8, 44, 58, 43, 'white', 2);
      sparkle(g, 12, 16, 'white');
      sparkle(g, 56, 20, 'white');
      outline(g);
    }),
  },
  {
    id: 'magical-girl-original',
    title: 'Anime Star Guardian',
    category: 'Kawaii',
    width: 64,
    height: 64,
    palette,
    tags: ['anime style', 'idol', 'character'],
    difficulty: 'Advanced',
    cells: build(64, 64, (g) => {
      ellipse(g, 32, 31, 15, 17, 'cream');
      ellipse(g, 32, 26, 20, 17, 'pink');
      ellipse(g, 19, 31, 7, 18, 'rose');
      ellipse(g, 45, 31, 7, 18, 'rose');
      line(g, 21, 16, 31, 33, 'rose', 4);
      line(g, 43, 16, 33, 33, 'rose', 4);
      ellipse(g, 25, 32, 5, 5, 'white');
      ellipse(g, 39, 32, 5, 5, 'white');
      ellipse(g, 25, 32, 3, 4, 'purple');
      ellipse(g, 39, 32, 3, 4, 'purple');
      rect(g, 26, 31, 1, 2, 'black');
      rect(g, 40, 31, 1, 2, 'black');
      rect(g, 30, 39, 5, 2, 'rose');
      ellipse(g, 32, 51, 18, 10, 'lavender');
      diamond(g, 32, 48, 6, 'yellow');
      rect(g, 18, 46, 28, 3, 'white');
      line(g, 15, 11, 25, 6, 'yellow', 2);
      line(g, 49, 11, 39, 6, 'yellow', 2);
      sparkle(g, 12, 12, 'white');
      sparkle(g, 52, 17, 'white');
      outline(g);
    }),
  },
  {
    id: 'kawaii-frog-boba',
    title: 'Kawaii Frog Boba',
    category: 'Kawaii',
    width: 56,
    height: 60,
    palette,
    tags: ['frog', 'boba', 'cute'],
    difficulty: 'Detailed',
    cells: build(56, 60, (g) => {
      ellipse(g, 28, 30, 17, 14, 'green');
      ellipse(g, 19, 18, 7, 7, 'green');
      ellipse(g, 37, 18, 7, 7, 'green');
      ellipse(g, 19, 18, 4, 4, 'white');
      ellipse(g, 37, 18, 4, 4, 'white');
      dot(g, 19, 18, 'black');
      dot(g, 37, 18, 'black');
      ellipse(g, 28, 35, 10, 6, 'cream');
      rect(g, 23, 32, 2, 1, 'black');
      rect(g, 32, 32, 2, 1, 'black');
      line(g, 25, 37, 31, 37, 'black');
      rect(g, 17, 43, 22, 11, 'tan');
      rect(g, 19, 40, 18, 4, 'cream');
      rect(g, 19, 53, 18, 2, 'brown');
      dot(g, 22, 49, 'brown');
      dot(g, 28, 51, 'brown');
      dot(g, 34, 48, 'brown');
      line(g, 35, 37, 44, 26, 'charcoal', 2);
      outline(g);
    }),
  },
  {
    id: 'sakura-ramen-bowl',
    title: 'Sakura Ramen Bowl',
    category: 'Food',
    width: 64,
    height: 52,
    palette,
    tags: ['ramen', 'food', 'japanese inspired'],
    difficulty: 'Detailed',
    cells: build(64, 52, (g) => {
      ellipse(g, 32, 29, 23, 8, 'cream');
      ellipse(g, 32, 32, 25, 11, 'red');
      rect(g, 12, 30, 40, 11, 'red');
      rect(g, 17, 41, 30, 4, 'white');
      for (let x = 18; x < 46; x += 3) line(g, x, 22, x + 7, 28, 'yellow', 2);
      ellipse(g, 23, 24, 5, 4, 'white');
      ellipse(g, 39, 24, 5, 4, 'white');
      rect(g, 22, 24, 2, 2, 'yellow');
      rect(g, 38, 24, 2, 2, 'yellow');
      rect(g, 46, 16, 3, 18, 'brown');
      rect(g, 50, 15, 3, 18, 'brown');
      rect(g, 22, 35, 20, 3, 'cream');
      dot(g, 20, 17, 'pink');
      dot(g, 24, 15, 'pink');
      dot(g, 28, 18, 'pink');
      dot(g, 15, 22, 'green');
      dot(g, 48, 27, 'green');
      outline(g);
    }),
  },
  {
    id: 'strawberry-cake-slice',
    title: 'Strawberry Cake Slice',
    category: 'Food',
    width: 58,
    height: 58,
    palette,
    tags: ['cake', 'strawberry', 'dessert'],
    difficulty: 'Detailed',
    cells: build(58, 58, (g) => {
      line(g, 13, 18, 47, 28, 'cream', 8);
      line(g, 13, 28, 47, 38, 'pink', 8);
      line(g, 13, 38, 47, 47, 'cream', 8);
      line(g, 13, 23, 47, 33, 'white', 3);
      line(g, 13, 33, 47, 43, 'white', 3);
      ellipse(g, 30, 13, 8, 6, 'red');
      rect(g, 28, 8, 4, 4, 'green');
      dot(g, 28, 13, 'yellow');
      dot(g, 32, 15, 'yellow');
      dot(g, 34, 12, 'yellow');
      rect(g, 43, 27, 5, 17, 'tan');
      rect(g, 44, 31, 4, 4, 'red');
      rect(g, 19, 31, 4, 3, 'red');
      rect(g, 28, 38, 4, 3, 'red');
      outline(g);
    }),
  },
  {
    id: 'rainbow-macaron-stack',
    title: 'Rainbow Macaron Stack',
    category: 'Food',
    width: 62,
    height: 58,
    palette,
    tags: ['macaron', 'dessert', 'rainbow'],
    difficulty: 'Advanced',
    cells: build(62, 58, (g) => {
      ellipse(g, 31, 13, 18, 6, 'pink');
      rect(g, 16, 13, 30, 5, 'pink');
      rect(g, 18, 18, 26, 3, 'cream');
      ellipse(g, 31, 23, 18, 6, 'mint');
      rect(g, 16, 23, 30, 5, 'mint');
      rect(g, 18, 28, 26, 3, 'cream');
      ellipse(g, 31, 33, 18, 6, 'yellow');
      rect(g, 16, 33, 30, 5, 'yellow');
      rect(g, 18, 38, 26, 3, 'cream');
      ellipse(g, 31, 43, 18, 6, 'lavender');
      rect(g, 16, 43, 30, 5, 'lavender');
      rect(g, 20, 48, 22, 3, 'cream');
      dot(g, 21, 14, 'white');
      dot(g, 36, 24, 'white');
      dot(g, 26, 34, 'white');
      dot(g, 40, 44, 'white');
      sparkle(g, 10, 18, 'white');
      sparkle(g, 51, 36, 'white');
      outline(g);
    }),
  },
  {
    id: 'sushi-cat-bento',
    title: 'Sushi Cat Bento',
    category: 'Food',
    width: 64,
    height: 60,
    palette,
    tags: ['sushi', 'cat', 'bento'],
    difficulty: 'Advanced',
    cells: build(64, 60, (g) => {
      rect(g, 12, 35, 40, 12, 'red');
      rect(g, 15, 39, 34, 7, 'white');
      ellipse(g, 32, 25, 15, 12, 'white');
      ellipse(g, 23, 19, 5, 7, 'white');
      ellipse(g, 41, 19, 5, 7, 'white');
      ellipse(g, 23, 20, 2, 4, 'pink');
      ellipse(g, 41, 20, 2, 4, 'pink');
      ellipse(g, 27, 26, 3, 3, 'black');
      ellipse(g, 37, 26, 3, 3, 'black');
      rect(g, 31, 30, 3, 2, 'pink');
      rect(g, 25, 36, 14, 6, 'orange');
      rect(g, 21, 42, 22, 3, 'green');
      rect(g, 8, 45, 48, 4, 'darkBrown');
      dot(g, 17, 29, 'blush');
      dot(g, 47, 29, 'blush');
      sparkle(g, 12, 15, 'white');
      outline(g);
    }),
  },
  {
    id: 'mushroom-forest-cottage',
    title: 'Mushroom Forest Cottage',
    category: 'Nature',
    width: 64,
    height: 58,
    palette,
    tags: ['mushroom', 'cottagecore', 'forest'],
    difficulty: 'Advanced',
    cells: build(64, 58, (g) => {
      rect(g, 0, 39, 64, 19, 'leaf');
      ellipse(g, 32, 27, 20, 11, 'red');
      rect(g, 20, 29, 24, 22, 'cream');
      rect(g, 18, 36, 28, 15, 'tan');
      ellipse(g, 22, 24, 5, 4, 'white');
      ellipse(g, 34, 20, 6, 5, 'white');
      ellipse(g, 43, 27, 4, 4, 'white');
      rect(g, 28, 39, 8, 12, 'brown');
      rect(g, 22, 36, 5, 5, 'sky');
      rect(g, 38, 36, 5, 5, 'sky');
      line(g, 24, 36, 24, 40, 'navy');
      line(g, 40, 36, 40, 40, 'navy');
      rect(g, 8, 31, 5, 17, 'brown');
      ellipse(g, 10, 25, 11, 9, 'green');
      rect(g, 51, 34, 4, 14, 'brown');
      ellipse(g, 53, 29, 9, 7, 'green');
      sparkle(g, 14, 44, 'yellow');
      sparkle(g, 50, 46, 'yellow');
      outline(g);
    }),
  },
  {
    id: 'cherry-blossom-bridge',
    title: 'Cherry Blossom Bridge',
    category: 'Nature',
    width: 68,
    height: 54,
    palette,
    tags: ['sakura', 'bridge', 'landscape'],
    difficulty: 'Advanced',
    cells: build(68, 54, (g) => {
      rect(g, 0, 0, 68, 24, 'sky');
      rect(g, 0, 24, 68, 30, 'mint');
      line(g, 0, 36, 67, 31, 'blue', 5);
      line(g, 0, 42, 67, 38, 'white', 2);
      line(g, 10, 38, 55, 28, 'red', 4);
      line(g, 12, 35, 56, 25, 'darkBrown', 2);
      rect(g, 13, 34, 4, 9, 'darkBrown');
      rect(g, 29, 31, 4, 9, 'darkBrown');
      rect(g, 45, 28, 4, 9, 'darkBrown');
      rect(g, 8, 12, 5, 23, 'brown');
      ellipse(g, 12, 10, 13, 9, 'pink');
      ellipse(g, 23, 12, 12, 8, 'pink');
      rect(g, 55, 14, 4, 18, 'brown');
      ellipse(g, 55, 12, 10, 8, 'pink');
      ellipse(g, 62, 17, 9, 7, 'pink');
      dot(g, 18, 19, 'rose');
      dot(g, 51, 22, 'rose');
      sparkle(g, 35, 17, 'white');
      outline(g);
    }),
  },
  {
    id: 'butterfly-garden',
    title: 'Butterfly Garden',
    category: 'Nature',
    width: 62,
    height: 62,
    palette,
    tags: ['butterfly', 'flower', 'garden'],
    difficulty: 'Advanced',
    cells: build(62, 62, (g) => {
      ellipse(g, 31, 31, 4, 18, 'darkBrown');
      ellipse(g, 21, 24, 13, 14, 'purple');
      ellipse(g, 41, 24, 13, 14, 'purple');
      ellipse(g, 22, 40, 10, 12, 'pink');
      ellipse(g, 40, 40, 10, 12, 'pink');
      diamond(g, 21, 24, 5, 'sky');
      diamond(g, 41, 24, 5, 'sky');
      diamond(g, 23, 40, 4, 'yellow');
      diamond(g, 39, 40, 4, 'yellow');
      line(g, 29, 14, 23, 8, 'darkBrown', 2);
      line(g, 33, 14, 39, 8, 'darkBrown', 2);
      rect(g, 0, 53, 62, 9, 'green');
      for (let x = 8; x < 56; x += 10) {
        rect(g, x, 47, 2, 7, 'green');
        ellipse(g, x + 1, 45, 4, 3, x % 20 === 8 ? 'yellow' : 'rose');
      }
      outline(g);
    }),
  },
  {
    id: 'ocean-turtle-wave',
    title: 'Ocean Turtle Wave',
    category: 'Nature',
    width: 64,
    height: 52,
    palette,
    tags: ['turtle', 'ocean', 'summer'],
    difficulty: 'Detailed',
    cells: build(64, 52, (g) => {
      rect(g, 0, 36, 64, 16, 'blue');
      line(g, 0, 34, 63, 27, 'sky', 4);
      line(g, 4, 42, 60, 38, 'white', 2);
      ellipse(g, 33, 27, 15, 10, 'green');
      ellipse(g, 45, 25, 6, 5, 'leaf');
      ellipse(g, 21, 24, 7, 4, 'leaf');
      ellipse(g, 25, 35, 7, 4, 'leaf');
      ellipse(g, 41, 36, 7, 4, 'leaf');
      ellipse(g, 33, 27, 9, 6, 'lime');
      line(g, 26, 27, 40, 27, 'green', 2);
      line(g, 33, 21, 33, 34, 'green', 2);
      dot(g, 47, 24, 'black');
      ellipse(g, 50, 12, 6, 6, 'yellow');
      sparkle(g, 12, 14, 'white');
      outline(g);
    }),
  },
  {
    id: 'lava-slime-boss',
    title: 'Lava Slime Boss',
    category: 'Game Style',
    width: 64,
    height: 56,
    palette,
    tags: ['slime', 'boss', 'game sprite'],
    difficulty: 'Advanced',
    cells: build(64, 56, (g) => {
      ellipse(g, 32, 31, 20, 16, 'orange');
      ellipse(g, 32, 27, 16, 12, 'red');
      ellipse(g, 24, 30, 5, 5, 'yellow');
      ellipse(g, 40, 30, 5, 5, 'yellow');
      rect(g, 23, 31, 4, 3, 'black');
      rect(g, 39, 31, 4, 3, 'black');
      rect(g, 25, 40, 14, 3, 'black');
      line(g, 18, 20, 11, 11, 'red', 5);
      line(g, 46, 20, 53, 11, 'red', 5);
      diamond(g, 32, 16, 6, 'yellow');
      rect(g, 12, 44, 40, 6, 'red');
      rect(g, 16, 48, 32, 4, 'orange');
      sparkle(g, 10, 29, 'yellow');
      sparkle(g, 52, 37, 'yellow');
      outline(g);
    }),
  },
  {
    id: 'retro-arcade-robot',
    title: 'Retro Arcade Robot',
    category: 'Game Style',
    width: 64,
    height: 64,
    palette,
    tags: ['robot', 'arcade', 'retro'],
    difficulty: 'Advanced',
    cells: build(64, 64, (g) => {
      rect(g, 19, 16, 26, 22, 'lightGrey');
      rect(g, 22, 19, 20, 14, 'sky');
      rect(g, 24, 23, 5, 5, 'blue');
      rect(g, 35, 23, 5, 5, 'blue');
      rect(g, 29, 32, 6, 2, 'charcoal');
      rect(g, 16, 38, 32, 17, 'grey');
      rect(g, 23, 42, 6, 6, 'red');
      rect(g, 35, 42, 6, 6, 'yellow');
      line(g, 16, 43, 7, 35, 'grey', 4);
      line(g, 48, 43, 57, 35, 'grey', 4);
      rect(g, 5, 33, 6, 6, 'lightGrey');
      rect(g, 53, 33, 6, 6, 'lightGrey');
      rect(g, 24, 55, 5, 7, 'charcoal');
      rect(g, 35, 55, 5, 7, 'charcoal');
      line(g, 32, 16, 32, 8, 'grey', 2);
      diamond(g, 32, 7, 3, 'red');
      outline(g);
    }),
  },
  {
    id: 'dragon-hatchling',
    title: 'Tiny Crystal Dragon',
    category: 'Game Style',
    width: 64,
    height: 60,
    palette,
    tags: ['dragon', 'fantasy pet', 'sprite'],
    difficulty: 'Advanced',
    cells: build(64, 60, (g) => {
      ellipse(g, 33, 31, 16, 13, 'green');
      ellipse(g, 46, 25, 9, 8, 'green');
      ellipse(g, 21, 40, 10, 8, 'green');
      line(g, 18, 24, 7, 14, 'purple', 4);
      line(g, 46, 37, 58, 48, 'purple', 4);
      diamond(g, 42, 13, 5, 'yellow');
      line(g, 42, 19, 42, 25, 'green', 3);
      rect(g, 47, 23, 2, 3, 'black');
      rect(g, 51, 27, 4, 2, 'white');
      rect(g, 28, 20, 3, 4, 'lime');
      rect(g, 33, 19, 3, 4, 'lime');
      rect(g, 38, 20, 3, 4, 'lime');
      ellipse(g, 31, 32, 8, 6, 'lime');
      line(g, 23, 45, 17, 52, 'green', 4);
      line(g, 41, 43, 48, 51, 'green', 4);
      ellipse(g, 15, 53, 5, 2, 'charcoal');
      ellipse(g, 50, 53, 5, 2, 'charcoal');
      line(g, 52, 24, 59, 21, 'red', 2);
      outline(g);
    }),
  },
  {
    id: 'crystal-sword-shield',
    title: 'Crystal Sword & Shield',
    category: 'Game Style',
    width: 60,
    height: 64,
    palette,
    tags: ['game', 'sword', 'fantasy'],
    difficulty: 'Detailed',
    cells: build(60, 64, (g) => {
      for (let i = 0; i < 25; i += 1) {
        dot(g, 18 + i, 9 + i, 'sky');
        dot(g, 19 + i, 9 + i, 'blue');
        dot(g, 17 + i, 10 + i, 'white');
        dot(g, 20 + i, 10 + i, 'navy');
      }
      rect(g, 26, 38, 17, 4, 'gold');
      rect(g, 34, 40, 4, 12, 'brown');
      rect(g, 30, 51, 12, 4, 'red');
      diamond(g, 22, 40, 13, 'purple');
      diamond(g, 22, 40, 8, 'lavender');
      diamond(g, 22, 40, 4, 'white');
      line(g, 22, 28, 22, 52, 'violet', 2);
      line(g, 10, 40, 34, 40, 'violet', 2);
      outline(g);
    }),
  },
  {
    id: 'electric-pocket-mouse',
    title: 'Spark Mouse Mascot',
    category: 'Kawaii',
    width: 64,
    height: 62,
    palette,
    tags: ['electric mascot', 'spark', 'cute'],
    difficulty: 'Advanced',
    cells: build(64, 62, (g) => {
      ellipse(g, 32, 32, 17, 15, 'yellow');
      ellipse(g, 21, 19, 7, 10, 'yellow');
      ellipse(g, 43, 19, 7, 10, 'yellow');
      ellipse(g, 20, 14, 4, 5, 'black');
      ellipse(g, 44, 14, 4, 5, 'black');
      ellipse(g, 25, 32, 4, 5, 'white');
      ellipse(g, 39, 32, 4, 5, 'white');
      rect(g, 25, 32, 2, 3, 'black');
      rect(g, 39, 32, 2, 3, 'black');
      ellipse(g, 20, 38, 4, 4, 'red');
      ellipse(g, 44, 38, 4, 4, 'red');
      rect(g, 30, 38, 4, 2, 'black');
      line(g, 22, 45, 12, 54, 'yellow', 5);
      line(g, 42, 45, 52, 54, 'yellow', 5);
      line(g, 46, 28, 58, 18, 'yellow', 5);
      line(g, 54, 18, 58, 8, 'brown', 5);
      sparkle(g, 12, 12, 'sky');
      sparkle(g, 53, 43, 'sky');
      outline(g);
    }),
  },
  {
    id: 'dark-bunny-hood',
    title: 'Dark Bunny Hood',
    category: 'Kawaii',
    width: 64,
    height: 64,
    palette,
    tags: ['dark cute', 'bunny', 'hood'],
    difficulty: 'Advanced',
    cells: build(64, 64, (g) => {
      ellipse(g, 32, 33, 18, 17, 'black');
      ellipse(g, 22, 15, 7, 15, 'black');
      ellipse(g, 42, 15, 7, 15, 'black');
      ellipse(g, 22, 16, 3, 11, 'pink');
      ellipse(g, 42, 16, 3, 11, 'pink');
      ellipse(g, 32, 35, 13, 12, 'white');
      ellipse(g, 26, 33, 4, 5, 'white');
      ellipse(g, 38, 33, 4, 5, 'white');
      rect(g, 26, 33, 2, 3, 'black');
      rect(g, 38, 33, 2, 3, 'black');
      rect(g, 30, 39, 4, 2, 'pink');
      rect(g, 17, 45, 30, 8, 'purple');
      rect(g, 21, 49, 22, 5, 'violet');
      diamond(g, 47, 18, 5, 'pink');
      diamond(g, 17, 20, 4, 'lavender');
      sparkle(g, 50, 47, 'white');
      outline(g);
    }),
  },
  {
    id: 'block-world-adventurer',
    title: 'Block World Adventurer',
    category: 'Game Style',
    width: 64,
    height: 64,
    palette,
    tags: ['block game', 'adventure', 'sprite'],
    difficulty: 'Advanced',
    cells: build(64, 64, (g) => {
      rect(g, 22, 8, 20, 18, 'tan');
      rect(g, 18, 26, 28, 22, 'sky');
      rect(g, 24, 48, 6, 12, 'blue');
      rect(g, 34, 48, 6, 12, 'blue');
      rect(g, 16, 29, 6, 17, 'tan');
      rect(g, 46, 29, 6, 17, 'tan');
      rect(g, 22, 8, 20, 6, 'brown');
      rect(g, 18, 14, 8, 8, 'brown');
      rect(g, 25, 18, 4, 4, 'white');
      rect(g, 36, 18, 4, 4, 'white');
      rect(g, 26, 19, 2, 3, 'blue');
      rect(g, 37, 19, 2, 3, 'blue');
      rect(g, 30, 24, 5, 2, 'brown');
      line(g, 47, 28, 57, 16, 'grey', 4);
      line(g, 51, 15, 59, 8, 'sky', 5);
      rect(g, 13, 53, 38, 5, 'green');
      outline(g);
    }),
  },
  {
    id: 'blue-alien-surf-buddy',
    title: 'Blue Alien Surf Buddy',
    category: 'Kawaii',
    width: 66,
    height: 60,
    palette,
    tags: ['blue alien', 'surf', 'cute'],
    difficulty: 'Advanced',
    cells: build(66, 60, (g) => {
      ellipse(g, 33, 30, 18, 14, 'blue');
      ellipse(g, 18, 20, 10, 7, 'blue');
      ellipse(g, 48, 20, 10, 7, 'blue');
      ellipse(g, 22, 31, 6, 6, 'white');
      ellipse(g, 44, 31, 6, 6, 'white');
      ellipse(g, 23, 31, 3, 4, 'black');
      ellipse(g, 43, 31, 3, 4, 'black');
      ellipse(g, 33, 38, 10, 4, 'sky');
      line(g, 19, 42, 9, 51, 'blue', 4);
      line(g, 47, 42, 57, 51, 'blue', 4);
      line(g, 13, 51, 52, 47, 'yellow', 5);
      line(g, 18, 50, 47, 47, 'orange', 2);
      rect(g, 27, 44, 12, 5, 'mint');
      sparkle(g, 12, 12, 'white');
      sparkle(g, 55, 15, 'white');
      outline(g);
    }),
  },
  {
    id: 'idol-demon-hunter',
    title: 'Idol Demon Hunter',
    category: 'Game Style',
    width: 64,
    height: 70,
    palette,
    tags: ['idol', 'fantasy', 'anime'],
    difficulty: 'Advanced',
    cells: build(64, 70, (g) => {
      ellipse(g, 32, 28, 15, 16, 'cream');
      ellipse(g, 32, 24, 19, 15, 'purple');
      line(g, 18, 19, 10, 10, 'violet', 4);
      line(g, 46, 19, 54, 10, 'violet', 4);
      ellipse(g, 25, 29, 4, 5, 'white');
      ellipse(g, 39, 29, 4, 5, 'white');
      rect(g, 25, 29, 2, 3, 'black');
      rect(g, 39, 29, 2, 3, 'black');
      rect(g, 29, 37, 6, 2, 'rose');
      rect(g, 20, 44, 24, 15, 'charcoal');
      rect(g, 25, 45, 14, 5, 'red');
      diamond(g, 32, 49, 5, 'yellow');
      line(g, 15, 44, 8, 59, 'red', 4);
      line(g, 49, 44, 56, 59, 'red', 4);
      line(g, 9, 59, 4, 66, 'grey', 3);
      line(g, 55, 59, 60, 66, 'grey', 3);
      sparkle(g, 12, 26, 'white');
      sparkle(g, 52, 33, 'white');
      outline(g);
    }),
  },
  {
    id: 'astronaut-cat-orbit',
    title: 'Astronaut Cat Orbit',
    category: 'Space',
    width: 64,
    height: 64,
    palette,
    tags: ['cat', 'astronaut', 'space'],
    difficulty: 'Advanced',
    cells: build(64, 64, (g) => {
      ellipse(g, 32, 30, 18, 18, 'white');
      ellipse(g, 32, 31, 13, 12, 'sky');
      ellipse(g, 32, 33, 10, 9, 'tan');
      ellipse(g, 26, 26, 4, 5, 'tan');
      ellipse(g, 38, 26, 4, 5, 'tan');
      ellipse(g, 26, 26, 2, 3, 'pink');
      ellipse(g, 38, 26, 2, 3, 'pink');
      ellipse(g, 28, 34, 3, 3, 'white');
      ellipse(g, 36, 34, 3, 3, 'white');
      dot(g, 28, 34, 'black');
      dot(g, 36, 34, 'black');
      rect(g, 31, 38, 3, 2, 'pink');
      rect(g, 23, 46, 18, 10, 'white');
      rect(g, 27, 48, 10, 5, 'blue');
      line(g, 12, 47, 23, 42, 'white', 4);
      line(g, 41, 42, 52, 47, 'white', 4);
      ring(g, 14, 14, 7, 4, 'lavender');
      line(g, 5, 14, 23, 14, 'purple', 2);
      ellipse(g, 51, 17, 5, 5, 'yellow');
      sparkle(g, 12, 35, 'white');
      sparkle(g, 52, 44, 'white');
      outline(g);
    }),
  },
  {
    id: 'moon-crystal-moth',
    title: 'Moon Crystal Moth',
    category: 'Space',
    width: 64,
    height: 62,
    palette,
    tags: ['moon', 'moth', 'celestial'],
    difficulty: 'Advanced',
    cells: build(64, 62, (g) => {
      ellipse(g, 32, 31, 5, 18, 'lavender');
      ellipse(g, 20, 28, 14, 16, 'purple');
      ellipse(g, 44, 28, 14, 16, 'purple');
      ellipse(g, 21, 30, 9, 11, 'sky');
      ellipse(g, 43, 30, 9, 11, 'sky');
      diamond(g, 20, 28, 4, 'white');
      diamond(g, 44, 28, 4, 'white');
      ellipse(g, 32, 18, 6, 6, 'cream');
      line(g, 29, 14, 23, 7, 'lavender', 2);
      line(g, 35, 14, 41, 7, 'lavender', 2);
      ellipse(g, 48, 11, 7, 7, 'yellow');
      ellipse(g, 51, 9, 6, 7, 'black');
      diamond(g, 32, 45, 7, 'teal');
      sparkle(g, 12, 13, 'white');
      sparkle(g, 53, 39, 'white');
      outline(g);
    }),
  },
  {
    id: 'planet-ring-whale',
    title: 'Planet Ring Whale',
    category: 'Space',
    width: 68,
    height: 58,
    palette,
    tags: ['space whale', 'planet', 'dreamy'],
    difficulty: 'Advanced',
    cells: build(68, 58, (g) => {
      ellipse(g, 33, 31, 20, 10, 'blue');
      ellipse(g, 49, 27, 8, 6, 'blue');
      line(g, 16, 30, 5, 22, 'sky', 5);
      line(g, 16, 33, 5, 42, 'sky', 5);
      ellipse(g, 37, 34, 11, 5, 'sky');
      dot(g, 50, 26, 'black');
      line(g, 14, 38, 52, 19, 'lavender', 3);
      line(g, 17, 41, 55, 22, 'purple', 2);
      ellipse(g, 20, 15, 7, 7, 'yellow');
      ring(g, 52, 42, 6, 4, 'mint');
      sparkle(g, 11, 12, 'white');
      sparkle(g, 58, 18, 'white');
      sparkle(g, 28, 48, 'white');
      outline(g);
    }),
  },
  {
    id: 'solar-rocket',
    title: 'Solar Rocket Launch',
    category: 'Space',
    width: 64,
    height: 64,
    palette,
    tags: ['rocket', 'space', 'planet'],
    difficulty: 'Advanced',
    cells: build(64, 64, (g) => {
      ellipse(g, 50, 14, 8, 8, 'yellow');
      ring(g, 15, 14, 7, 4, 'lavender');
      line(g, 7, 14, 23, 14, 'purple', 2);
      ellipse(g, 32, 32, 8, 18, 'white');
      rect(g, 29, 13, 6, 7, 'red');
      ellipse(g, 32, 27, 4, 5, 'sky');
      line(g, 25, 39, 16, 51, 'blue', 4);
      line(g, 39, 39, 48, 51, 'blue', 4);
      rect(g, 27, 46, 10, 5, 'grey');
      ellipse(g, 29, 55, 5, 8, 'yellow');
      ellipse(g, 35, 55, 5, 8, 'orange');
      ellipse(g, 32, 58, 8, 5, 'red');
      sparkle(g, 10, 29, 'white');
      sparkle(g, 53, 35, 'white');
      sparkle(g, 20, 48, 'white');
      outline(g);
    }),
  },
  {
    id: 'winter-fox-scarf',
    title: 'Winter Fox Scarf',
    category: 'Holidays',
    width: 60,
    height: 60,
    palette,
    tags: ['fox', 'winter', 'holiday'],
    difficulty: 'Detailed',
    cells: build(60, 60, (g) => {
      ellipse(g, 30, 31, 17, 15, 'orange');
      ellipse(g, 18, 21, 7, 10, 'orange');
      ellipse(g, 42, 21, 7, 10, 'orange');
      ellipse(g, 30, 37, 11, 8, 'white');
      ellipse(g, 23, 31, 3, 4, 'black');
      ellipse(g, 37, 31, 3, 4, 'black');
      rect(g, 28, 36, 4, 2, 'black');
      rect(g, 16, 44, 29, 5, 'red');
      rect(g, 36, 48, 8, 8, 'red');
      rect(g, 20, 45, 4, 4, 'white');
      rect(g, 31, 45, 4, 4, 'white');
      sparkle(g, 10, 13, 'white');
      sparkle(g, 51, 16, 'white');
      sparkle(g, 11, 48, 'white');
      outline(g);
    }),
  },
  {
    id: 'gingerbread-cottage',
    title: 'Gingerbread Cottage',
    category: 'Holidays',
    width: 64,
    height: 60,
    palette,
    tags: ['gingerbread', 'holiday', 'cottage'],
    difficulty: 'Advanced',
    cells: build(64, 60, (g) => {
      rect(g, 16, 27, 32, 24, 'brown');
      line(g, 13, 28, 32, 11, 'darkBrown', 5);
      line(g, 32, 11, 51, 28, 'darkBrown', 5);
      line(g, 15, 27, 49, 27, 'white', 3);
      rect(g, 25, 38, 10, 13, 'darkBrown');
      rect(g, 20, 32, 7, 7, 'sky');
      rect(g, 38, 32, 7, 7, 'sky');
      line(g, 23, 32, 23, 38, 'white', 1);
      line(g, 41, 32, 41, 38, 'white', 1);
      rect(g, 12, 50, 40, 4, 'white');
      dot(g, 18, 29, 'red');
      dot(g, 24, 24, 'green');
      dot(g, 32, 20, 'red');
      dot(g, 40, 24, 'green');
      dot(g, 46, 29, 'red');
      line(g, 8, 42, 14, 36, 'red', 3);
      line(g, 54, 42, 50, 36, 'red', 3);
      sparkle(g, 9, 12, 'white');
      sparkle(g, 55, 16, 'white');
      outline(g);
    }),
  },
  {
    id: 'pumpkin-ghost-party',
    title: 'Pumpkin Ghost Party',
    category: 'Holidays',
    width: 64,
    height: 58,
    palette,
    tags: ['halloween', 'ghost', 'pumpkin'],
    difficulty: 'Advanced',
    cells: build(64, 58, (g) => {
      ellipse(g, 25, 29, 13, 17, 'white');
      rect(g, 13, 35, 24, 12, 'white');
      ellipse(g, 21, 30, 3, 4, 'black');
      ellipse(g, 30, 30, 3, 4, 'black');
      rect(g, 24, 38, 4, 3, 'black');
      ellipse(g, 43, 39, 14, 11, 'orange');
      rect(g, 40, 26, 5, 6, 'green');
      line(g, 29, 40, 34, 48, 'white', 5);
      line(g, 17, 42, 11, 49, 'white', 4);
      rect(g, 37, 39, 4, 3, 'black');
      rect(g, 47, 39, 4, 3, 'black');
      line(g, 39, 46, 49, 46, 'black', 2);
      diamond(g, 51, 16, 5, 'yellow');
      sparkle(g, 10, 14, 'lavender');
      sparkle(g, 54, 31, 'white');
      outline(g);
    }),
  },
  {
    id: 'lunar-new-year-lion',
    title: 'Lucky Lion Dance',
    category: 'Holidays',
    width: 68,
    height: 60,
    palette,
    tags: ['new year', 'lion dance', 'festival'],
    difficulty: 'Advanced',
    cells: build(68, 60, (g) => {
      ellipse(g, 34, 29, 20, 16, 'red');
      ellipse(g, 22, 23, 8, 8, 'orange');
      ellipse(g, 46, 23, 8, 8, 'orange');
      ellipse(g, 27, 30, 6, 6, 'white');
      ellipse(g, 41, 30, 6, 6, 'white');
      ellipse(g, 27, 30, 3, 3, 'black');
      ellipse(g, 41, 30, 3, 3, 'black');
      ellipse(g, 34, 39, 12, 6, 'yellow');
      rect(g, 30, 37, 8, 3, 'black');
      diamond(g, 34, 16, 6, 'yellow');
      line(g, 18, 42, 8, 51, 'red', 5);
      line(g, 50, 42, 60, 51, 'red', 5);
      rect(g, 14, 47, 40, 7, 'gold');
      dot(g, 21, 48, 'red');
      dot(g, 34, 48, 'red');
      dot(g, 47, 48, 'red');
      sparkle(g, 10, 14, 'yellow');
      sparkle(g, 57, 17, 'yellow');
      outline(g);
    }),
  },
];

function upscaleRows(cells: string[], factor: number) {
  return cells.flatMap((row) => {
    const expanded = row
      .split('')
      .map((key) => key.repeat(factor))
      .join('');
    return Array.from({ length: factor }, () => expanded);
  });
}

function upgradeTemplate(template: PatternTemplate): PatternTemplate {
  const factor = template.width >= 66 || template.height >= 66 ? 2 : 2;
  return {
    ...template,
    id: `${template.id}-large`,
    width: template.width * factor,
    height: template.height * factor,
    difficulty: 'Advanced',
    tags: Array.from(new Set([...template.tags, 'large pattern', 'popular template'])),
    cells: upscaleRows(template.cells, factor),
  };
}

const templates: PatternTemplate[] = baseTemplates.map(upgradeTemplate);

function colorCounts(template: PatternTemplate) {
  const counts = new Map<string, number>();
  template.cells.forEach((row) => {
    row.split('').forEach((key) => {
      if (key !== '.') counts.set(key, (counts.get(key) ?? 0) + 1);
    });
  });
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function colorFor(template: PatternTemplate, key: string) {
  const name = colorNamesByCode[key] ?? key;
  return template.palette[key] ?? template.palette[name] ?? '#000000';
}

function colorLabel(key: string) {
  return colorNamesByCode[key] ?? key;
}

function templateSvg(template: PatternTemplate, cellSize = 12, includeGrid = true) {
  const width = template.width * cellSize;
  const height = template.height * cellSize;
  const rects: string[] = [];
  template.cells.forEach((row, y) => {
    let runKey = '.';
    let runStart = 0;

    const flushRun = (x: number) => {
      if (runKey === '.') return;
      rects.push(
        `<rect x="${runStart * cellSize}" y="${y * cellSize}" width="${(x - runStart) * cellSize}" height="${cellSize}" fill="${colorFor(
          template,
          runKey,
        )}" />`,
      );
    };

    row.split('').forEach((key, x) => {
      if (x === 0) {
        runKey = key;
        runStart = 0;
        return;
      }
      if (key !== runKey) {
        flushRun(x);
        runKey = key;
        runStart = x;
      }
    });
    flushRun(row.length);
  });
  const grid = includeGrid
    ? `<path d="${Array.from({ length: template.width + 1 }, (_, x) => `M${x * cellSize} 0V${height}`).join(' ')} ${Array.from({ length: template.height + 1 }, (_, y) => `M0 ${y * cellSize}H${width}`).join(' ')}" stroke="rgba(0,0,0,.12)" stroke-width="1"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#ffffff"/>${rects.join('')}${grid}</svg>`;
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function downloadPng(template: PatternTemplate) {
  const svg = templateSvg(template, 18, true);
  const image = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0);
  URL.revokeObjectURL(url);
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `${template.id}.png`;
  link.click();
}

function downloadCsv(template: PatternTemplate) {
  const rows = [
    ['Template', template.title],
    ['Grid', `${template.width} x ${template.height}`],
    ['Color', 'Hex', 'Beads'],
    ...colorCounts(template).map(([key, count]) => [colorLabel(key), colorFor(template, key), String(count)]),
  ];
  download(`${template.id}-materials.csv`, rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n'), 'text/csv;charset=utf-8');
}

function PatternPreview({ template }: { template: PatternTemplate }) {
  const previewSrc = useMemo(
    () => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(templateSvg(template, 4, false))}`,
    [template],
  );

  return (
    <div className="aspect-square w-full bg-white p-2" aria-label={`${template.title} bead pattern preview`}>
      <img src={previewSrc} alt="" className="h-full w-full object-contain [image-rendering:pixelated]" draggable={false} />
    </div>
  );
}

export function Templates() {
  const [activeCategory, setActiveCategory] = useState<'All' | Category>('All');
  const navigate = useNavigate();

  const filteredTemplates = useMemo(
    () => templates.filter((template) => activeCategory === 'All' || template.category === activeCategory),
    [activeCategory],
  );

  const openInEditor = async (template: PatternTemplate) => {
    const svg = templateSvg(template, 18, false);
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    sessionStorage.setItem('uploadedImage', canvas.toDataURL('image/png'));
    navigate('/editor/');
  };

  return (
    <main className="min-h-screen bg-[#1a1a1a] px-4 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-4xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#252525] px-3 py-1.5 text-sm font-medium text-[#d4a574]">
            <Shapes className="h-4 w-4" />
            Popular downloadable bead templates
          </p>
          <h1 className="text-4xl font-bold leading-tight text-[#e8e6e3] md:text-5xl">Free Perler Bead Pattern Templates</h1>
          <p className="mt-4 text-base leading-7 text-[#9a948d]">
            Browse original, higher-detail patterns inspired by popular craft themes: cute animals, kawaii food, game-style sprites,
            space art, and seasonal decorations. Each design includes PNG, SVG, CSV, and editor import.
          </p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-shrink-0 rounded-lg border px-4 py-2 text-sm font-bold transition ${
                activeCategory === category
                  ? 'border-[#d4a574] bg-[#d4a574] text-[#1a1a1a]'
                  : 'border-[#3a3a3a] bg-[#252525] text-[#a09b94] hover:border-[#5a5a5a] hover:text-[#e8e6e3]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => {
            const counts = colorCounts(template);
            const beadCount = counts.reduce((sum, [, count]) => sum + count, 0);

            return (
              <article key={template.id} className="craft-card overflow-hidden craft-card-hover">
                <PatternPreview template={template} />
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#d4a574]">{template.category}</p>
                      <h2 className="mt-1 text-xl font-bold text-[#e8e6e3]">{template.title}</h2>
                    </div>
                    <span className="rounded-md border border-[#3a3a3a] bg-[#252525] px-2 py-1 text-xs font-bold text-[#a09b94]">
                      {template.difficulty}
                    </span>
                  </div>

                  <p className="mb-4 text-sm leading-6 text-[#9a948d]">
                    {template.width} x {template.height} grid, {counts.length} colors, {beadCount.toLocaleString()} beads. Great for{' '}
                    {template.tags.join(', ')}.
                  </p>

                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {counts.slice(0, 10).map(([key]) => (
                      <span
                        key={key}
                        className="h-5 w-5 rounded-sm border border-white/10"
                        style={{ backgroundColor: colorFor(template, key) }}
                        title={colorLabel(key)}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => downloadPng(template)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#3a3a3a] bg-[#252525] px-3 py-2 text-sm font-bold text-[#e8e6e3] hover:border-[#5a5a5a]"
                    >
                      <FileImage className="h-4 w-4" />
                      PNG
                    </button>
                    <button
                      type="button"
                      onClick={() => download(`${template.id}.svg`, templateSvg(template), 'image/svg+xml')}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#3a3a3a] bg-[#252525] px-3 py-2 text-sm font-bold text-[#e8e6e3] hover:border-[#5a5a5a]"
                    >
                      <Download className="h-4 w-4" />
                      SVG
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadCsv(template)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#3a3a3a] bg-[#252525] px-3 py-2 text-sm font-bold text-[#e8e6e3] hover:border-[#5a5a5a]"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV
                    </button>
                    <button type="button" onClick={() => openInEditor(template)} className="craft-btn inline-flex items-center justify-center gap-2 px-3 py-2 text-sm">
                      <SlidersHorizontal className="h-4 w-4" />
                      Customize
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
