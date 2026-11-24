// usage: node diff.cjs <dirA> <dirB> [diffOutDir]
const fs = require('node:fs');
const path = require('node:path');
const NM = '~/Work/Personal/React-table/shadcn-react-table.worktrees/08/node_modules';
const { PNG } = require(path.join(NM, 'pngjs'));
const pm = require(path.join(NM, 'pixelmatch'));
const pixelmatch = pm.default || pm;
const [a, b, outDir] = process.argv.slice(2);
if (outDir) fs.mkdirSync(outDir, { recursive: true });
const files = fs.readdirSync(a).filter((f) => f.endsWith('.png')).sort();
let differing = 0;
for (const f of files) {
  if (!fs.existsSync(path.join(b, f))) { console.log(`MISSING ${f}`); differing++; continue; }
  const A = PNG.sync.read(fs.readFileSync(path.join(a, f)));
  const B = PNG.sync.read(fs.readFileSync(path.join(b, f)));
  if (A.width !== B.width || A.height !== B.height) { console.log(`SIZE ${f}`); differing++; continue; }
  const D = new PNG({ width: A.width, height: A.height });
  const n = pixelmatch(A.data, B.data, D.data, A.width, A.height, { threshold: 0.1 });
  if (n) {
    differing++;
    console.log(`DIFF ${f} ${n}px`);
    if (outDir) fs.writeFileSync(path.join(outDir, f), PNG.sync.write(D));
  }
}
console.log(`${files.length} compared, ${differing} differ`);
