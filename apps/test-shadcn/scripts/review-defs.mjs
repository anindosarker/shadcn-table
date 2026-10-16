#!/usr/bin/env node
// Usage (inside apps/test-shadcn): pnpm review SRT_TableHead
// Opens two VS Code diff tabs: the component pair, and a generated pair of
// "defs" files holding every core/MUI definition each component consumes.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);
const SRT_DIR = path.join(
  ROOT,
  'apps/test-shadcn/src/components/ui/shadcn-react-table',
);
const CORE_DIR = SRT_DIR;
const MRT_PKG = path.join(ROOT, 'packages/material-react-table');
const MRT_DIR = path.join(MRT_PKG, 'src');
const OUT_DIR = path.join(os.tmpdir(), 'srt-review');

const arg = process.argv[2];
if (!arg) {
  console.error('usage: pnpm review <SRT_ComponentName | path/to/SRT_X.tsx>');
  process.exit(1);
}

// ---------- helpers ----------
const walk = (dir, exts) => {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, exts));
    else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
};

const findFile = (dir, base) =>
  walk(dir, ['.ts', '.tsx']).find(
    (p) => path.basename(p).replace(/\.tsx?$/, '') === base,
  );

const rel = (p) => {
  const r = path.relative(ROOT, p);
  const m = r.match(/node_modules\/(@mui\/.*)$/);
  return m ? m[1] : r;
};

// Extract a top-level or member definition block starting at `startLine` (0-based).
// Includes directly preceding comment lines. Ends when bracket depth returns to 0
// and the line terminates the statement.
const extractBlock = (lines, startLine) => {
  let s = startLine;
  while (s > 0 && /^\s*(\/\/|\/\*|\*)/.test(lines[s - 1])) s--;
  let depth = 0;
  let opened = false;
  let e = startLine;
  for (; e < lines.length; e++) {
    const code = lines[e]
      .replace(/\/\/.*$/, '')
      .replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g, '');
    for (const ch of code) {
      if ('{([<'.includes(ch) && ch !== '<') {
        depth++;
        opened = true;
      } else if ('})]'.includes(ch)) depth--;
    }
    const t = lines[e].trim();
    if (depth <= 0 && (opened || /;$/.test(t)) && /[;})]$/.test(t)) break;
    if (
      depth <= 0 &&
      !opened &&
      /^(export )?(type|interface) /.test(lines[startLine]) &&
      /[;]$/.test(t)
    )
      break;
  }
  return lines.slice(s, e + 1).join('\n');
};

const findDef = (file, name) => {
  if (!file || !fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const esc = name.replace(/[$]/g, '\\$');
  const pats = [
    new RegExp(
      `^export\\s+(declare\\s+)?(const|let|function|type|interface|enum|class)\\s+${esc}\\b`,
    ),
    new RegExp(`^(declare\\s+)?(const|function|type|interface)\\s+${esc}\\b`),
    new RegExp(`^\\s{2}${esc}\\??:`), // member of an options/props interface
  ];
  for (const re of pats) {
    const i = lines.findIndex((l) => re.test(l));
    if (i >= 0) return { file, line: i + 1, text: extractBlock(lines, i) };
  }
  return null;
};

const findDefIn = (files, name) => {
  for (const f of files) {
    const d = findDef(f, name);
    if (d) return d;
  }
  return null;
};

const section = (title, def) =>
  def
    ? `// ───────── ${title}  (${rel(def.file)}:${def.line})\n${def.text}\n\n`
    : `// ───────── ${title}  (not found)\n\n`;

// ---------- resolve component pair ----------
const srtBase = path.basename(arg).replace(/\.tsx?$/, '');
const srtFile = fs.existsSync(arg)
  ? path.resolve(arg)
  : findFile(SRT_DIR, srtBase);
if (!srtFile) {
  console.error(`SRT file not found: ${srtBase}`);
  process.exit(1);
}
const mrtBase = srtBase
  .replace(/^SRT_/, 'MRT_')
  .replace(/^ShadcnReactTable$/, 'MaterialReactTable');
const mrtFile = findFile(MRT_DIR, mrtBase);
if (!mrtFile) {
  console.error(`MRT twin not found: ${mrtBase}`);
  process.exit(1);
}

const srtSrc = fs.readFileSync(srtFile, 'utf8');
const mrtSrc = fs.readFileSync(mrtFile, 'utf8');

// ---------- collect symbols ----------
const importNames = (src, specRe) => {
  const out = [];
  const re =
    /import\s+(type\s+)?(\{[^}]*\}|[\w$]+)(?:\s*,\s*\{([^}]*)\})?\s+from\s+'([^']+)'/g;
  let m;
  while ((m = re.exec(src))) {
    const spec = m[4];
    if (!specRe.test(spec)) continue;
    const named = [m[2].startsWith('{') ? m[2] : '', m[3] ?? '']
      .join(',')
      .replace(/[{}]/g, '')
      .split(',')
      .map((s) => s.replace(/^\s*type\s+/, '').trim())
      .filter(Boolean);
    const def = m[2].startsWith('{') ? null : m[2];
    out.push({ spec, named, def });
  }
  return out;
};

const uniq = (a) => [...new Set(a)];

// SRT: core imports (relative, like MRT) + srt*Props slots referenced in body
const srtCore = importNames(
  srtSrc,
  /^(?:\.\.?\/)+(?:types|icons|utils\/|hooks\/|fns\/)/,
).flatMap((i) => i.named);
const srtSlots = uniq(srtSrc.match(/\bsrt[A-Z]\w*Props\b/g) ?? []);
const srtSymbols = uniq([...srtCore, ...srtSlots]);

// MRT: local imports (types/utils/hooks) + mui*Props slots + @mui imports
const mrtLocal = importNames(mrtSrc, /^\.\.?\//).flatMap((i) => i.named);
const mrtSlots = uniq(mrtSrc.match(/\bmui[A-Z]\w*Props\b/g) ?? []);
const mrtMui = importNames(mrtSrc, /^@mui\//);

const coreFiles = walk(CORE_DIR, ['.ts']).filter(
  (p) => !p.includes('/locales/'),
);
const mrtFiles = walk(MRT_DIR, ['.ts']).filter(
  (p) => !p.includes('/locales/') && !p.includes('/components/'),
);

const muiDts = (spec) => {
  // '@mui/material/TableHead' -> node_modules/@mui/material/TableHead/TableHead.d.ts
  const parts = spec.split('/');
  const pkg = parts.slice(0, 2).join('/');
  const sub = parts[2];
  if (!sub) return null;
  const base = path.join(MRT_PKG, 'node_modules', pkg, sub);
  for (const cand of [
    path.join(base, `${sub}.d.ts`),
    path.join(base, 'index.d.ts'),
  ])
    if (fs.existsSync(cand)) return fs.realpathSync(cand);
  return null;
};

// MRT twin name for an SRT symbol
const twinName = (n) =>
  n
    .replace(/^SRT_/, 'MRT_')
    .replace(/^srt([A-Z])/, 'mui$1')
    .replace(/^useSRT_/, 'useMRT_');

// ---------- build defs ----------
let srtOut = `// SRT defs for ${rel(srtFile)}\n\n`;
let mrtOut = `// MRT defs for ${rel(mrtFile)}\n\n`;
const usedMrt = new Set();
const printed = new Set();
const key = (d) => `${d.file}:${d.line}`;

for (const name of srtSymbols) {
  const sDef = findDefIn(coreFiles, name);
  srtOut += section(name, sDef);

  const twin = twinName(name);
  let mDef = findDefIn(mrtFiles, twin);
  let title = twin;
  if (!mDef) {
    // DOM alias (TableHeadProps etc.) -> MUI type of the same name imported by MRT
    // SRT_PaginationProps -> MUI PaginationProps; TableHeadProps -> MUI TableHeadProps
    const bare = name.replace(/^SRT_/, '');
    const mui = mrtMui.find((i) => i.named.includes(bare));
    if (mui) {
      const dts = muiDts(mui.spec);
      mDef = findDef(dts, bare);
      title = `${bare} (MUI)`;
      if (mDef) usedMrt.add(bare);
      const sub = mui.spec.split('/')[2];
      const own = findDef(dts, `${sub}OwnProps`);
      if (own) {
        printed.add(key(own));
        mDef = mDef ? { ...mDef, text: `${mDef.text}\n\n${own.text}` } : own;
      }
    }
  }
  if (mDef) {
    usedMrt.add(twin);
    printed.add(key(mDef));
  }
  mrtOut += section(title, mDef);
}

// MRT-only: local symbols/slots SRT never imports, then remaining MUI imports
for (const name of uniq([...mrtLocal, ...mrtSlots])) {
  if (usedMrt.has(name)) continue;
  const d = findDefIn(mrtFiles, name);
  if (!d || printed.has(key(d))) continue;
  printed.add(key(d));
  srtOut += `// ───────── ${name}  (no SRT counterpart imported)\n\n`;
  mrtOut += section(`${name} (MRT only)`, d);
}
for (const mui of mrtMui) {
  const sub = mui.spec.split('/')[2];
  const dts = muiDts(mui.spec);
  if (!dts) continue;
  const names = [...mui.named, ...(sub ? [`${sub}OwnProps`] : [])].filter(
    (n) => !usedMrt.has(n),
  );
  const seen = new Set();
  for (const n of names) {
    if (seen.has(n)) continue;
    seen.add(n);
    const d = findDef(dts, n);
    if (!d) continue;
    if (printed.has(key(d))) continue;
    printed.add(key(d));
    srtOut += `// ───────── ${n}  (MUI only; SRT uses shadcn/DOM instead)\n\n`;
    mrtOut += section(`${n} (MUI)`, d);
  }
}

// ---------- write + open ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
const srtDefs = path.join(OUT_DIR, `${srtBase}.defs.ts`);
const mrtDefs = path.join(OUT_DIR, `${mrtBase}.defs.ts`);
fs.writeFileSync(srtDefs, srtOut);
fs.writeFileSync(mrtDefs, mrtOut);

console.log(`component: ${rel(srtFile)}  <->  ${rel(mrtFile)}`);
console.log(`defs:      ${srtDefs}  <->  ${mrtDefs}`);
console.log(`symbols:   ${srtSymbols.join(', ') || '(none)'}`);

if (!process.env.NO_OPEN) {
  try {
    execSync(`code --diff "${mrtFile}" "${srtFile}"`, { stdio: 'ignore' });
    execSync(`code --diff "${mrtDefs}" "${srtDefs}"`, { stdio: 'ignore' });
  } catch {
    console.log('(`code` CLI not on PATH; open the paths above manually)');
  }
}
