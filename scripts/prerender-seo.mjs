import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const siteUrl = 'https://pixelbeads.design';
const socialImageUrl = `${siteUrl}/examples/landscape-after.webp`;
const baseHtml = await readFile(join(dist, 'index.html'), 'utf8');

const pages = [
  {
    path: '/',
    title: 'Perler Bead Pattern Maker | Image to Perler Beads',
    description:
      'Free Perler bead pattern maker and image to Perler beads converter. Upload a photo, match real Perler, Hama, Artkal or MARD colors, and export printable patterns.',
    priority: '1.0',
    body: `
      <h1>Perler Bead Pattern Maker</h1>
      <p>PixelBeads converts photos and illustrations into printable Perler bead, Hama bead, Artkal and MARD patterns in your browser.</p>
      <h2>Image to Perler Beads</h2>
      <p>Upload a JPG or PNG, choose the bead brand, set the grid width, limit colors and export a PNG or PDF pattern with bead counts.</p>
      <h2>Free Pattern Generator</h2>
      <p>Create fuse bead patterns for portraits, pets, sprites, logos and craft projects with no sign-up required.</p>
      <h2>Private Browser-Side Processing</h2>
      <p>Your image is processed locally so the photo does not need to leave your device.</p>
    `,
  },
  {
    path: '/image-to-pattern',
    title: 'Image to Perler Beads Converter | Free Pattern Maker',
    description:
      'Convert image to Perler beads online. Upload a photo and create a printable Perler bead pattern with grid size controls, color matching and bead counts.',
    priority: '0.9',
    body: `
      <h1>Image to Perler Beads Converter</h1>
      <p>Turn a photo, logo or illustration into a practical Perler bead pattern with an adjustable grid, real fuse bead palettes and exact material counts.</p>
      <h2>Photo to Perler Bead Pattern</h2>
      <p>Upload a JPG or PNG, choose the physical project size, set a realistic color limit and preview the result before printing.</p>
      <h2>Recommended Image and Grid Settings</h2>
      <p>Clear subjects, strong outlines and simple backgrounds convert best. Start at 32 to 48 columns for icons, 64 to 96 for portraits and 120 or more for detailed wall art.</p>
      <h2>Match Real Fuse Bead Colors</h2>
      <p>Use Perler, Hama, Artkal or MARD palettes, then export a PDF or PNG pattern with a color-by-color bead count.</p>
      <h2>Private Image Conversion</h2>
      <p>PixelBeads processes the source image locally in the browser. The photo does not need to be uploaded or stored on a server.</p>
    `,
  },
  {
    path: '/editor',
    title: 'Perler Bead Pattern Editor | PixelBeads',
    description:
      'Edit bead patterns, adjust palettes, replace colors, count beads and export printable Perler, Hama, Artkal or MARD designs.',
    priority: '0.8',
    body: `
      <h1>Perler Bead Pattern Editor</h1>
      <p>Edit generated bead grids, tune colors, review bead counts and export print-ready patterns.</p>
    `,
  },
  {
    path: '/gallery',
    title: 'Perler Bead Pattern Gallery | PixelBeads',
    description:
      'Browse example bead patterns made from photos, animals, landscapes and illustrations using the PixelBeads pattern maker.',
    priority: '0.8',
    body: `
      <h1>Perler Bead Pattern Gallery</h1>
      <p>Explore example photo-to-pattern results including landscape, puppy, bunny, tiger and bear bead art.</p>
    `,
  },
  {
    path: '/templates',
    title: 'Free Perler Bead Patterns and Templates | PixelBeads',
    description:
      'Browse free Perler bead patterns and templates, then customize animal, kawaii, game, food and holiday designs in the PixelBeads editor.',
    priority: '0.7',
    body: `
      <h1>Free Perler Bead Patterns and Templates</h1>
      <p>Plan animal, game, food, nature, geometric and holiday bead projects with board size guidance for simple and detailed designs.</p>
      <h2>Printable Pattern Ideas</h2>
      <p>Download PNG, SVG and material lists, or open a template in the editor to adjust colors before building.</p>
    `,
  },
  {
    path: '/guide',
    title: 'How to Make Perler Bead Patterns from Photos',
    description:
      'Learn how to turn a photo into a Perler bead pattern, choose the right grid size, match real bead colors and export a printable bead art grid.',
    priority: '0.7',
    body: `
      <h1>How to Make Perler Bead Patterns from Photos</h1>
      <p>Start with a clear photo, upload it to PixelBeads, choose a Perler, Hama, Artkal or MARD palette, then export a printable pattern.</p>
      <h2>Image to Perler Beads Workflow</h2>
      <p>The best results come from a clean subject, a realistic bead grid width and a color limit that matches your available beads.</p>
      <h2>Step-by-Step Guide</h2>
      <ol>
        <li>Choose a high-contrast image with a clear subject.</li>
        <li>Upload a JPG or PNG file to the photo-to-pattern tool.</li>
        <li>Adjust grid width, color limit and dithering style.</li>
        <li>Download a PDF or PNG with a color chart and bead count.</li>
      </ol>
    `,
  },
  {
    path: '/faq',
    title: 'Perler Bead Pattern Maker FAQ | Image to Beads Help',
    description:
      'Answers about image to Perler beads conversion, supported image formats, privacy, printing, color matching, bead brands and generated patterns.',
    priority: '0.6',
    body: `
      <h1>Perler Bead Pattern Maker FAQ</h1>
      <p>PixelBeads is free, supports JPG and PNG images, processes photos locally in your browser and exports printable bead patterns.</p>
      <h2>Common Questions</h2>
      <p>Supported brands include Perler, Hama, Artkal and MARD. Patterns can be exported as PDF or PNG and edited before printing.</p>
    `,
  },
  {
    path: '/calculator',
    title: 'Perler Bead Calculator | Estimate Bead Counts',
    description:
      'Estimate bead counts and project size for Perler bead, Hama bead, Artkal and MARD patterns before starting a fuse bead project.',
    priority: '0.7',
    body: `
      <h1>Perler Bead Calculator</h1>
      <p>Estimate material needs for bead art projects and plan the size of your pattern before exporting.</p>
    `,
  },
  {
    path: '/about',
    title: 'About PixelBeads | Free Perler Bead Pattern Generator',
    description:
      'PixelBeads is a free online tool for converting photos into printable Perler bead, Hama bead, Artkal and MARD patterns.',
    priority: '0.5',
    body: `
      <h1>About PixelBeads</h1>
      <p>PixelBeads helps crafters convert images into accurate bead art patterns with brand palette matching and local processing.</p>
    `,
  },
  {
    path: '/contact',
    title: 'Contact PixelBeads',
    description:
      'Contact PixelBeads with feedback, questions or feature requests about the free Perler bead pattern maker.',
    priority: '0.3',
    body: `
      <h1>Contact PixelBeads</h1>
      <p>Send feedback, feature requests or questions about the PixelBeads pattern maker.</p>
    `,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | PixelBeads',
    description:
      'Read the PixelBeads privacy policy, including browser-side image processing, analytics and data retention information.',
    priority: '0.3',
    body: `
      <h1>Privacy Policy</h1>
      <p>PixelBeads processes uploaded images locally in your browser and uses limited analytics to improve the service.</p>
    `,
  },
  {
    path: '/terms',
    title: 'Terms of Service | PixelBeads',
    description:
      'Read the PixelBeads terms of service for using the online Perler bead pattern maker and related export tools.',
    priority: '0.3',
    body: `
      <h1>Terms of Service</h1>
      <p>These terms describe acceptable use of PixelBeads and the online bead pattern creation tools.</p>
    `,
  },
];

const escapeAttr = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const pageUrl = (path) => `${siteUrl}${path === '/' ? '/' : `${path}/`}`;

function upsertHeadTag(html, pattern, tag) {
  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function replaceOrInsertMeta(html, page) {
  const url = pageUrl(page.path);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': page.path === '/' ? 'WebApplication' : 'WebPage',
    name: page.title,
    description: page.description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'PixelBeads',
      url: `${siteUrl}/`,
    },
  };

  let next = html
    .replace(/<title>.*?<\/title>/s, `<title>${escapeAttr(page.title)}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/s, `<meta name="description" content="${escapeAttr(page.description)}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/s, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/s, `<meta property="og:title" content="${escapeAttr(page.title)}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/?>/s, `<meta property="og:description" content="${escapeAttr(page.description)}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/s, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/s, `<meta name="twitter:title" content="${escapeAttr(page.title)}" />`)
    .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/s, `<meta name="twitter:description" content="${escapeAttr(page.description)}" />`)
    .replace(/<script type="application\/ld\+json">.*?<\/script>/s, `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);

  next = upsertHeadTag(next, /<meta property="og:image" content=".*?"\s*\/?>/s, `<meta property="og:image" content="${socialImageUrl}" />`);
  next = upsertHeadTag(next, /<meta name="twitter:image" content=".*?"\s*\/?>/s, `<meta name="twitter:image" content="${socialImageUrl}" />`);
  next = upsertHeadTag(next, /<meta name="twitter:card" content=".*?"\s*\/?>/s, '<meta name="twitter:card" content="summary_large_image" />');

  if (!/<meta name="robots"/.test(next)) {
    next = next.replace('</head>', '    <meta name="robots" content="index, follow" />\n  </head>');
  }

  return next;
}

function injectSeoContent(html, page) {
  const style = `
    <style id="seo-prerender-style">
      #seo-prerender{font-family:Inter,Arial,sans-serif;background:#1a1a1a;color:#e8e6e3;padding:96px 20px 48px}
      #seo-prerender div{max-width:840px;margin:0 auto}
      #seo-prerender h1{font-size:40px;line-height:1.1;margin:0 0 16px}
      #seo-prerender h2{font-size:24px;margin:28px 0 10px}
      #seo-prerender p,#seo-prerender li{color:#a09b94;font-size:18px;line-height:1.65}
    </style>`;
  const content = `<section id="seo-prerender" aria-label="Page summary"><div>${page.body}</div></section>`;
  return html.replace('</head>', `${style}\n  </head>`).replace('<div id="root"></div>', `${content}\n    <div id="root"></div>`);
}

for (const page of pages) {
  const html = injectSeoContent(replaceOrInsertMeta(baseHtml, page), page);
  const file = page.path === '/' ? join(dist, 'index.html') : join(dist, page.path.slice(1), 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, 'utf8');
}

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${pageUrl(page.path)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Prerendered SEO HTML for ${pages.length} routes.`);
