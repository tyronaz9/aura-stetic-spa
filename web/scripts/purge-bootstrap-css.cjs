const fs = require('node:fs/promises');
const path = require('node:path');
const { PurgeCSS } = require('purgecss');

const root = path.resolve(__dirname, '..');
const bootstrapCss = 'src/app/bootstrap-5.3.8-dist/css/bootstrap.min.css';
const outputCss = path.join(root, 'src', 'app', 'bootstrap-used.css');

async function main() {
  const results = await new PurgeCSS().purge({
    content: ['src/**/*.html', 'src/**/*.ts'],
    css: [bootstrapCss],
  });

  if (results.length !== 1 || !results[0].css) {
    throw new Error('No se pudo generar el CSS de Bootstrap usado por las plantillas.');
  }

  await fs.writeFile(outputCss, results[0].css);
  const originalSize = (await fs.stat(path.join(root, bootstrapCss))).size;
  const optimizedSize = Buffer.byteLength(results[0].css);
  console.log(
    `Bootstrap CSS: ${Math.round(originalSize / 1024)} KiB -> ${Math.round(optimizedSize / 1024)} KiB`,
  );
}

main().catch((error) => {
  console.error('No se pudo optimizar Bootstrap CSS:', error);
  process.exitCode = 1;
});
