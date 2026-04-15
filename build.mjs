import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');

// Clean and create dist (synchronous to avoid race conditions)
if (existsSync(DIST)) rmSync(DIST, { recursive: true });
mkdirSync(DIST, { recursive: true });
mkdirSync(join(DIST, 'css'), { recursive: true });
mkdirSync(join(DIST, 'js'), { recursive: true });
mkdirSync(join(DIST, 'images'), { recursive: true });
mkdirSync(join(DIST, 'assets'), { recursive: true });

// Copy static assets
if (existsSync(join(__dirname, 'images'))) cpSync(join(__dirname, 'images'), join(DIST, 'images'), { recursive: true });
if (existsSync(join(__dirname, 'assets'))) cpSync(join(__dirname, 'assets'), join(DIST, 'assets'), { recursive: true });
if (existsSync(join(__dirname, 'favicon.svg'))) cpSync(join(__dirname, 'favicon.svg'), join(DIST, 'favicon.svg'));
if (existsSync(join(__dirname, 'manifest.json'))) cpSync(join(__dirname, 'manifest.json'), join(DIST, 'manifest.json'));
if (existsSync(join(__dirname, 'sitemap.xml'))) cpSync(join(__dirname, 'sitemap.xml'), join(DIST, 'sitemap.xml'));
if (existsSync(join(__dirname, 'robots.txt'))) cpSync(join(__dirname, 'robots.txt'), join(DIST, 'robots.txt'));

console.log('✓ Static assets copied');

// Optimize images (requires sharp — optional)
try {
  const sharp = (await import('sharp')).default;
  
  const optimizeDir = async (dir, maxWidth) => {
    if (!existsSync(dir)) return 0;
    let count = 0;
    for (const file of readdirSync(dir)) {
      const filePath = join(dir, file);
      const ext = extname(file).toLowerCase();
      
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        await sharp(filePath)
          .resize(maxWidth, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(webpPath);
        count++;
      }
    }
    return count;
  };
  
  const imgCount = await optimizeDir(join(DIST, 'images'), 1920);
  const assetCount = await optimizeDir(join(DIST, 'assets'), 800);
  console.log(`✓ Images optimized: ${imgCount} hero + ${assetCount} assets (WebP 80%)`);
} catch {
  console.log('⚠ sharp not found — skipping image optimization. Install with: npm install -D sharp');
}

// Bundle and minify JS with esbuild
let jsOutFile = 'js/main.js';
try {
  const { build } = await import('esbuild');
  await build({
    entryPoints: [join(__dirname, 'js/main.js')],
    bundle: true,
    minify: true,
    outdir: join(DIST, 'js'),
    format: 'esm',
    target: ['es2020'],
  });

  // Add content hash to JS
  const jsContent = readFileSync(join(DIST, 'js/main.js'), 'utf-8');
  const jsHash = createHash('md5').update(jsContent).digest('hex').slice(0, 8);
  const jsHashed = `js/main.${jsHash}.js`;
  writeFileSync(join(DIST, jsHashed), jsContent);
  rmSync(join(DIST, 'js/main.js'));
  jsOutFile = jsHashed;
  console.log(`✓ JS bundled, minified → ${jsHashed}`);
} catch {
  console.log('⚠ esbuild not found, copying JS files as-is (no hashing)');
  cpSync(join(__dirname, 'js'), join(DIST, 'js'), { recursive: true });
}

// Scripts referenced from HTML but not part of the main bundle (must exist in dist/)
const inlineScriptSrc = join(__dirname, 'js/inline-script.js');
if (existsSync(inlineScriptSrc)) {
  cpSync(inlineScriptSrc, join(DIST, 'js/inline-script.js'));
  console.log('✓ Copied js/inline-script.js (theme / no-js hook)');
}

// Concatenate CSS
const cssFiles = ['css/tokens.css', 'css/base.css', 'css/components.css', 'css/layout.css'];
let css = cssFiles.map(f => readFileSync(join(__dirname, f), 'utf-8')).join('\n');

// Try esbuild CSS minification first (proper parser-based)
let cssMinified = false;
try {
  const { transform } = await import('esbuild');
  const result = await transform(css, { loader: 'css', minify: true });
  css = result.code;
  cssMinified = true;
  console.log('✓ CSS minified via esbuild (parser-based)');
} catch {
  // Fallback: regex-based minification preserving url() and calc()
  css = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{};>~+])\s*/g, '$1')
    .replace(/\s*([:,])\s*/g, (_, c, offset, str) => {
      const before = str.slice(0, offset);
      const openParens = (before.match(/\(/g) || []).length;
      const closeParens = (before.match(/\)/g) || []).length;
      return openParens > closeParens ? ` ${c} ` : c;
    })
    .replace(/;\s*}/g, '}')
    .replace(/\s+/g, ' ')
    .replace(/url\(\s*/g, 'url(')
    .replace(/url\([^)]*?\s*\)/g, (m) => m.replace(/\s*\)/, ')'))
    .trim();
  console.log('⚠ CSS minified via regex fallback — install esbuild for proper minification');
}

// Add content hash to CSS
const cssHash = createHash('md5').update(css).digest('hex').slice(0, 8);
const cssHashed = `css/styles.${cssHash}.css`;
writeFileSync(join(DIST, cssHashed), css);
console.log(`✓ CSS → ${cssHashed} (${(css.length / 1024).toFixed(1)}KB)`);

// Process HTML — update references for production
let html = readFileSync(join(__dirname, 'index.html'), 'utf-8');

// Strip HTML comments from production output
html = html.replace(/<!--[\s\S]*?-->/g, '');

// Replace multiple local CSS link tags with single hashed CSS
let cssReplaced = false;
html = html.replace(
  /<link\s+rel="stylesheet"\s+href="css\/[^"]+\.css"[^>]*>/g,
  () => {
    if (!cssReplaced) {
      cssReplaced = true;
      return `<link rel="stylesheet" href="${cssHashed}">`;
    }
    return '';
  }
);

// Replace JS reference with hashed version (both script src and modulepreload href)
html = html.replace(
  /src="js\/main\.js"/,
  `src="${jsOutFile}"`
);
html = html.replace(
  /href="js\/main\.js"/,
  `href="${jsOutFile}"`
);

writeFileSync(join(DIST, 'index.html'), html);
console.log('✓ HTML processed with hashed asset references');

// Summary
console.log('\n📦 Build complete! Output in ./dist/');
console.log(`   CSS: ${cssHashed} (${(css.length / 1024).toFixed(1)}KB)`);
console.log(`   JS:  ${jsOutFile}`);
console.log('   Preview with: npx serve dist -p 3001\n');
